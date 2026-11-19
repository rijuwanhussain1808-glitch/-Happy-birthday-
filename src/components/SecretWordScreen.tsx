import React, { useState } from 'react';
import { config } from '../config';

interface SecretWordScreenProps {
  onUnlock: () => void;
}

export const SecretWordScreen: React.FC<SecretWordScreenProps> = ({ onUnlock }) => {
  const [inputWord, setInputWord] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputWord.trim().toLowerCase();
    const targetWord = config.secretWord.trim().toLowerCase();

    if (!cleanInput) {
      setErrorMessage('Please type in the secret word to continue.');
      return;
    }

    if (cleanInput === targetWord) {
      setErrorMessage('');
      setIsSubmitting(true);
      onUnlock();
    } else {
      setErrorMessage(config.secretScreen.errorMessage);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 sm:py-20">
      {/* Decorative background with Photo 6 and subtle cream/blush overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={config.photos.secretScreenPhoto.src}
          alt={config.photos.secretScreenPhoto.alt}
          className="w-full h-full object-cover opacity-15 filter blur-xs"
          onError={(e) => {
            // Graceful fallback to hidden if image fails
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9F2]/90 via-[#FFF9F2]/95 to-[#FFF9F2]" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#C8A96B]/30 soft-card-shadow text-center">
          {/* Rose seal emblem */}
          <div className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-full bg-[#FFF9F2] border border-[#C8A96B]/40 text-[#C98598] shadow-xs">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#49383D] mb-3 [text-wrap:balance]">
            {config.secretScreen.heading}
          </h2>

          <p className="text-sm sm:text-base text-[#49383D]/80 mb-8 [text-wrap:balance]">
            {config.secretScreen.supportingText}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="secret-word-input" className="sr-only">
                Secret Word
              </label>
              <input
                id="secret-word-input"
                type="text"
                autoComplete="off"
                placeholder={config.secretScreen.inputPlaceholder}
                value={inputWord}
                onChange={(e) => {
                  setInputWord(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full px-5 py-3.5 bg-[#FFF9F2] text-[#49383D] placeholder-[#49383D]/40 text-center font-serif text-lg rounded-full border border-[#C8A96B]/40 focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 transition-all outline-hidden"
              />
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="p-3 bg-[#E9B8C4]/20 border border-[#C98598]/40 rounded-xl text-xs sm:text-sm text-[#49383D] leading-relaxed"
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-[#C98598] hover:bg-[#b77487] text-white font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-base disabled:opacity-50"
            >
              {isSubmitting ? 'Opening Door...' : config.secretScreen.unlockButtonText}
            </button>
          </form>

          {/* Gentle Hint Toggle */}
          <div className="mt-6 pt-4 border-t border-[#C8A96B]/15 text-xs text-[#49383D]/70">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-[#C98598] hover:text-[#49383D] underline underline-offset-4 cursor-pointer transition-colors"
            >
              {showHint ? 'Hide hint' : 'Need a whisper? (Hint)'}
            </button>
            {showHint && (
              <p className="mt-2 text-xs italic text-[#C8A96B] animate-fadeIn">
                {config.secretScreen.hintText}
              </p>
            )}
          </div>

          {/* Technical Note on Frontend Security */}
          <p className="mt-8 text-[11px] text-[#49383D]/50 leading-normal">
            Note: This front-end secret gate is designed for a playful surprise experience between loved ones.
          </p>
        </div>
      </div>
    </section>
  );
};
