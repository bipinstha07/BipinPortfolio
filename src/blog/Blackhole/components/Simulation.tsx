
import React, { useRef, useEffect } from 'react';
import { SimSettings } from '../types';

interface SimulationProps {
  settings: SimSettings;
  onSettingChange: (key: keyof SimSettings, value: number) => void;
}

export const Simulation: React.FC<SimulationProps> = ({ settings, onSettingChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());
  
  const cameraRotationRef = useRef({ yaw: 0, pitch: settings.tilt });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      
      cameraRotationRef.current.yaw -= dx * 0.005;
      cameraRotationRef.current.pitch += dy * 0.005;
      cameraRotationRef.current.pitch = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, cameraRotationRef.current.pitch));
      
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.05;
      const delta = e.deltaY * zoomSpeed;
      const newDist = Math.max(4.0, Math.min(40.0, settings.cameraDistance + delta));
      onSettingChange('cameraDistance', newDist);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [settings.cameraDistance, onSettingChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const vertexShaderSource = `#version 300 es
      in vec4 position;
      void main() {
        gl_Position = position;
      }
    `;

    const fragmentShaderSource = `#version 300 es
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec3 iCameraPos;
      uniform mat3 iCameraMatrix;
      uniform float iMass;
      uniform float iDiscSize;
      uniform float iRotationSpeed;
      uniform float iGlowIntensity;
      uniform float iFOV;
      uniform float iBloom;
      uniform float iLensingStrength;
      uniform bool iLensing;

      out vec4 fragColor;

      #define PI 3.14159265359

      vec3 bh = vec3(0.0);
      float r_bar; 
      float disc_r_orig;
      vec3 disc_n = vec3(0.0, 1.0, 0.0);
      vec3 disc_s = vec3(1.0, 0.0, 0.0);

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 6; ++i) {
          v += a * noise(p);
          p *= 2.1;
          a *= 0.5;
        }
        return v;
      }


      vec4 get_disc_color(vec3 p_disc, float disc_r) {
        vec3 v = p_disc - bh;
        float d = length(v);
        v /= d;
        if (d < disc_r && d > r_bar) {
          float angle = atan(dot(v, disc_s), dot(v, cross(disc_s, disc_n)));
          vec2 uv = vec2(angle / (2.0 * PI) - iTime * iRotationSpeed, (d - r_bar) / (disc_r - r_bar));
          
          float n = fbm(vec2(uv.x * 18.0, uv.y * 5.0));
          float spiral = sin(uv.x * 48.0 + uv.y * 8.0 - iTime * iRotationSpeed * 4.0) * 0.5 + 0.5;
          n = mix(n, n * spiral, 0.35);
          float density = smoothstep(disc_r, r_bar + 0.35, d) * smoothstep(r_bar, r_bar + 0.35, d);
          
          vec3 view_dir = normalize(iCameraPos - p_disc);
          vec3 tangent = normalize(cross(disc_n, v));
          float doppler = dot(tangent, view_dir);
          float approach = max(doppler, 0.0);
          float recede = max(-doppler, 0.0);
          
          vec3 hot = vec3(1.0, 0.97, 0.88);
          vec3 warm = vec3(1.0, 0.68, 0.36);
          vec3 cool = vec3(0.55, 0.22, 0.05);
          vec3 base_col = mix(cool, warm, smoothstep(0.0, 0.75, n));
          base_col = mix(base_col, hot, pow(n, 1.8) * approach * 0.85);
          base_col = mix(base_col, vec3(0.55, 0.12, 0.02), recede * 0.45);
          
          float dopplerBoost = 1.0 + approach * 3.2;
          float recedeDim = 1.0 - recede * 0.55;
          base_col *= dopplerBoost * recedeDim * iGlowIntensity;
          base_col *= 1.2 + 4.5 * pow(n, 1.3);
          return vec4(base_col, density * (0.82 + 0.18 * n));
        }
        return vec4(0.0);
      }

      void main() {
        r_bar = 2.4 * iMass;
        disc_r_orig = r_bar * iDiscSize;
        
        vec2 iplane_size = 2.0 * iFOV * vec2(iResolution.x / iResolution.y, 1.0);
        vec2 ixy = (gl_FragCoord.xy / iResolution.xy - 0.5) * iplane_size;
        vec3 ray_dir = iCameraMatrix * normalize(vec3(ixy, -1.8));
        
        // Initialize color to black (no background)
        vec3 color = vec3(0.0);

        vec3 h2e = iCameraPos - bh;
        float l2_h2e = dot(h2e, h2e);
        float rm = length(cross(ray_dir, h2e));
        float t_cp = sqrt(l2_h2e - rm * rm);
        
        // Dynamic Lensing Strength
        float alpha = iLensing ? (4.0 * iMass * iLensingStrength / (rm + 0.001)) : 0.0;
        
        float disc_r = disc_r_orig;
        if (rm < r_bar * 1.08) {
            alpha *= (1.2 + 0.2 * iLensingStrength);
            disc_r *= 1.1;
        }

        float tan_a_2 = tan(alpha * 0.5);
        vec3 cp = iCameraPos + ray_dir * t_cp;
        vec3 coord_origin = cp + ray_dir * (rm * tan_a_2);
        
        vec3 x_axis = normalize(bh - coord_origin);
        vec3 y_axis = normalize(ray_dir + tan_a_2 * normalize(bh - cp));
        vec3 z_axis = cross(x_axis, y_axis);
        
        float c_val = length(bh - coord_origin);
        vec3 iline_r = normalize(cross(z_axis, disc_n));
        
        float x1 = -1.0, x2 = -1.0, y1, y2;
        float k2 = tan_a_2 * tan_a_2;
        float b2 = (c_val * c_val) / (1.0 + k2);
        float a2 = k2 * b2;

        float denom = dot(x_axis, iline_r);
        if (abs(denom) > 0.0001) {
          float slope = dot(y_axis, iline_r) / denom;
          float s2 = slope * slope;
          float A = a2 * s2 - b2;
          float B = -2.0 * a2 * s2 * c_val;
          float C = a2 * (s2 * c_val * c_val + b2);
          float delta = B * B - 4.0 * A * C;
          if (delta >= 0.0) {
            float sqrtDelta = sqrt(delta);
            x1 = (-B - sqrtDelta) / (2.0 * A);
            x2 = (-B + sqrtDelta) / (2.0 * A);
            y1 = slope * (x1 - c_val);
            y2 = slope * (x2 - c_val);
          }
        }

        vec3 o2e = iCameraPos - coord_origin;
        float yeye = dot(o2e, y_axis);
        
        vec3 p1 = coord_origin + x1 * x_axis + y1 * y_axis;
        vec3 p2 = coord_origin + x2 * x_axis + y2 * y_axis;

        if (x1 >= 0.0 && y1 >= yeye) {
          if ((y1 < 0.0 && length(p1 - bh) > r_bar) || rm > r_bar) {
            vec4 dc = get_disc_color(p1, disc_r);
            color = mix(color, dc.rgb, dc.a);
          }
        }
        if (x2 >= 0.0 && y2 >= yeye) {
          if ((y2 < 0.0 && length(p2 - bh) > r_bar) || rm > r_bar) {
            vec4 dc = get_disc_color(p2, disc_r);
            color = mix(color, dc.rgb, dc.a);
          }
        }

        // Volumetric Bloom
        float bloom_factor = exp(-pow(rm - r_bar, 2.0) * 1.2) * iBloom;
        color += vec3(1.0, 0.68, 0.36) * bloom_factor * 0.35 * iGlowIntensity;

        // Photon Ring
        float photon_ring = smoothstep(r_bar + 0.05, r_bar, rm) * smoothstep(r_bar - 0.025, r_bar, rm);
        color += vec3(1.0, 0.95, 0.82) * photon_ring * (2.5 + iLensingStrength);

        // Event Horizon shadow
        if (rm < r_bar) {
           color *= smoothstep(r_bar * 0.8, r_bar, rm);
        }

        fragColor = vec4(color, 1.0);
      }
    `;

    const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram();
    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!program || !vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      resolution: gl.getUniformLocation(program, 'iResolution'),
      time: gl.getUniformLocation(program, 'iTime'),
      camPos: gl.getUniformLocation(program, 'iCameraPos'),
      camMatrix: gl.getUniformLocation(program, 'iCameraMatrix'),
      mass: gl.getUniformLocation(program, 'iMass'),
      discSize: gl.getUniformLocation(program, 'iDiscSize'),
      rotSpeed: gl.getUniformLocation(program, 'iRotationSpeed'),
      glow: gl.getUniformLocation(program, 'iGlowIntensity'),
      fov: gl.getUniformLocation(program, 'iFOV'),
      bloom: gl.getUniformLocation(program, 'iBloom'),
      lensingStr: gl.getUniformLocation(program, 'iLensingStrength'),
      lensing: gl.getUniformLocation(program, 'iLensing')
    };

    const animate = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      const time = (Date.now() - startTimeRef.current) / 1000;
      
      const yaw = cameraRotationRef.current.yaw;
      const pitch = cameraRotationRef.current.pitch;
      const dist = settings.cameraDistance;
      
      const camX = dist * Math.cos(pitch) * Math.sin(yaw);
      const camY = dist * Math.sin(pitch);
      const camZ = dist * Math.cos(pitch) * Math.cos(yaw);
      const camPos = [camX, camY, camZ];

      const zAxis = [camX / dist, camY / dist, camZ / dist];
      const up = [0, 1, 0];
      const xAxisRaw = [
        up[1] * zAxis[2] - up[2] * zAxis[1],
        up[2] * zAxis[0] - up[0] * zAxis[2],
        up[0] * zAxis[1] - up[1] * zAxis[0]
      ];
      const xLen = Math.sqrt(xAxisRaw[0]**2 + xAxisRaw[1]**2 + xAxisRaw[2]**2);
      const xAxis = xAxisRaw.map(v => v / xLen);
      const yAxis = [
        zAxis[1] * xAxis[2] - zAxis[2] * xAxis[1],
        zAxis[2] * xAxis[0] - zAxis[0] * xAxis[2],
        zAxis[0] * xAxis[1] - zAxis[1] * xAxis[0]
      ];
      const camMatrix = [...xAxis, ...yAxis, ...zAxis];

      gl.uniform2f(locs.resolution, width, height);
      gl.uniform1f(locs.time, time);
      gl.uniform3fv(locs.camPos, camPos);
      gl.uniformMatrix3fv(locs.camMatrix, false, camMatrix);
      gl.uniform1f(locs.mass, settings.mass);
      gl.uniform1f(locs.discSize, settings.discSize);
      gl.uniform1f(locs.rotSpeed, settings.rotationSpeed);
      gl.uniform1f(locs.glow, settings.glowIntensity);
      gl.uniform1f(locs.fov, settings.fieldOfView);
      gl.uniform1f(locs.bloom, settings.bloom);
      gl.uniform1f(locs.lensingStr, settings.lensingStrength);
      gl.uniform1i(locs.lensing, settings.lensingEnabled ? 1 : 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [settings]);

  return (
    <div className="w-full h-full relative group cursor-grab active:cursor-grabbing">
      <canvas ref={canvasRef} className="w-full h-full outline-none" tabIndex={0} />
      {/* Zoom indicator feedback */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
        <div className="w-48 h-48 border border-white/10 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20" />
      </div>
    </div>
  );
};
