"use client";

import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

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
        <meshStandardMaterial color={color} wireframe transparent opacity={0.15} />
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
        <meshStandardMaterial color={color} wireframe transparent opacity={0.12} />
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
        <meshStandardMaterial color={color} wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

export function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 4]} color="#22c55e" intensity={1.5} />
      <pointLight position={[-6, -4, 2]} color="#3b82f6" intensity={1} />
      <pointLight position={[0, -6, -4]} color="#a855f7" intensity={0.6} />

      {/* Left side shapes */}
      <WireframeTorus position={[-8, 2.5, -8]} color="#22c55e" speed={0.8} />
      <WireframeIcosa position={[-7.5, -3.5, -8]} color="#22c55e" speed={0.7} />
      <WireframeOcta position={[-9, 0, -11]} color="#f59e0b" speed={0.5} />

      {/* Right side shapes */}
      <WireframeTorus position={[8.5, -1.5, -9]} color="#3b82f6" speed={0.6} />
      <WireframeIcosa position={[7.5, 4, -10]} color="#a855f7" speed={1.0} />
      <WireframeOcta position={[6, -4.5, -6]} color="#3b82f6" speed={1.2} />
    </>
  );
}
