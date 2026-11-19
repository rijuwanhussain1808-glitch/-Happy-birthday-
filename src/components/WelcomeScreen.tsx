import React, { useMemo } from 'react';
import { config } from '../config';
import { getBirthdayGreeting } from '../utils/greeting';

interface WelcomeScreenProps {
  onBegin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin }) => {
  // Birthday celebration greeting for Saru
  const { greeting, subtitleText } = useMemo(() => {
    return getBirthdayGreeting(config.recipientNickname || config.recipientName);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 sm:py-24">
      {/* Subtle romantic ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-[#E9B8C4]/25 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-2xl mx-auto text-center z-10">
        {/* Delicate Kicker */}
        <div className="mb-3 text-xs uppercase tracking-widest text-[#C8A96B] font-medium">
          A Special Surprise · {config.websiteName}
        </div>

        {/* Personalized time-based headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-[#49383D] tracking-tight leading-[1.1] mb-5 [text-wrap:balance]">
          {greeting}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-[#C98598] mb-8 font-normal [text-wrap:balance]">
          “{config.tagline}”
        </p>

        {/* Supporting message */}
        <div className="max-w-lg mx-auto bg-white/70 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-[#C8A96B]/25 soft-card-shadow mb-10">
          <p className="text-xs sm:text-sm font-serif italic text-[#C98598] mb-3">
            {subtitleText}
          </p>
          <p className="text-sm sm:text-base text-[#49383D]/90 leading-relaxed [text-wrap:balance]">
            {config.welcomeNote}
          </p>

          <div className="mt-4 pt-4 border-t border-[#C8A96B]/20 flex items-center justify-center gap-2 text-xs text-[#C8A96B]">
            <span>Dedicated to {config.recipientName}</span>
            <span aria-hidden="true">·</span>
            <span>From {config.senderName}</span>
          </div>
        </div>

        {/* Prominent Action Button */}
        <div>
          <button
            onClick={onBegin}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#C98598] hover:bg-[#b77487] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-base sm:text-lg focus-visible:ring-2 focus-visible:ring-[#C8A96B] focus-visible:ring-offset-2"
          >
            <span>Begin Our Story</span>
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
