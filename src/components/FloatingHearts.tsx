import React, { useMemo } from 'react';

interface AmbientHeartSpec {
  id: number;
  left: number; // percentage (0 - 100)
  size: number; // pixels
  duration: number; // seconds
  delay: number; // seconds
  driftX: number; // px
  rotate: number; // deg
  opacity: number;
  color: string;
}

export const FloatingHearts: React.FC = () => {
  // Ambient background drifting hearts
  const ambientHearts: AmbientHeartSpec[] = useMemo(
    () => [
      { id: 1, left: 6, size: 16, duration: 18, delay: 0, driftX: 35, rotate: 15, opacity: 0.22, color: '#E9B8C4' },
      { id: 2, left: 18, size: 22, duration: 22, delay: 4, driftX: -30, rotate: -20, opacity: 0.28, color: '#C98598' },
      { id: 3, left: 28, size: 14, duration: 16, delay: 8, driftX: 40, rotate: 25, opacity: 0.18, color: '#C8A96B' },
      { id: 4, left: 38, size: 20, duration: 24, delay: 2, driftX: -25, rotate: -15, opacity: 0.25, color: '#E9B8C4' },
      { id: 5, left: 48, size: 18, duration: 19, delay: 11, driftX: 30, rotate: 18, opacity: 0.2, color: '#C98598' },
      { id: 6, left: 58, size: 24, duration: 21, delay: 5, driftX: -35, rotate: -22, opacity: 0.3, color: '#E9B8C4' },
      { id: 7, left: 68, size: 15, duration: 17, delay: 13, driftX: 25, rotate: 12, opacity: 0.22, color: '#C8A96B' },
      { id: 8, left: 78, size: 22, duration: 23, delay: 1, driftX: -40, rotate: -18, opacity: 0.26, color: '#C98598' },
      { id: 9, left: 88, size: 16, duration: 20, delay: 7, driftX: 30, rotate: 20, opacity: 0.24, color: '#E9B8C4' },
      { id: 10, left: 94, size: 19, duration: 25, delay: 15, driftX: -20, rotate: -10, opacity: 0.22, color: '#C98598' },
      { id: 11, left: 12, size: 15, duration: 20, delay: 10, driftX: 20, rotate: 16, opacity: 0.2, color: '#C8A96B' },
      { id: 12, left: 84, size: 18, duration: 18, delay: 12, driftX: -28, rotate: -14, opacity: 0.25, color: '#E9B8C4' },
    ],
    []
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
      data-testid="floating-hearts-ambient-container"
    >
      {ambientHearts.map((h) => (
        <div
          key={h.id}
          className="absolute animate-floating-heart"
          style={
            {
              left: `${h.left}%`,
              width: `${h.size}px`,
              height: `${h.size}px`,
              '--duration': `${h.duration}s`,
              '--delay': `${h.delay}s`,
              '--drift-x': `${h.driftX}px`,
              '--drift-rotate': `${h.rotate}deg`,
              '--heart-opacity': h.opacity,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill={h.color}
            className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(201,133,152,0.25)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
