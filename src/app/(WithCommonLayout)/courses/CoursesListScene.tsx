"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function WireframeTorus({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * speed * 0.4;
    mesh.current.rotation.y += delta * speed * 0.3;
  });
  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={2}>
      <mesh ref={mesh} position={position}>
        <torusGeometry args={[1, 0.28, 16, 48]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.28} />
      </mesh>
    </Float>
  );
}

function WireframeIcosa({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * speed * 0.3;
    mesh.current.rotation.z += delta * speed * 0.2;
  });
  return (
    <Float speed={speed} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh ref={mesh} position={position}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.22} />
      </mesh>
    </Float>
  );
}

function WireframeOcta({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * speed * 0.5;
    mesh.current.rotation.x += delta * speed * 0.15;
  });
  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2.5}>
      <mesh ref={mesh} position={position}>
        <octahedronGeometry args={[0.9]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.25} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 4]} color="#22c55e" intensity={1.5} />
      <pointLight position={[-6, -4, 2]} color="#3b82f6" intensity={1} />
      <pointLight position={[0, -6, -4]} color="#a855f7" intensity={0.6} />
      <WireframeTorus position={[-5, 2.5, -6]} color="#22c55e" speed={1.2} />
      <WireframeTorus position={[5.5, -1.5, -7]} color="#3b82f6" speed={0.9} />
      <WireframeIcosa position={[3.5, 3, -8]} color="#a855f7" speed={1.5} />
      <WireframeIcosa position={[-4, -2.5, -7]} color="#22c55e" speed={1.1} />
      <WireframeOcta position={[0, -3.5, -5]} color="#3b82f6" speed={1.8} />
      <WireframeOcta position={[-6.5, 0, -9]} color="#f59e0b" speed={0.8} />
    </>
  );
}

export default function SceneBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true, antialias: true }}>
      <Scene />
    </Canvas>
  );
}
