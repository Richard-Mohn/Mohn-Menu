'use client';

import React, { useEffect, useState } from 'react';

// Floating animated food/store items for background
export const FloatingItems = () => {
  const [items, setItems] = useState<Array<{ id: number; emoji: string; x: number; y: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random positions and animations
    const newItems = [
      { emoji: '🍕', color: 'from-orange-400/20 to-red-400/20' },
      { emoji: '🍔', color: 'from-amber-400/20 to-orange-400/20' },
      { emoji: '🥗', color: 'from-green-400/20 to-emerald-400/20' },
      { emoji: '🍜', color: 'from-yellow-400/20 to-amber-400/20' },
      { emoji: '🛒', color: 'from-blue-400/20 to-indigo-400/20' },
      { emoji: '🍱', color: 'from-pink-400/20 to-rose-400/20' },
      { emoji: '🥤', color: 'from-cyan-400/20 to-blue-400/20' },
      { emoji: '🍰', color: 'from-rose-400/20 to-pink-400/20' },
      { emoji: '🌮', color: 'from-orange-400/20 to-yellow-400/20' },
      { emoji: '🍱', color: 'from-green-400/20 to-teal-400/20' },
    ].map((item, i) => ({
      id: i,
      emoji: item.emoji,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * 5,
    }));
    
    setItems(newItems);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute text-6xl opacity-10 animate-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animation: `float ${item.duration}s ease-in-out ${item.delay}s infinite`,
          }}
        >
          {item.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.05;
          }
          50% {
            transform: translateY(-50px) rotate(10deg);
            opacity: 0.1;
          }
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.05;
          }
        }
      `}</style>
    </div>
  );
};

// Animated counter for impressive stats
export const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Gradient text component
export const GradientText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
    {children}
  </span>
);
