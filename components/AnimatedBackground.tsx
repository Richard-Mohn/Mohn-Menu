'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
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
        <meshStandardMaterial color="#ffffff" transparent opacity={0.4} metalness={0.1} roughness={0.5} />
        <Html transform distanceFactor={10}>
          <div className="select-none pointer-events-none opacity-60" style={{ fontSize: '40px' }}>{icon}</div>
        </Html>
      </mesh>
    </Float>
  );
};

// Emojis related to local businesses, food, and technology
const icons = ['🍔', '🍕', '🍜', '☕', '🛒', '📱', '💻', '🚀', '💡', '💰', '📡', '📊', '📈', '🤝', '🎯', '🏪', '🍽️', '🚚'];

const FloatingIcons = () => {
  const items = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 25; i++) {
      const position = new Vector3(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15
      );
      const scale = Math.random() * 0.3 + 0.1;
      const rotationSpeed = {
        x: Math.random() * 0.2 - 0.1,
        y: Math.random() * 0.2 - 0.1,
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
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <FloatingIcons />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
