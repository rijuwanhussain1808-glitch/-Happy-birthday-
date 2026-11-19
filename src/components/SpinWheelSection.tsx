import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  WHEEL_ITEMS,
  BRACELET_INDEX,
  TOTAL_PEGS,
  PEG_ANGLE,
  calculateNextRotation,
  calculateTargetRotation,
  calculateSpinProgress,
  countPegsCrossed,
  WheelItem,
} from '../utils/spinWheel';
import { spinSound } from '../utils/spinSound';
import { config } from '../config';

interface SpinWheelSectionProps {
  onGiftRevealed?: (item: WheelItem) => void;
}

export const SpinWheelSection: React.FC<SpinWheelSectionProps> = ({ onGiftRevealed }) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);
  const [revealedItem, setRevealedItem] = useState<WheelItem | null>(null);
  const [spinCount, setSpinCount] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Direct DOM references for 60-120fps hardware-accelerated animation
  // (guarantees both wheel and arrow rotate continuously without CSS transition issues)
  const wheelRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  // Keep track of accumulated rotation so consecutive spins keep moving clockwise
  const accumulatedRotationRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastAngleRef = useRef<number>(0);
  const pointerAngleRef = useRef<number>(0);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handleToggleMute = () => {
    const muted = spinSound.toggleMute();
    setIsMuted(muted);
  };

  const handleSpin = () => {
    if (isSpinning) return;

    // Initialize Web Audio API on genuine user click
    spinSound.init();

    setIsSpinning(true);
    setRevealedItem(null);

    // Subtle natural jitter (+/- 10 deg) inside the 90-degree Bracelet slice
    const jitter = (Math.random() - 0.5) * 20;
    // 6 full revolutions + target offset to guarantee landing on Bracelet (index 3) on EVERY spin
    const spins = 6 + (spinCount % 3);
    const startRotation = accumulatedRotationRef.current;
    const targetOffset = calculateNextRotation(startRotation, BRACELET_INDEX, WHEEL_ITEMS.length, spins, jitter);

    const finalRotation = startRotation + targetOffset;
    accumulatedRotationRef.current = finalRotation;
    setSpinCount((c) => c + 1);

    // Frame-by-frame physics loop: rotates BOTH wheel and flapper needle simultaneously
    const duration = 4800; // ms
    const startTime = performance.now();
    lastAngleRef.current = startRotation;
    pointerAngleRef.current = 0;

    const tickLoop = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      const progress = calculateSpinProgress(t);
      const currentWheelAngle = startRotation + targetOffset * progress;

      // 1. Visibly rotate the wheel on EVERY single frame (fluid 60-120 FPS)
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentWheelAngle}deg)`;
      }

      // 2. Count perimeter pegs crossed between frames
      const pegsCrossed = countPegsCrossed(lastAngleRef.current, currentWheelAngle, PEG_ANGLE);

      if (pegsCrossed > 0) {
        lastAngleRef.current = currentWheelAngle;
        const velocity = 1 - progress; // 1 at start, 0 at end
        const pitch = 0.94 + Math.random() * 0.12;

        // Mechanical sound intensity tied directly to wheel speed
        spinSound.playTick(pitch, Math.max(0.3, velocity * 1.1));

        // 3. Arrow needle actively flutters and deflects as pegs strike it
        const deflection = Math.min(18, 10 + velocity * 8 + (Math.random() - 0.5) * 3);
        pointerAngleRef.current = deflection;
        if (pointerRef.current) {
          pointerRef.current.style.transform = `translateX(-50%) rotate(${deflection}deg)`;
        }
      } else {
        // Arrow needle springs back towards center between pegs
        pointerAngleRef.current = pointerAngleRef.current * 0.72;
        if (Math.abs(pointerAngleRef.current) < 0.2) {
          pointerAngleRef.current = 0;
        }
        if (pointerRef.current) {
          pointerRef.current.style.transform = `translateX(-50%) rotate(${pointerAngleRef.current}deg)`;
        }
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(tickLoop);
      } else {
        // Final frame: lock exact final rotation on the wheel
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
        }

        // Settle needle with realistic damped bounce into Bracelet
        if (pointerRef.current) {
          pointerRef.current.style.transform = 'translateX(-50%) rotate(-3deg)';
          setTimeout(() => {
            if (pointerRef.current) {
              pointerRef.current.style.transform = 'translateX(-50%) rotate(1.5deg)';
            }
          }, 110);
          setTimeout(() => {
            if (pointerRef.current) {
              pointerRef.current.style.transform = 'translateX(-50%) rotate(0deg)';
            }
          }, 220);
        }

        setRotation(finalRotation);
        setIsSpinning(false);
        setHasSpun(true);
        const wonItem = WHEEL_ITEMS[BRACELET_INDEX];
        setRevealedItem(wonItem);

        if (onGiftRevealed) {
          onGiftRevealed(wonItem);
        }

        // Play gentle chime and fire celebration confetti
        spinSound.playWinChime();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#E9B8C4', '#C98598', '#C8A96B', '#FFF9F2'],
        });
      }
    };

    animFrameRef.current = requestAnimationFrame(tickLoop);
  };

  return (
    <div
      className="mb-24"
      role="region"
      aria-label="The Wheel of Destiny Keepsake Surprise"
      data-testid="spin-wheel-container"
    >
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-[#C8A96B] font-medium block">
          A Special Keepsake · Written in the Stars
        </span>
        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#49383D] mt-1 mb-2 [text-wrap:balance]">
          The Wheel of Destiny
        </h3>
        <p className="text-xs sm:text-sm text-[#49383D]/75 italic font-serif max-w-lg mx-auto [text-wrap:balance]">
          “Close your eyes, make a gentle wish, and let fate reveal the keepsake chosen just for you.”
        </p>
      </div>

      <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#C8A96B]/35 soft-card-shadow text-center relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#C8A96B]/35 rounded-tl-md" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#C8A96B]/35 rounded-tr-md" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#C8A96B]/35 rounded-bl-md" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#C8A96B]/35 rounded-br-md" />

        {/* Audio Mute/Unmute Discrete Control */}
        <button
          onClick={handleToggleMute}
          aria-label={isMuted ? 'Unmute mechanical sound effects' : 'Mute mechanical sound effects'}
          title={isMuted ? 'Sound muted - Click to unmute' : 'Mechanical sound on - Click to mute'}
          className="absolute top-4 right-4 z-30 p-2 text-xs rounded-full bg-[#FFF9F2] hover:bg-[#FDECEF] border border-[#C8A96B]/40 text-[#49383D]/70 hover:text-[#C98598] transition-colors cursor-pointer"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        {/* Wheel Apparatus Wrapper */}
        <div className="relative mx-auto w-[280px] h-[280px] sm:w-[330px] sm:h-[330px] mb-8 select-none">
          {/* Top Pointer Hinge & Flapper Needle */}
          <div
            ref={pointerRef}
            data-testid="wheel-pointer-needle"
            className="absolute top-[-8px] left-1/2 z-30 pointer-events-none drop-shadow-md"
            style={{
              transform: 'translateX(-50%) rotate(0deg)',
              transformOrigin: '50% 6px',
              willChange: 'transform',
            }}
          >
            {/* Top Anchor Hinge Rivet */}
            <div className="w-5 h-5 mx-auto rounded-full bg-gradient-to-tr from-[#9E7B35] via-[#E5C583] to-[#C8A96B] border border-white shadow-xs flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#49383D]/60" />
            </div>

            {/* Realistic Golden Flapper Needle pointing down into perimeter pegs */}
            <div className="w-0 h-0 border-l-[13px] border-l-transparent border-r-[13px] border-r-transparent border-t-[30px] border-t-[#C8A96B] relative -mt-1 mx-auto filter drop-shadow-[0_2px_4px_rgba(73,56,61,0.25)]">
              {/* Inner highlight ridge */}
              <div className="absolute -top-[28px] -left-[6px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[18px] border-t-white/90" />
            </div>
          </div>

          {/* Golden Outer Decorative Chassis Ring */}
          <div className="absolute inset-0 rounded-full border-[6px] border-[#C8A96B] shadow-[0_0_28px_rgba(200,169,107,0.3),inset_0_2px_6px_rgba(0,0,0,0.15)] pointer-events-none z-20" />

          {/* Rotating Wheel Container (driven directly via RAF ref for 100% reliable 60fps spin) */}
          <div
            ref={wheelRef}
            data-testid="wheel-rotating-disc"
            className={`w-full h-full rounded-full overflow-hidden shadow-inner relative ${
              isSpinning ? 'filter drop-shadow-md' : ''
            }`}
            style={{
              transform: `rotate(${rotation}deg)`,
              willChange: 'transform',
            }}
          >
            {/* SVG Wheel with 4 Slices, Perimeter Pegs, and Concentric Rings */}
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full"
              aria-label="Spinning wheel with 4 options: Watch, Photo Frame, Personal Alphabet Keychain, and Bracelet"
            >
              <defs>
                {/* Brass peg gradient */}
                <linearGradient id="brassPegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2D6" />
                  <stop offset="45%" stopColor="#E5C583" />
                  <stop offset="100%" stopColor="#9E7B35" />
                </linearGradient>

                {/* Subtle outer rim bezel gradient */}
                <radialGradient id="rimBezelGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="90%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#49383D" stopOpacity="0.18" />
                </radialGradient>
              </defs>

              {/* Slice 0: Watch (0° to 90°) */}
              <path
                d="M 200 200 L 200 0 A 200 200 0 0 1 400 200 Z"
                fill="#FFF9F2"
                stroke="#C8A96B"
                strokeWidth="2"
              />

              {/* Slice 1: Photo Frame (90° to 180°) */}
              <path
                d="M 200 200 L 400 200 A 200 200 0 0 1 200 400 Z"
                fill="#FDF0F3"
                stroke="#C8A96B"
                strokeWidth="2"
              />

              {/* Slice 2: Personal Alphabet Keychain (180° to 270°) */}
              <path
                d="M 200 200 L 200 400 A 200 200 0 0 1 0 200 Z"
                fill="#F6EFE7"
                stroke="#C8A96B"
                strokeWidth="2"
              />

              {/* Slice 3: Bracelet (270° to 360°) - Beautiful pastel blush, completely unrigged look */}
              <path
                d="M 200 200 L 0 200 A 200 200 0 0 1 200 0 Z"
                fill="#F8E8EE"
                stroke="#C8A96B"
                strokeWidth="2"
              />

              {/* Outer rim shadow overlay */}
              <circle cx="200" cy="200" r="198" fill="url(#rimBezelGrad)" pointerEvents="none" />

              {/* Concentric Decorative Hairline Rings */}
              <circle cx="200" cy="200" r="172" fill="none" stroke="#C8A96B" strokeWidth="0.75" strokeOpacity="0.45" strokeDasharray="3 3" />
              <circle cx="200" cy="200" r="168" fill="none" stroke="#C8A96B" strokeWidth="0.5" strokeOpacity="0.3" />

              {/* 16 Perimeter Golden Pegs (Pins) that strike the top pointer */}
              {Array.from({ length: TOTAL_PEGS }).map((_, i) => {
                const angleRad = (i * PEG_ANGLE * Math.PI) / 180;
                const pegR = 186;
                const px = 200 + pegR * Math.sin(angleRad);
                const py = 200 - pegR * Math.cos(angleRad);
                return (
                  <g key={`peg-${i}`} className="pointer-events-none">
                    {/* Shadow under peg */}
                    <circle cx={px + 0.6} cy={py + 1.2} r={4.5} fill="#3D2E32" opacity="0.28" />
                    {/* Solid brass pin */}
                    <circle
                      cx={px}
                      cy={py}
                      r={4.2}
                      fill="url(#brassPegGrad)"
                      stroke="#8C6E2E"
                      strokeWidth="0.8"
                    />
                    {/* Specular highlight */}
                    <circle cx={px - 1.2} cy={py - 1.2} r={1.3} fill="#FFFDF8" opacity="0.9" />
                  </g>
                );
              })}

              {/* Slice 0 Content: Watch */}
              <g transform="rotate(45, 200, 200) translate(200, 78)">
                <text
                  textAnchor="middle"
                  className="fill-[#49383D] font-serif text-[17px] font-bold tracking-wide"
                >
                  Watch ⌚
                </text>
                <text
                  textAnchor="middle"
                  y="16"
                  className="fill-[#49383D]/65 font-sans text-[11px] font-medium tracking-wide"
                >
                  (Timeless)
                </text>
              </g>

              {/* Slice 1 Content: Photo Frame */}
              <g transform="rotate(135, 200, 200) translate(200, 78)">
                <text
                  textAnchor="middle"
                  className="fill-[#49383D] font-serif text-[16px] font-bold tracking-wide"
                >
                  Photo Frame 🖼️
                </text>
                <text
                  textAnchor="middle"
                  y="16"
                  className="fill-[#49383D]/65 font-sans text-[11px] font-medium tracking-wide"
                >
                  (Memory)
                </text>
              </g>

              {/* Slice 2 Content: Alphabet Keychain */}
              <g transform="rotate(225, 200, 200) translate(200, 78)">
                <text
                  textAnchor="middle"
                  className="fill-[#49383D] font-serif text-[15px] font-bold tracking-wide"
                >
                  Keychain 🗝️
                </text>
                <text
                  textAnchor="middle"
                  y="16"
                  className="fill-[#49383D]/65 font-sans text-[11px] font-medium tracking-wide"
                >
                  (Alphabet)
                </text>
              </g>

              {/* Slice 3 Content: Bracelet (Clean, completely neutral and fair presentation) */}
              <g transform="rotate(315, 200, 200) translate(200, 78)">
                <text
                  textAnchor="middle"
                  className="fill-[#49383D] font-serif text-[17px] font-bold tracking-wide"
                >
                  Bracelet ✨
                </text>
                <text
                  textAnchor="middle"
                  y="16"
                  className="fill-[#49383D]/65 font-sans text-[11px] font-medium tracking-wide"
                >
                  (Promise)
                </text>
              </g>
            </svg>
          </div>

          {/* Center Hub Axle & Jewel (Real mechanical look) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-15 h-15 rounded-full bg-gradient-to-tr from-[#9E7B35] via-[#EFE2C6] to-[#C8A96B] p-1 shadow-lg z-25 flex items-center justify-center border-2 border-white pointer-events-none">
            <div className="w-full h-full rounded-full bg-[#FFF9F2] flex items-center justify-center text-[#C98598] text-base font-bold shadow-inner border border-[#C8A96B]/30">
              🌹
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-4">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            data-testid="spin-wheel-button"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#C98598] hover:bg-[#b77487] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-base disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] ring-2 ring-[#C8A96B]/40"
          >
            <span>
              {isSpinning
                ? 'Spinning Destiny... ✨'
                : hasSpun
                ? 'Spin Again for Fun 💫'
                : 'Spin the Wheel 🎁'}
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                isSpinning ? 'animate-spin' : 'group-hover:rotate-45'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>

          <p className="text-[11px] text-[#49383D]/60 italic font-serif">
            {isSpinning
              ? 'Listen as the wheel slows down peg by peg...'
              : 'Every keepsake carries a sweet thought from Rihan.'}
          </p>
        </div>

        {/* Revealed Keepsake Card */}
        {revealedItem && !isSpinning && (
          <div
            data-testid="spin-wheel-result"
            className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#FFF9F2] to-white border-2 border-[#C8A96B]/50 soft-card-shadow text-center animate-fadeIn"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-[#E9B8C4]/25 border border-[#C8A96B] text-[#C98598] shadow-xs text-xl">
              {revealedItem.icon}
            </div>

            <span className="text-[11px] uppercase tracking-widest text-[#C8A96B] font-mono block mb-1">
              Destiny Has Spoken · Your Chosen Gift
            </span>

            <h4 className="text-2xl sm:text-3xl font-serif font-bold text-[#49383D]">
              The {revealedItem.name}
            </h4>

            <p className="text-xs sm:text-sm text-[#C98598] font-serif italic mt-1 mb-4">
              “{revealedItem.subtitle}”
            </p>

            <div className="p-4 rounded-xl bg-white/80 border border-[#C8A96B]/20 text-xs sm:text-sm text-[#49383D]/90 font-serif leading-relaxed [text-wrap:balance]">
              {revealedItem.revealMessage}
            </div>

            <div className="mt-5 pt-4 border-t border-[#C8A96B]/20 flex items-center justify-center gap-2 text-xs text-[#C8A96B]">
              <span>Made with love by {config.senderName}</span>
              <span aria-hidden="true">·</span>
              <span>For {config.recipientNickname}</span>
              <span className="text-[#C98598]">💗</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
