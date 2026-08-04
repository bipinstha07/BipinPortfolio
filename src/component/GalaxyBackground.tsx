import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GALAXY_PARAMS = {
  count: typeof window !== 'undefined' && window.innerWidth >= 768 ? 40000 : 35000,
  radius: 13, 
  insideColor: '#00eaff',
  outsideColor: '#0a1a2f',
}; 
 
function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const galaxy = useMemo(() => {
    const positions = new Float32Array(GALAXY_PARAMS.count * 3);
    const colors = new Float32Array(GALAXY_PARAMS.count * 3);
    const sizesArr = new Float32Array(GALAXY_PARAMS.count);
    const colorInside = new THREE.Color(GALAXY_PARAMS.insideColor);
    const colorOutside = new THREE.Color(GALAXY_PARAMS.outsideColor);
    for (let i = 0; i < GALAXY_PARAMS.count; i++) {
      const i3 = i * 3;
      const r = Math.cbrt(Math.random()) * GALAXY_PARAMS.radius;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * 2 * Math.PI;
      positions[i3 + 0] = r * Math.sin(theta) * Math.cos(phi);
      positions[i3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i3 + 2] = r * Math.cos(theta);
      const color = colorInside.clone().lerp(colorOutside, r / GALAXY_PARAMS.radius);
      colors[i3 + 0] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      sizesArr[i] = 0.018 + (Math.random() > 0.999 ? Math.random() * 0.2 : 0);
    }
    return { positions, colors, sizesArr };
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[galaxy.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[galaxy.colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[galaxy.sizesArr, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        transparent
        sizeAttenuation={true}
      />
    </points>
  );
}

function MiniMilkyWay() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3500;
  const arms = 7;
  const radius = 1.7;
  const randomness = 0.18;
  const randomnessPower = 2.5;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorCore = new THREE.Color('#00eaff');
  const colorArm = new THREE.Color('#00eaff');
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = Math.pow(Math.random(), 1.2) * radius;
    const branchAngle = ((i % arms) / arms) * Math.PI * 2;
    const spinAngle = r * 2.5;
    const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
    const randomY = (Math.random() - 0.5) * 0.08 * (1 - r / radius);
    const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * r + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;
    const color = colorCore.clone().lerp(colorArm, r / radius);
    colors[i3 + 0] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0007;
    }
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} vertexColors depthWrite={false} blending={THREE.AdditiveBlending} transparent sizeAttenuation={true} />
    </points>
  );
}

function CoreAndBulge() {
  // Dense cluster of small stars around the core
  const count = 1200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorCore = new THREE.Color('#00eaff');
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Spherical coordinates, very small radius for bulge
    const r = Math.cbrt(Math.random()) * 0.7 + Math.random() * 0.12;
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = Math.random() * 2 * Math.PI;
    positions[i3 + 0] = r * Math.sin(theta) * Math.cos(phi);
    positions[i3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i3 + 2] = r * Math.cos(theta);
    colors[i3 + 0] = colorCore.r;
    colors[i3 + 1] = colorCore.g;
    colors[i3 + 2] = colorCore.b;
  }
  return (
    <>
      {/* Central star matching particle color */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.018, 24, 24]} />
        <meshBasicMaterial color="#00eaff" transparent opacity={1} />
      </mesh>
      {/* Mini Milky Way spiral arms */}
      <MiniMilkyWay />
    </>
  );
}

function ScaledGalaxyGroup({ mouse, freeLook, rotation }: { mouse: { x: number; y: number; active: boolean }, freeLook: boolean, rotation?: { x: number, y: number } }) {
  const group = useRef<THREE.Group>(null);
  // Drag state for free look
  const drag = useRef({ active: false, lastX: 0, lastY: 0, rotX: 0, rotY: 0 });

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;
      const maxScale = isMobile ? 2.2 : 5.5;
      const minScale = isMobile ? 0.3 : 0.15;
      const divisor = isMobile ? 6000 : 8000;
      let scale = maxScale - scrollY / divisor;
      scale = Math.max(minScale, Math.min(maxScale, scale));
      if (group.current) {
        group.current.scale.set(scale, scale, scale);
      }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(() => {
    function nonlinear(val: number, factor = 1) {
      return Math.sign(val) * Math.pow(Math.abs(val), 1.5) * factor;
    }
    if (group.current) {
      if (rotation) {
        group.current.rotation.x = rotation.x;
        group.current.rotation.y = rotation.y;
      } else if (freeLook && drag.current.active) {
        group.current.rotation.x = drag.current.rotX;
        group.current.rotation.y = drag.current.rotY;
      } else if (!freeLook) {
        const targetX = mouse.active ? nonlinear(mouse.y - 0.5, 2.5) : 0;
        const targetY = mouse.active ? nonlinear(mouse.x - 0.5, 3.5) : 0;
        group.current.rotation.x += (targetX - group.current.rotation.x) * 0.08;
        group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08;
      }
    }
  });

  // Drag handlers for free look
  function onPointerDown(e: React.PointerEvent) {
    if (!freeLook) return;
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    if (group.current) {
      drag.current.rotX = group.current.rotation.x;
      drag.current.rotY = group.current.rotation.y;
    }
  }
  function onPointerUp() {
    drag.current.active = false;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!freeLook || !drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    const dy = e.clientY - drag.current.lastY;
    drag.current.rotY += dx * 0.01;
    drag.current.rotX += dy * 0.01;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
  }

  return (
    <group
      ref={group}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
      onPointerMove={onPointerMove}
      {...(freeLook ? { cursor: drag.current.active ? 'grabbing' : 'grab' } : {})}
    >
      <CoreAndBulge />
      <Galaxy />
    </group>
  );
}

const GalaxyBackground = ({ freeLook = false, rotation }: { freeLook?: boolean, rotation?: { x: number, y: number } }) => {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5, active: false });
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'auto', width: '100vw', height: '100vh' }}
      onMouseMove={e => {
        setMouse({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
          active: true,
        });
      }}
      onMouseLeave={() => setMouse(m => ({ ...m, active: false }))}
      className="galaxy-bg-interactive"
    >
      <Canvas camera={{ position: [0, 4, 18], fov: 75 }} style={{ width: '100vw', height: '100vh', pointerEvents: 'auto' }}>
        <color attach="background" args={["#070720"]} />
        <ScaledGalaxyGroup mouse={mouse} freeLook={freeLook} rotation={rotation} />
      </Canvas>
    </div>
  );
};

export default GalaxyBackground; 