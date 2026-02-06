'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ─── Minimal SVG line icons matching MohnMenu's brand ─── */
const brandIcons = [
  // Utensils
  (
    <svg key="utensils" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
  // Store
  (
    <svg key="store" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7l2-4h16l2 4" /><path d="M2 7h20" /><path d="M4 7v13h16V7" /><path d="M9 20v-8h6v8" />
    </svg>
  ),
  // Map pin
  (
    <svg key="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" /><circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  // Credit card
  (
    <svg key="card" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" /><path d="M5 16h4" />
    </svg>
  ),
  // Bitcoin
  (
    <svg key="btc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-6.083-1.043m6.083 1.043-.346 1.962M8.494 5.33 5.86 18.047m2.634-12.717 6.083 1.042m-6.083-1.042-.346 1.97m6.428-.928.35-1.97" />
    </svg>
  ),
  // Delivery truck
  (
    <svg key="truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 4v4h-7V8Z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  // Chart
  (
    <svg key="chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 5-9" />
    </svg>
  ),
  // QR code
  (
    <svg key="qr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="8" height="8" rx="1" /><rect x="14" y="2" width="8" height="8" rx="1" /><rect x="2" y="14" width="8" height="8" rx="1" /><path d="M14 14h3v3h-3zm5 0h3v3h-3zm-5 5h3v3h-3zm5 0h3v3h-3z" />
    </svg>
  ),
  // Video camera (Chef Cam)
  (
    <svg key="video" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="15" height="14" rx="2" /><path d="M16 10l5-3v10l-5-3" />
    </svg>
  ),
  // Shield (security)
  (
    <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
    </svg>
  ),
];

/* ─── Single floating icon ─── */
interface FloatingIconProps {
  icon: React.ReactNode;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotation: number;
}

const FloatingIcon = ({ icon, x, y, size, duration, delay, drift, rotation }: FloatingIconProps) => (
  <motion.div
    className="absolute text-zinc-400/[0.07] pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      y: [0, -drift, drift * 0.5, 0],
      x: [0, drift * 0.3, -drift * 0.2, 0],
      rotate: [0, rotation, -rotation * 0.5, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {icon}
  </motion.div>
);

/* ─── Background component ─── */
const AnimatedBackground = () => {
  const items = useMemo(() => {
    const seed = 42;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed + i * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };

    return Array.from({ length: 18 }, (_, i) => ({
      icon: brandIcons[i % brandIcons.length],
      x: seededRandom(i * 3) * 90 + 5,
      y: seededRandom(i * 3 + 1) * 85 + 5,
      size: 28 + seededRandom(i * 3 + 2) * 24,
      duration: 18 + seededRandom(i * 7) * 14,
      delay: seededRandom(i * 5) * 8,
      drift: 15 + seededRandom(i * 11) * 25,
      rotation: 8 + seededRandom(i * 13) * 12,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Subtle gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white to-red-50/20" />

      {/* Floating line icons */}
      {items.map((item, i) => (
        <FloatingIcon key={i} {...item} />
      ))}
    </div>
  );
};

export default AnimatedBackground;
