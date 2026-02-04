'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { Float, Lightformer, Html } from '@react-three/drei';

interface IconItemProps {
  icon: string;
  position: Vector3;
  scale: number;
  rotationSpeed: { x: number; y: number };
}

const IconItem = ({ icon, position, scale, rotationSpeed }: IconItemProps) => {
  const ref = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeed.x * delta;
      ref.current.rotation.y += rotationSpeed.y * delta;
    }
  });

  return (
    <Float floatIntensity={0.5} rotationIntensity={0.5} speed={1}>
      <mesh ref={ref} position={position} scale={scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <MeshStandardMaterial color="#ffffff" transparent opacity={0.6} metalness={0.2} roughness={0.5} />
        <Html transform>
          <div style={{ fontSize: `${scale * 100}px`, lineHeight: 1, userSelect: 'none' }}>{icon}</div>
        </Html>
      </mesh>
    </Float>
  );
};

// Define some emojis related to local businesses, food, and technology
const icons = ['🍔', '🍕', '🍜', '☕', '🛒', '📱', '💻', '🚀', '💡', '💰', '📡', '📊', '📈', '🤝', '🎯', '🏪', '🍽️', '🚚'];

const FloatingIcons = () => {
  const items = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 30; i++) {
      const position = new Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      const scale = Math.random() * 0.5 + 0.2;
      const rotationSpeed = {
        x: Math.random() * 0.1 - 0.05,
        y: Math.random() * 0.1 - 0.05,
      };
      const icon = icons[Math.floor(Math.random() * icons.length)];
      temp.push({ position, scale, rotationSpeed, icon });
    }
    return temp;
  }, []);

  return (
    <>
      {items.map((item, i) => (
        <IconItem key={i} {...item} />
      ))}
    </>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 z-[-1]">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <color attach="background" args={['#f8f8f8']} /> {/* Light background color */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />

        <Float speed={2} floatIntensity={1} rotationIntensity={0.5}>
          <Lightformer form="circle" intensity={0.5} color="#ffd700" position={[0, 0, 0]} scale={[10, 10, 10]} />
        </Float>

        <FloatingIcons />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
