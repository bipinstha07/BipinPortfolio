import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SimulationParams } from '../types';

const EVENT_HORIZON_RADIUS = 10.0;

const hexToVec3 = (hex: string): THREE.Vector3 => {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
};

const accretionDiskShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    iResolution: { value: new THREE.Vector2() },
    iTime: { value: 0 },
    iCameraPos: { value: new THREE.Vector3() },
    iCameraMatrix: { value: new THREE.Matrix3() },
    iEventHorizon: { value: EVENT_HORIZON_RADIUS },
    iDiscSize: { value: 4.2 },
    iRotationSpeed: { value: 0.15 },
    iGlowIntensity: { value: 1.0 },
    iTurbulence: { value: 1.0 },
    iDiskColor: { value: new THREE.Vector3(1.0, 0.68, 0.36) },
    iFOV: { value: 0.55 },
    iBloom: { value: 1.2 },
    iLensingStrength: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec3 iCameraPos;
    uniform mat3 iCameraMatrix;
    uniform float iEventHorizon;
    uniform float iDiscSize;
    uniform float iRotationSpeed;
    uniform float iGlowIntensity;
    uniform float iTurbulence;
    uniform vec3 iDiskColor;
    uniform float iFOV;
    uniform float iBloom;
    uniform float iLensingStrength;

    varying vec2 vUv;

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
      if (d >= disc_r || d <= r_bar) return vec4(0.0);
      v /= d;

      float angle = atan(dot(v, disc_s), dot(v, cross(disc_s, disc_n)));
      vec2 uv = vec2(angle / (2.0 * PI) - iTime * iRotationSpeed, (d - r_bar) / (disc_r - r_bar));

      float n = fbm(vec2(uv.x * 18.0 * iTurbulence, uv.y * 5.0 * iTurbulence));
      float spiral = sin(uv.x * 48.0 + uv.y * 8.0 - iTime * iRotationSpeed * 4.0) * 0.5 + 0.5;
      n = mix(n, n * spiral, 0.35);

      float innerEdge = smoothstep(r_bar, r_bar + 0.35, d);
      float outerEdge = smoothstep(disc_r, disc_r * 0.72, d);
      float density = innerEdge * outerEdge;

      vec3 view_dir = normalize(iCameraPos - p_disc);
      vec3 tangent = normalize(cross(disc_n, v));
      float doppler = dot(tangent, view_dir);
      float approach = max(doppler, 0.0);
      float recede = max(-doppler, 0.0);

      vec3 hot = vec3(1.0, 0.97, 0.88);
      vec3 warm = iDiskColor;
      vec3 cool = warm * vec3(0.55, 0.28, 0.08);

      vec3 base_col = mix(cool, warm, smoothstep(0.0, 0.75, n));
      base_col = mix(base_col, hot, pow(n, 1.8) * approach * 0.85);
      base_col = mix(base_col, vec3(0.55, 0.12, 0.02), recede * 0.45);

      float dopplerBoost = 1.0 + approach * 3.2;
      float recedeDim = 1.0 - recede * 0.55;
      base_col *= dopplerBoost * recedeDim * iGlowIntensity;
      base_col *= 1.2 + 4.5 * pow(n, 1.3);

      return vec4(base_col, density * (0.82 + 0.18 * n));
    }

    vec3 trace_accretion_disk(vec3 ray_dir) {
      r_bar = iEventHorizon;
      disc_r_orig = r_bar * iDiscSize;
      float lensMass = iEventHorizon / 2.4;

      vec3 h2e = iCameraPos - bh;
      float l2_h2e = dot(h2e, h2e);
      float rm = length(cross(ray_dir, h2e));
      float t_cp = sqrt(max(l2_h2e - rm * rm, 0.0));

      float alpha = 4.0 * lensMass * iLensingStrength / (rm + 0.001);
      float disc_r = disc_r_orig;
      if (rm < r_bar * 1.08) {
        alpha *= 1.35;
        disc_r *= 1.12;
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

      vec3 color = vec3(0.0);

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

      float bloom_factor = exp(-pow(rm - r_bar, 2.0) * 1.2) * iBloom;
      color += iDiskColor * bloom_factor * 0.35 * iGlowIntensity;

      float photon_ring = smoothstep(r_bar + 0.05, r_bar, rm) * smoothstep(r_bar - 0.025, r_bar, rm);
      color += vec3(1.0, 0.95, 0.82) * photon_ring * (2.5 + iLensingStrength);

      if (rm < r_bar) {
        color *= smoothstep(r_bar * 0.75, r_bar, rm);
      }

      return color;
    }

    void main() {
      vec3 sceneColor = texture2D(tDiffuse, vUv).rgb;

      vec2 iplane_size = 2.0 * iFOV * vec2(iResolution.x / iResolution.y, 1.0);
      vec2 ixy = (gl_FragCoord.xy / iResolution.xy - 0.5) * iplane_size;
      vec3 ray_dir = iCameraMatrix * normalize(vec3(ixy, -1.8));

      vec3 diskColor = trace_accretion_disk(ray_dir);

      vec3 finalColor = sceneColor + diskColor;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

interface BlackHoleCanvasProps {
  params: SimulationParams;
}

const BlackHoleCanvas: React.FC<BlackHoleCanvasProps> = ({ params }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const diskPassRef = useRef<ShaderPass | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  
  // Group to hold all black hole components
  const bhGroupRef = useRef<THREE.Group | null>(null);

  const horizonMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const starMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const tesseractMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const tesseractMeshRef = useRef<THREE.Mesh | null>(null);
  const hoveredRoomRef = useRef<THREE.Vector3 | null>(null); // Store hovered room position
  const clickedRoomsRef = useRef<Set<string>>(new Set()); // Store clicked room grid positions as strings "x,y,z"
  const hoverTransitionRef = useRef<number>(0); // For smooth hover transition

  // Store latest params in ref so animation loop can access current values
  const paramsRef = useRef<SimulationParams>(params);

  // Helper to generate radial streaky texture flowing into event horizon
  const createNoiseTexture = () => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;

    // Create radial streaks pointing toward center (event horizon)
    for (let i = 0; i < 300; i++) {
        // Start from outer edge, point toward center
        const angle = Math.random() * Math.PI * 2;
        const startRadius = Math.random() * 200 + 150; // Start from outer edge
        const endRadius = Math.random() * 80 + 20; // End closer to center
        const width = Math.random() * 6 + 2; // Thick streaks
        const alpha = Math.random() * 0.4 + 0.15;
        
        const startX = centerX + Math.cos(angle) * startRadius;
        const startY = centerY + Math.sin(angle) * startRadius;
        const endX = centerX + Math.cos(angle) * endRadius;
        const endY = centerY + Math.sin(angle) * endRadius;
        
        // Create gradient from outer (brighter) to inner (dimmer) for flow effect
        const grd = ctx.createLinearGradient(startX, startY, endX, endY);
        grd.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grd.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.8})`);
        grd.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.3})`);
        
        ctx.strokeStyle = grd;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
    
    // Add brighter concentrated radial streaks for intensity variation
    for(let i=0; i<80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const startRadius = Math.random() * 180 + 120;
        const endRadius = Math.random() * 60 + 15;
        const width = Math.random() * 4 + 2;
        const alpha = Math.random() * 0.6 + 0.4; // Brighter streaks
        
        const startX = centerX + Math.cos(angle) * startRadius;
        const startY = centerY + Math.sin(angle) * startRadius;
        const endX = centerX + Math.cos(angle) * endRadius;
        const endY = centerY + Math.sin(angle) * endRadius;
        
        const grd = ctx.createLinearGradient(startX, startY, endX, endY);
        grd.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grd.addColorStop(0.6, `rgba(255, 255, 255, ${alpha * 0.7})`);
        grd.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.2})`);
        
        ctx.strokeStyle = grd;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SETUP ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 4000);
    // Initial position - slightly above equator for cinematic view, rotated to the right.
    // Use cameraZoom from params so the first frame already matches the intended look.
    const baseZ = 65;
    const zoom = params.cameraZoom ?? 1.0;
    // Rotate camera position to the right (around Y axis)
    const angleToRight = Math.PI /6; // 30 degrees to the right
    const x = Math.sin(angleToRight) * baseZ * zoom;
    const z = Math.cos(angleToRight) * baseZ * zoom;
    camera.position.set(x, 15 * zoom, z); 
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5; // Reduced exposure
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    // Allow closer zoom for more dramatic views, but keep a safe minimum
    controls.minDistance = 8;
    controls.maxDistance = 400;
    controls.enablePan = false; // Keep BH centered by orbiting around target
    controls.enableRotate = true; // Enable rotation - camera can rotate around black hole
    controls.target.set(0, 0, 0); // Black hole stays centered at origin
    controls.update();
    
    controls.zoomSpeed = 3.0; // Increased sensitivity
    controls.rotateSpeed = 0.8;
    // Allow full vertical rotation (up/down) but keep black hole position fixed
    controls.minPolarAngle = 0; // Can look from top
    controls.maxPolarAngle = Math.PI; // Can look from bottom

    controlsRef.current = controls;

    // --- POST PROCESSING (BLOOM) ---
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.12;
    bloomPass.strength = 0.55;
    bloomPass.radius = 0.65;
    bloomPassRef.current = bloomPass;

    const diskPass = new ShaderPass(accretionDiskShader);
    diskPassRef.current = diskPass;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(diskPass);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // --- ASSETS ---
    const noiseTexture = createNoiseTexture();

    // --- BACKGROUND STARS (Skybox with Gravitational Lensing) ---
    const starGeo = new THREE.SphereGeometry(1500, 64, 64);
    const starShader = {
      uniforms: {
        cameraPos: { value: new THREE.Vector3() },
        bhPos: { value: new THREE.Vector3(0,0,0) },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPos;
        uniform vec3 cameraPos;
        uniform vec3 bhPos;
        uniform float time;

        // 3D Noise for star generation
        float random(vec3 st) {
            return fract(sin(dot(st.xyz, vec3(12.9898,78.233,45.543))) * 43758.5453123);
        }
        
        float noise3D(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float n = mix(mix(mix(random(i + vec3(0,0,0)), random(i + vec3(1,0,0)), f.x),
                              mix(random(i + vec3(0,1,0)), random(i + vec3(1,1,0)), f.x), f.y),
                          mix(mix(random(i + vec3(0,0,1)), random(i + vec3(1,0,1)), f.x),
                              mix(random(i + vec3(0,1,1)), random(i + vec3(1,1,1)), f.x), f.y), f.z);
            return n;
        }

        void main() {
          vec3 viewDir = normalize(vWorldPos - cameraPos);
          vec3 toCenter = bhPos - cameraPos;
          float t = dot(toCenter, viewDir);
          vec3 closestPoint = cameraPos + viewDir * t;
          float impactParam = length(closestPoint - bhPos);
          
          float rs = 10.0; // Event Horizon Radius
          
          // Shadow
          if (impactParam < rs * 1.5 && t > 0.0 && length(cameraPos - bhPos) > rs) {
             gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
             return;
          }

          // Gravitational Lensing Formula approximation
          float warpStrength = (rs * 15.0) / (impactParam * impactParam + 1.0);
          if (t < 0.0) warpStrength = 0.0;
          
          vec3 radial = normalize(closestPoint - bhPos);
          // Bend the view vector
          vec3 warpedDir = normalize(viewDir - radial * warpStrength);

          // Add motion effect - stars move to the left (creating illusion black hole moves right)
          // Apply motion to the warped direction vector itself, not the noise coordinates
          // This prevents stars from appearing/disappearing
          vec3 motionOffset = vec3(-time * 0.001, 0.0, 0.0);
          
          // Rotate the warped direction slightly to create motion effect
          // This maintains star positions while creating the illusion of movement
          float motionAngle = time * 0.009;
          float cosAngle = cos(motionAngle);
          float sinAngle = sin(motionAngle);
          vec3 motionWarpedDir = warpedDir;
          // Apply rotation around Y axis (horizontal motion)
          motionWarpedDir.x = warpedDir.x * cosAngle - warpedDir.z * sinAngle;
          motionWarpedDir.z = warpedDir.x * sinAngle + warpedDir.z * cosAngle;

          // Star Generation with motion - use rotated direction
          // Layer 1: Bright, sharp stars (High frequency noise)
          float n1 = noise3D(motionWarpedDir * 450.0);
          float stars1 = smoothstep(0.75, 1.0, n1); 
          stars1 = pow(stars1, 30.0); // Sharpen to points

          // Layer 2: Dimmer, numerous stars (Medium frequency)
          float n2 = noise3D(motionWarpedDir * 250.0 + vec3(12.4));
          float stars2 = smoothstep(0.6, 1.0, n2);
          stars2 = pow(stars2, 15.0) * 0.8; // Increased from 0.3

          // Layer 3: Occasional brighter star (Low frequency)
          float n3 = noise3D(motionWarpedDir * 100.0 + vec3(93.1));
          float stars3 = smoothstep(0.85, 1.0, n3);
          stars3 = pow(stars3, 40.0) * 2.5; // Increased from 1.5

          vec3 combinedStars = vec3(stars1 + stars2 + stars3);
          
          // Subtle color variation
          float colorVar = noise3D(motionWarpedDir * 10.0);
          vec3 tint = mix(vec3(0.8, 0.9, 1.0), vec3(1.0, 0.9, 0.7), colorVar);

          // BIG DISTANT STARS (SUNS) - Fewer, smaller stars at far distances
          // Use very low frequency noise to create sparse, small bright stars
          
          // Big Star 1 - White/Yellow sun
          float bigStar1Noise = noise3D(motionWarpedDir * 25.0 + vec3(100.0, 200.0, 150.0));
          float bigStar1Core = smoothstep(0.96, 1.0, bigStar1Noise);
          float bigStar1Halo = smoothstep(0.92, 0.98, bigStar1Noise) * 0.6;
          float bigStar1 = bigStar1Core * 8.0 + bigStar1Halo * 2.0; // Very bright
          vec3 bigStar1Color = mix(vec3(1.0, 1.0, 0.95), vec3(1.0, 0.95, 0.8), bigStar1Noise); // White to yellow
          
          // Big Star 2 - Blue-white sun (smaller, less frequent)
          float bigStar2Noise = noise3D(motionWarpedDir * 28.0 + vec3(-150.0, 180.0, -200.0));
          float bigStar2Core = smoothstep(0.985, 1.0, bigStar2Noise); // Higher threshold
          float bigStar2Halo = smoothstep(0.97, 0.995, bigStar2Noise) * 0.25; // Smaller halo
          float bigStar2 = bigStar2Core * 3.0 + bigStar2Halo * 0.7; // Reduced brightness
          vec3 bigStar2Color = mix(vec3(0.8, 0.9, 1.0), vec3(0.6, 0.8, 1.0), bigStar2Noise); // Blue-white
          
          // Big Star 3 - Orange sun (smaller, less frequent)
          float bigStar3Noise = noise3D(motionWarpedDir * 30.0 + vec3(250.0, -180.0, 220.0));
          float bigStar3Core = smoothstep(0.97, 1.0, bigStar3Noise);
          float bigStar3Halo = smoothstep(0.94, 0.99, bigStar3Noise) * 0.55;
          float bigStar3 = bigStar3Core * 6.5 + bigStar3Halo * 1.5;
          vec3 bigStar3Color = mix(vec3(1.0, 0.85, 0.6), vec3(1.0, 0.7, 0.4), bigStar3Noise); // Orange
          
          // Combine big stars with their colors (reduced from 5 to 3 stars)
          vec3 combinedBigStars = bigStar1 * bigStar1Color + 
                                 bigStar2 * bigStar2Color + 
                                 bigStar3 * bigStar3Color;

          // SMALL GALAXIES - Diffuse glowing areas with spiral patterns
          // Galaxy 1 - Large, faint galaxy
          float galaxy1Noise = noise3D(motionWarpedDir * 15.0 + vec3(50.0, 30.0, 20.0));
          float galaxy1Core = smoothstep(0.92, 1.0, galaxy1Noise);
          float galaxy1Halo = smoothstep(0.85, 0.95, galaxy1Noise) * 0.3;
          float galaxy1 = galaxy1Core * 0.8 + galaxy1Halo * 0.4;
          
          // Galaxy 2 - Medium galaxy
          float galaxy2Noise = noise3D(motionWarpedDir * 18.0 + vec3(-40.0, 60.0, -30.0));
          float galaxy2Core = smoothstep(0.90, 1.0, galaxy2Noise);
          float galaxy2Halo = smoothstep(0.82, 0.93, galaxy2Noise) * 0.25;
          float galaxy2 = galaxy2Core * 0.6 + galaxy2Halo * 0.3;
          
          // Galaxy 3 - Small distant galaxy
          float galaxy3Noise = noise3D(motionWarpedDir * 20.0 + vec3(80.0, -50.0, 40.0));
          float galaxy3Core = smoothstep(0.93, 1.0, galaxy3Noise);
          float galaxy3Halo = smoothstep(0.88, 0.96, galaxy3Noise) * 0.2;
          float galaxy3 = galaxy3Core * 0.5 + galaxy3Halo * 0.25;
          
          float combinedGalaxies = galaxy1 + galaxy2 + galaxy3;
          vec3 galaxyColor = vec3(0.7, 0.75, 0.9) * 0.15; // Soft blue-white glow
          
          // SMALL NEBULAS - Colorful cloud-like formations
          // Nebula 1 - Blue-purple nebula
          float nebula1Noise1 = noise3D(motionWarpedDir * 8.0 + vec3(25.0, 45.0, 15.0));
          float nebula1Noise2 = noise3D(motionWarpedDir * 12.0 + vec3(-20.0, 35.0, 25.0));
          float nebula1Noise3 = noise3D(motionWarpedDir * 6.0 + vec3(30.0, -15.0, 40.0));
          float nebula1Pattern = (nebula1Noise1 * 0.5 + nebula1Noise2 * 0.3 + nebula1Noise3 * 0.2);
          float nebula1 = smoothstep(0.65, 0.85, nebula1Pattern) * 0.4;
          vec3 nebula1Color = mix(vec3(0.3, 0.4, 0.8), vec3(0.5, 0.3, 0.7), nebula1Pattern);
          
          // Nebula 2 - Red-pink nebula
          float nebula2Noise1 = noise3D(motionWarpedDir * 9.0 + vec3(-60.0, 20.0, -40.0));
          float nebula2Noise2 = noise3D(motionWarpedDir * 11.0 + vec3(55.0, -30.0, -25.0));
          float nebula2Noise3 = noise3D(motionWarpedDir * 7.0 + vec3(-45.0, 50.0, -35.0));
          float nebula2Pattern = (nebula2Noise1 * 0.5 + nebula2Noise2 * 0.3 + nebula2Noise3 * 0.2);
          float nebula2 = smoothstep(0.68, 0.88, nebula2Pattern) * 0.35;
          vec3 nebula2Color = mix(vec3(0.7, 0.2, 0.4), vec3(0.9, 0.4, 0.5), nebula2Pattern);
          
          // Nebula 3 - Green-cyan nebula
          float nebula3Noise1 = noise3D(motionWarpedDir * 10.0 + vec3(70.0, -60.0, 50.0));
          float nebula3Noise2 = noise3D(motionWarpedDir * 13.0 + vec3(-70.0, 40.0, -50.0));
          float nebula3Noise3 = noise3D(motionWarpedDir * 8.0 + vec3(65.0, -45.0, 55.0));
          float nebula3Pattern = (nebula3Noise1 * 0.5 + nebula3Noise2 * 0.3 + nebula3Noise3 * 0.2);
          float nebula3 = smoothstep(0.70, 0.90, nebula3Pattern) * 0.3;
          vec3 nebula3Color = mix(vec3(0.2, 0.6, 0.5), vec3(0.3, 0.7, 0.8), nebula3Pattern);
          
          // Combine nebulas
          vec3 combinedNebulas = nebula1 * nebula1Color + nebula2 * nebula2Color + nebula3 * nebula3Color;

          // SINGLE RED SUN - One star-sized red sun in background
          vec3 sunDirection = normalize(vec3(9.9, 2.9, -0.9)); // Specific direction for one sun
          float sunAlignment = dot(motionWarpedDir, sunDirection);
          float sunDistance = 1.0 - sunAlignment;
          
          // Star-sized - sharp point like other stars
          float sunIntensity = smoothstep(0.0, 0.0002, 0.01 - sunDistance);
          sunIntensity = pow(sunIntensity, 5.0); // Sharp point like stars
          
          // Small halo
          float sunHalo = smoothstep(0.0002, 0.0005, 1.0 - sunDistance);
          sunHalo = pow(sunHalo, 20.0) * 0.03;
          
          // Star-sized brightness
          float redSun = sunIntensity * 3.5 + sunHalo;
          
          // Red-orange color for hot sun
          vec3 redSunColor = vec3(1.0, 0.04, 0.015); // Red-orange

          // Deep space background
          vec3 bg = vec3(0.002, 0.002, 0.005); 
          
          // Increase overall star brightness
          float brightnessMultiplier = 2.0; // Brightness boost for stars
          
          // Combine all elements: background + stars + big stars + galaxies + nebulas + single red sun
          vec3 finalColor = bg + combinedStars * tint * brightnessMultiplier + 
                           combinedBigStars * 0.25 + // Big distant stars (suns) - scaled for visibility
                           combinedGalaxies * galaxyColor + 
                           combinedNebulas * 0.12 + // Scale down nebulas for subtle effect
                           redSunColor * redSun; // Single red sun
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    };
    const starMat = new THREE.ShaderMaterial({
      ...starShader,
      side: THREE.BackSide
    });
    starMaterialRef.current = starMat;
    const starMesh = new THREE.Mesh(starGeo, starMat);
    scene.add(starMesh);


    // --- BLACK HOLE GROUP ---
    // Centered at 0,0,0
    const bhGroup = new THREE.Group();
    scene.add(bhGroup);
    bhGroupRef.current = bhGroup;

    // 1. THE EVENT HORIZON
    const bhGeometry = new THREE.SphereGeometry(10.0, 64, 64);
    const horizonShader = {
      uniforms: {
        time: { value: 0 },
        noiseMap: { value: noiseTexture }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = -normalize(mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform sampler2D noiseMap;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec2 vUv;

        void main() {
          float fresnel = dot(vViewDir, vNormal);
          float edge = 1.0 - fresnel;
          
          vec2 noiseUv = vNormal.xy * 2.0 + vec2(time * 0.1, time * 0.05);
          float n = texture2D(noiseMap, noiseUv).r;
          
          float rimStrength = pow(edge, 8.0);
          float perturbation = n * 0.08;
          float signal = smoothstep(0.0, 1.0, rimStrength + perturbation - 0.12);
          
          vec3 rimColor = vec3(0.08, 0.03, 0.01) * signal;
          vec3 core = vec3(0.0);
          
          gl_FragColor = vec4(mix(core, rimColor, signal), 1.0);
        }
      `
    };
    const bhMaterial = new THREE.ShaderMaterial({
       ...horizonShader,
       side: THREE.FrontSide
    });
    horizonMaterialRef.current = bhMaterial;
    const blackHole = new THREE.Mesh(bhGeometry, bhMaterial);
    bhGroup.add(blackHole);

    // 2. TESSERACT ROOMS (Interstellar effect) - appears when zoomed very close
    // Create a large box geometry that will show the tesseract room effect
    // Make it much larger so camera can be inside
    const tesseractGeometry = new THREE.BoxGeometry(200, 200, 200, 64, 64, 64);
    
    const tesseractShader = {
        uniforms: {
            time: { value: 0 },
            cameraPos: { value: new THREE.Vector3() },
            bhPos: { value: new THREE.Vector3(0, 0, 0) },
            hoveredRoom: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) }, // Default to far away (no hover)
            hoverTransition: { value: 0.0 }, // Smooth transition value for hover
            // Support up to 50 clicked rooms
            clickedRoom1: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom2: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom3: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom4: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom5: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom6: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom7: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom8: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom9: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom10: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom11: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom12: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom13: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom14: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom15: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom16: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom17: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom18: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom19: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom20: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom21: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom22: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom23: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom24: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom25: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom26: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom27: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom28: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom29: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom30: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom31: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom32: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom33: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom34: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom35: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom36: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom37: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom38: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom39: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom40: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom41: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom42: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom43: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom44: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom45: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom46: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom47: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom48: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom49: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) },
            clickedRoom50: { value: new THREE.Vector3(9999.0, 9999.0, 9999.0) }
        },
        vertexShader: `
        varying vec3 vWorldPos;
        varying vec3 vNormal;
        varying vec3 vViewDir;

            void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = -normalize(mvPosition.xyz);
          
          gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 cameraPos;
            uniform vec3 bhPos;
            uniform vec3 hoveredRoom; // Position of hovered room
            uniform float hoverTransition; // Smooth transition value (0.0 to 1.0)
            uniform vec3 clickedRoom1; uniform vec3 clickedRoom2; uniform vec3 clickedRoom3; uniform vec3 clickedRoom4; uniform vec3 clickedRoom5;
            uniform vec3 clickedRoom6; uniform vec3 clickedRoom7; uniform vec3 clickedRoom8; uniform vec3 clickedRoom9; uniform vec3 clickedRoom10;
            uniform vec3 clickedRoom11; uniform vec3 clickedRoom12; uniform vec3 clickedRoom13; uniform vec3 clickedRoom14; uniform vec3 clickedRoom15;
            uniform vec3 clickedRoom16; uniform vec3 clickedRoom17; uniform vec3 clickedRoom18; uniform vec3 clickedRoom19; uniform vec3 clickedRoom20;
            uniform vec3 clickedRoom21; uniform vec3 clickedRoom22; uniform vec3 clickedRoom23; uniform vec3 clickedRoom24; uniform vec3 clickedRoom25;
            uniform vec3 clickedRoom26; uniform vec3 clickedRoom27; uniform vec3 clickedRoom28; uniform vec3 clickedRoom29; uniform vec3 clickedRoom30;
            uniform vec3 clickedRoom31; uniform vec3 clickedRoom32; uniform vec3 clickedRoom33; uniform vec3 clickedRoom34; uniform vec3 clickedRoom35;
            uniform vec3 clickedRoom36; uniform vec3 clickedRoom37; uniform vec3 clickedRoom38; uniform vec3 clickedRoom39; uniform vec3 clickedRoom40;
            uniform vec3 clickedRoom41; uniform vec3 clickedRoom42; uniform vec3 clickedRoom43; uniform vec3 clickedRoom44; uniform vec3 clickedRoom45;
            uniform vec3 clickedRoom46; uniform vec3 clickedRoom47; uniform vec3 clickedRoom48; uniform vec3 clickedRoom49; uniform vec3 clickedRoom50;
            
            varying vec3 vWorldPos;
            varying vec3 vNormal;
            varying vec3 vViewDir;
        
        // Calculate distance from camera to black hole
        float getProximity() {
          float distToBH = length(cameraPos - bhPos);
          float eventHorizonRadius = 10.0;
          // Activate when within 1.5x event horizon (~15 units) - more lenient
          float proximity = 1.0 - clamp((distToBH - eventHorizonRadius) / (eventHorizonRadius * 0.5), 0.0, 1.0);
          return proximity;
        }
        
        // Create room blocks extending in all directions (Interstellar tesseract) - SOLID, NO ANIMATION
        float tesseractRooms(vec3 pos) {
          // Room size
          float roomSize = 10.0;
          
          // Create grid of rooms extending in all directions - STATIC
          vec3 roomGrid = floor(pos / roomSize);
          
          // Create room boundaries (walls) - STATIC
          vec3 roomLocal = mod(pos, roomSize) - roomSize * 0.5;
          
          // Room walls - show edges (solid, no animation) - THINNER LINES
          float wallThickness = 0.15; // Reduced from 0.5 to make lines thinner
          vec3 wallDist = abs(roomLocal);
          float minWallDist = min(min(wallDist.x, wallDist.y), wallDist.z);
          
          // Show walls when close to edges - SOLID
          float walls = step(minWallDist, wallThickness); // Hard step, no smoothstep for solid lines
          
          // Room floor/ceiling pattern - STATIC - THINNER
          float floorPattern = step(abs(roomLocal.y), 0.05) * 0.4; // Reduced from 0.15 to 0.05
          
          // Room windows/light sources - STATIC pattern
          vec2 windowGrid = floor(roomLocal.xz / 2.5);
          float windowPattern = step(0.8, sin(windowGrid.x * 3.14) * sin(windowGrid.y * 3.14)) * 0.6;
          
          // Combine room elements - SOLID
          float room = walls + floorPattern + windowPattern;
          
          // Fade rooms based on distance from center
          float distFromCenter = length(roomGrid);
          float fade = 1.0 / (1.0 + distFromCenter * 0.05);
          
          return room * fade;
        }
        
        // Get room grid position for a given world position
        vec3 getRoomGrid(vec3 pos) {
          float roomSize = 10.0;
          return floor(pos / roomSize);
        }
        
        // Multiple layers of rooms at different scales - STATIC
        float multiDimensionalRooms(vec3 pos) {
          float rooms1 = tesseractRooms(pos);
          float rooms2 = tesseractRooms(pos * 0.5);
          float rooms3 = tesseractRooms(pos * 2.0);
          
          return rooms1 * 0.5 + rooms2 * 0.3 + rooms3 * 0.2;
        }

            void main() {
          float proximity = getProximity();
          
          // Only show tesseract when very close (more lenient threshold)
          if (proximity < 0.05) {
            discard;
          }
          
          // Calculate position relative to black hole center
          vec3 pos = vWorldPos - bhPos;
          
          // Create tesseract room effect
          float rooms = multiDimensionalRooms(pos);
          
          // Make rooms visible - SOLID, NO SMOOTHSTEP (causes blinking)
          rooms = step(0.3, rooms); // Hard cutoff for completely solid lines
          
          // Check if this room is clicked (make it invisible)
          float roomSize = 10.0;
          vec3 roomGrid = getRoomGrid(pos);
          vec3 hoveredRoomGrid = getRoomGrid(hoveredRoom);
          
          // Check if room is clicked - compare with all clicked room positions (up to 50)
          bool isClicked = false;
          if(length(roomGrid - getRoomGrid(clickedRoom1)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom2)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom3)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom4)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom5)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom6)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom7)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom8)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom9)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom10)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom11)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom12)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom13)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom14)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom15)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom16)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom17)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom18)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom19)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom20)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom21)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom22)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom23)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom24)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom25)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom26)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom27)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom28)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom29)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom30)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom31)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom32)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom33)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom34)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom35)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom36)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom37)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom38)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom39)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom40)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom41)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom42)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom43)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom44)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom45)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom46)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom47)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom48)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom49)) < 0.1) isClicked = true;
          if(length(roomGrid - getRoomGrid(clickedRoom50)) < 0.1) isClicked = true;
          
          // If clicked, make it invisible
          if(isClicked) {
            discard;
          }
          
          // Check if this room is hovered
          bool isHovered = length(roomGrid - hoveredRoomGrid) < 0.1;
          
          // Room colors - warm, earthly tones like in Interstellar (solid, not glowing)
          vec3 roomColor = vec3(0.35, 0.3, 0.25); // Solid warm brown
          
          // Window/light colors - warm yellow-white (solid, not glowing)
          vec3 windowColor = vec3(0.7, 0.65, 0.5);
          roomColor = mix(roomColor, windowColor, rooms * 0.3);
          
          // Smooth transition for hover effect - ONLY apply to the hovered room
          float hoverBrightness = 1.0;
          if(isHovered) {
            hoverBrightness = mix(1.0, 4.5, hoverTransition); // Much brighter hover effect
          }
          roomColor = roomColor * hoverBrightness;
          
          // Add depth fog effect
          float dist = length(pos);
          float fog = 1.0 / (1.0 + dist * 0.01);
          
          // Final color - completely solid
          vec3 finalColor = roomColor * rooms * fog;
          
          // Alpha - smooth transition for hover transparency - ONLY apply to the hovered room
          float baseAlpha = step(0.2, rooms) * proximity * fog;
          float hoverAlpha = baseAlpha;
          if(isHovered) {
            hoverAlpha = baseAlpha * mix(1.0, 0.6, hoverTransition); // Smoothly interpolate transparency only for hovered room
          }
          float alpha = step(0.1, hoverAlpha); // Hard cutoff - completely solid
          alpha = clamp(alpha, 0.0, 1.0);
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `
    };

    const tesseractMat = new THREE.ShaderMaterial({
      ...tesseractShader,
        transparent: true,
      side: THREE.DoubleSide, // Render from both sides
      blending: THREE.NormalBlending, // Normal blending (no additive glow)
      depthWrite: false,
      depthTest: true
    });
    tesseractMaterialRef.current = tesseractMat;
    
    const tesseractMesh = new THREE.Mesh(tesseractGeometry, tesseractMat);
    tesseractMesh.position.set(0, 0, 0); // Center at black hole
    // Start invisible, will be shown when zoomed close
    tesseractMesh.visible = false;
    scene.add(tesseractMesh);
    tesseractMeshRef.current = tesseractMesh;

    // --- ANIMATION LOOP ---
    const getCameraMatrix = (cam: THREE.PerspectiveCamera): THREE.Matrix3 => {
      const zAxis = cam.position.clone().normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const xAxis = new THREE.Vector3().crossVectors(up, zAxis).normalize();
      const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();
      const m = new THREE.Matrix3();
      m.set(
        xAxis.x, yAxis.x, zAxis.x,
        xAxis.y, yAxis.y, zAxis.y,
        xAxis.z, yAxis.z, zAxis.z,
      );
      return m;
    };

    const animate = (time: number) => {
        const t = time * 0.001;
        const currentParams = paramsRef.current;

        if (diskPassRef.current && cameraRef.current && rendererRef.current) {
          const u = diskPassRef.current.uniforms;
          u.iTime.value = t;
          u.iCameraPos.value.copy(cameraRef.current.position);
          u.iCameraMatrix.value.copy(getCameraMatrix(cameraRef.current));
          u.iResolution.value.set(
            rendererRef.current.domElement.width,
            rendererRef.current.domElement.height,
          );
          u.iRotationSpeed.value = currentParams.diskSpeed * 0.12;
          u.iGlowIntensity.value = currentParams.glowIntensity;
          u.iTurbulence.value = currentParams.turbulence;
          u.iDiskColor.value.copy(hexToVec3(currentParams.accretionDiskColor));
          u.iBloom.value = 0.8 + currentParams.glowIntensity * 0.6;
        }

        if (bloomPassRef.current) {
          bloomPassRef.current.strength = 0.4 + currentParams.glowIntensity * 0.35;
        }

        // Update Shaders
        if (horizonMaterialRef.current) {
            horizonMaterialRef.current.uniforms.time.value = t;
        }
        
        // Update tesseract rooms - show when zoomed very close
        if (tesseractMaterialRef.current && tesseractMeshRef.current && cameraRef.current) {
            const distToBH = cameraRef.current.position.length();
            const eventHorizonRadius = 10.0;
            // More lenient - show when within ~15 units
            const proximityValue = (distToBH - eventHorizonRadius) / (eventHorizonRadius * 0.5);
            const proximity = 1.0 - Math.max(0, Math.min(1, proximityValue));
            
            // Show tesseract when within ~15 units (more lenient)
            tesseractMeshRef.current.visible = proximity > 0.05;
            
            if (tesseractMeshRef.current.visible) {
                tesseractMaterialRef.current.uniforms.time.value = t;
                tesseractMaterialRef.current.uniforms.cameraPos.value.copy(cameraRef.current.position);
                tesseractMaterialRef.current.uniforms.bhPos.value.set(0, 0, 0);
                
                // Update hovered room if it exists
                if (hoveredRoomRef.current) {
                    tesseractMaterialRef.current.uniforms.hoveredRoom.value.copy(hoveredRoomRef.current);
                    // Smoothly transition hover effect (0.0 to 1.0)
                    hoverTransitionRef.current = Math.min(1.0, hoverTransitionRef.current + 0.1);
                } else {
                    // Smoothly fade out hover effect
                    hoverTransitionRef.current = Math.max(0.0, hoverTransitionRef.current - 0.1);
                }
                tesseractMaterialRef.current.uniforms.hoverTransition.value = hoverTransitionRef.current;
            }
        }
        
        // Update background stars shader to ensure lensing moves with the black hole
        if (starMaterialRef.current && cameraRef.current && bhGroupRef.current) {
            starMaterialRef.current.uniforms.cameraPos.value.copy(cameraRef.current.position);
            starMaterialRef.current.uniforms.bhPos.value.copy(bhGroupRef.current.position);
            starMaterialRef.current.uniforms.time.value = t; // Update time for motion effect
        }

        controls.update();
        composer.render();
        requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);

    const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current || !composerRef.current) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        
        rendererRef.current.setSize(w, h);
        composerRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Hover handler for highlighting rooms
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!cameraRef.current || !tesseractMeshRef.current || !tesseractMaterialRef.current) return;
      
      // Only handle hover when tesseract is visible
      if (!tesseractMeshRef.current.visible) {
        // Reset hover when tesseract is not visible
        hoveredRoomRef.current = null;
        hoverTransitionRef.current = 0;
        tesseractMaterialRef.current.uniforms.hoveredRoom.value.set(9999.0, 9999.0, 9999.0);
        return;
      }
      
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update raycaster
      raycaster.setFromCamera(mouse, cameraRef.current);
      
      // Check for intersection with tesseract mesh
      const intersects = raycaster.intersectObject(tesseractMeshRef.current);
      
      if (intersects.length > 0) {
        const intersection = intersects[0];
        const worldPos = intersection.point;
        
        // Calculate which room was hovered (room grid position)
        const roomSize = 10.0;
        const roomGrid = new THREE.Vector3(
          Math.floor(worldPos.x / roomSize),
          Math.floor(worldPos.y / roomSize),
          Math.floor(worldPos.z / roomSize)
        );
        
        // Convert back to world position of room center
        const roomCenter = new THREE.Vector3(
          roomGrid.x * roomSize + roomSize * 0.5,
          roomGrid.y * roomSize + roomSize * 0.5,
          roomGrid.z * roomSize + roomSize * 0.5
        );
        
        // Store hovered room and update shader
        hoveredRoomRef.current = roomCenter;
        tesseractMaterialRef.current.uniforms.hoveredRoom.value.copy(roomCenter);
      } else {
        // No intersection - reset hover
        hoveredRoomRef.current = null;
        tesseractMaterialRef.current.uniforms.hoveredRoom.value.set(9999.0, 9999.0, 9999.0);
      }
    };
    
    const handleClick = (event: MouseEvent) => {
      if (!cameraRef.current || !tesseractMeshRef.current || !tesseractMaterialRef.current) return;
      
      // Only handle clicks when tesseract is visible
      if (!tesseractMeshRef.current.visible) return;
      
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update raycaster
      raycaster.setFromCamera(mouse, cameraRef.current);
      
      // Check for intersection with tesseract mesh
      const intersects = raycaster.intersectObject(tesseractMeshRef.current);
      
      if (intersects.length > 0) {
        const intersection = intersects[0];
        const worldPos = intersection.point;
        
        // Calculate which room was clicked (room grid position)
        const roomSize = 10.0;
        const roomGrid = new THREE.Vector3(
          Math.floor(worldPos.x / roomSize),
          Math.floor(worldPos.y / roomSize),
          Math.floor(worldPos.z / roomSize)
        );
        
        // Create room key for tracking
        const roomKey = `${roomGrid.x},${roomGrid.y},${roomGrid.z}`;
        
        // Add to clicked rooms permanently (no toggle - once clicked, it's gone forever)
        if (!clickedRoomsRef.current.has(roomKey)) {
          clickedRoomsRef.current.add(roomKey);
        }
        
        // Update clicked rooms uniforms (up to 50 rooms)
        const clickedRoomsArray = Array.from(clickedRoomsRef.current).slice(0, 50);
        const clickedRoomUniforms = [
          tesseractMaterialRef.current.uniforms.clickedRoom1, tesseractMaterialRef.current.uniforms.clickedRoom2,
          tesseractMaterialRef.current.uniforms.clickedRoom3, tesseractMaterialRef.current.uniforms.clickedRoom4,
          tesseractMaterialRef.current.uniforms.clickedRoom5, tesseractMaterialRef.current.uniforms.clickedRoom6,
          tesseractMaterialRef.current.uniforms.clickedRoom7, tesseractMaterialRef.current.uniforms.clickedRoom8,
          tesseractMaterialRef.current.uniforms.clickedRoom9, tesseractMaterialRef.current.uniforms.clickedRoom10,
          tesseractMaterialRef.current.uniforms.clickedRoom11, tesseractMaterialRef.current.uniforms.clickedRoom12,
          tesseractMaterialRef.current.uniforms.clickedRoom13, tesseractMaterialRef.current.uniforms.clickedRoom14,
          tesseractMaterialRef.current.uniforms.clickedRoom15, tesseractMaterialRef.current.uniforms.clickedRoom16,
          tesseractMaterialRef.current.uniforms.clickedRoom17, tesseractMaterialRef.current.uniforms.clickedRoom18,
          tesseractMaterialRef.current.uniforms.clickedRoom19, tesseractMaterialRef.current.uniforms.clickedRoom20,
          tesseractMaterialRef.current.uniforms.clickedRoom21, tesseractMaterialRef.current.uniforms.clickedRoom22,
          tesseractMaterialRef.current.uniforms.clickedRoom23, tesseractMaterialRef.current.uniforms.clickedRoom24,
          tesseractMaterialRef.current.uniforms.clickedRoom25, tesseractMaterialRef.current.uniforms.clickedRoom26,
          tesseractMaterialRef.current.uniforms.clickedRoom27, tesseractMaterialRef.current.uniforms.clickedRoom28,
          tesseractMaterialRef.current.uniforms.clickedRoom29, tesseractMaterialRef.current.uniforms.clickedRoom30,
          tesseractMaterialRef.current.uniforms.clickedRoom31, tesseractMaterialRef.current.uniforms.clickedRoom32,
          tesseractMaterialRef.current.uniforms.clickedRoom33, tesseractMaterialRef.current.uniforms.clickedRoom34,
          tesseractMaterialRef.current.uniforms.clickedRoom35, tesseractMaterialRef.current.uniforms.clickedRoom36,
          tesseractMaterialRef.current.uniforms.clickedRoom37, tesseractMaterialRef.current.uniforms.clickedRoom38,
          tesseractMaterialRef.current.uniforms.clickedRoom39, tesseractMaterialRef.current.uniforms.clickedRoom40,
          tesseractMaterialRef.current.uniforms.clickedRoom41, tesseractMaterialRef.current.uniforms.clickedRoom42,
          tesseractMaterialRef.current.uniforms.clickedRoom43, tesseractMaterialRef.current.uniforms.clickedRoom44,
          tesseractMaterialRef.current.uniforms.clickedRoom45, tesseractMaterialRef.current.uniforms.clickedRoom46,
          tesseractMaterialRef.current.uniforms.clickedRoom47, tesseractMaterialRef.current.uniforms.clickedRoom48,
          tesseractMaterialRef.current.uniforms.clickedRoom49, tesseractMaterialRef.current.uniforms.clickedRoom50
        ];
        
        // Reset all clicked room uniforms
        clickedRoomUniforms.forEach(uniform => {
          uniform.value.set(9999.0, 9999.0, 9999.0);
        });
        
        // Set clicked room positions
        clickedRoomsArray.forEach((key, index) => {
          const [x, y, z] = key.split(',').map(Number);
          const roomCenter = new THREE.Vector3(
            x * roomSize + roomSize * 0.5,
            y * roomSize + roomSize * 0.5,
            z * roomSize + roomSize * 0.5
          );
          clickedRoomUniforms[index].value.copy(roomCenter);
        });
      }
    };
    
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);

    return () => {
        window.removeEventListener('resize', handleResize);
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('click', handleClick);
        containerRef.current?.removeChild(renderer.domElement);
        renderer.dispose();
    };
  }, []); 

  // Update params ref and uniforms when params change
  useEffect(() => {
    paramsRef.current = params;

    if (diskPassRef.current) {
      const u = diskPassRef.current.uniforms;
      u.iRotationSpeed.value = params.diskSpeed * 0.12;
      u.iGlowIntensity.value = params.glowIntensity;
      u.iTurbulence.value = params.turbulence;
      u.iDiskColor.value.copy(hexToVec3(params.accretionDiskColor));
      u.iBloom.value = 0.8 + params.glowIntensity * 0.6;
    }

    if (bloomPassRef.current) {
      bloomPassRef.current.strength = 0.4 + params.glowIntensity * 0.35;
    }
    
    // Update camera position based on zoom (maintain angle to the right)
    if (cameraRef.current) {
      const baseZ = 105;
      const zoom = params.cameraZoom ?? 1.0;
      // Maintain the same angle to the right
      const angleToRight = Math.PI / 10.5; // 30 degrees to the right
      const x = Math.sin(angleToRight) * baseZ * zoom;
      const z = Math.cos(angleToRight) * baseZ * zoom;
      cameraRef.current.position.set(x, 15 * zoom, z);
      cameraRef.current.updateProjectionMatrix();
    }
    
    // Update orbit controls
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.update();
    }
  }, [params]);

  // Let the parent component control positioning; this avoids blocking clicks
  // on the rest of the page with a fullscreen fixed overlay.
  return <div ref={containerRef} className="w-full h-full" />;
};

export default BlackHoleCanvas;