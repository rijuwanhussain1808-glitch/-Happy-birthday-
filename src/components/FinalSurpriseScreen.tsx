import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { config } from '../config';
import { SafeImage } from './SafeImage';
import { SpinWheelSection } from './SpinWheelSection';
import { useMusic } from '../context/MusicContext';
import { calculateScrollProgress } from '../utils/scrollProgress';

interface FinalSurpriseScreenProps {
  onRevisitStory: () => void;
  onPlayPuzzleAgain: () => void;
}

const FULL_LETTER = `${config.surpriseScreen.envelope.letterHeading}\n\n${config.surpriseScreen.envelope.letterBody}\n\n${config.surpriseScreen.envelope.letterSignoff}`;

export const FinalSurpriseScreen: React.FC<FinalSurpriseScreenProps> = ({
  onRevisitStory,
  onPlayPuzzleAgain,
}) => {
  const [envelopeState, setEnvelopeState] = useState<'sealed' | 'opening' | 'opened'>('sealed');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const letterRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isPlaying, togglePlay, duckForVideo, resumeFromVideo } = useMusic();

  const handleCloseVideoModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    resumeFromVideo(false);
    setShowVideoModal(false);
  };

  // Scroll reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const progress = calculateScrollProgress(scrollTop, scrollHeight, clientHeight);
      setScrollProgress(progress);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const triggerSurpriseSparks = () => {
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.45 },
      colors: ['#E9B8C4', '#C98598', '#C8A96B', '#FFF9F2'],
    });
  };

  const handleOpenEnvelope = () => {
    if (envelopeState !== 'sealed') return;

    setEnvelopeState('opening');
    triggerSurpriseSparks();

    // Smooth physical envelope opening sequence:
    // Wax seal breaks -> Flap opens -> Letter paper slides out into full view
    setTimeout(() => {
      setEnvelopeState('opened');
      setIsTyping(true);
      setDisplayedText('');
    }, 620);
  };

  const handleCloseEnvelope = () => {
    setEnvelopeState('sealed');
    setIsTyping(false);
    setDisplayedText('');
  };

  const handleSkipTyping = () => {
    setDisplayedText(FULL_LETTER);
    setIsTyping(false);
  };

  const handleReadLetterAgain = () => {
    setEnvelopeState('opened');
    setDisplayedText('');
    setIsTyping(true);
  };

  const handleScrollToAndOpenLetter = () => {
    if (letterRef.current) {
      letterRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (envelopeState === 'sealed') {
      setTimeout(() => {
        handleOpenEnvelope();
      }, 350);
    }
  };

  // Fluid typewriter effect designed for longer heartfelt letter
  useEffect(() => {
    if (envelopeState !== 'opened' || !isTyping) return;

    let index = 0;
    const speed = 16;
    const interval = setInterval(() => {
      index += 3;
      if (index >= FULL_LETTER.length) {
        setDisplayedText(FULL_LETTER);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedText(FULL_LETTER.slice(0, index));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [envelopeState, isTyping]);

  const toggleCardFlip = (id: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      {/* Subtle, thin reading progress bar at top (attached right below header navbar) */}
      <div
        className="fixed top-16 left-0 right-0 z-30 h-[3px] bg-[#C8A96B]/15 pointer-events-none"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress through final surprise"
      >
        <div
          className="h-full bg-gradient-to-r from-[#E9B8C4] via-[#C98598] to-[#C8A96B] transition-[width] duration-150 ease-out shadow-[0_1px_6px_rgba(201,133,152,0.4)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Opening Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[#C8A96B] font-medium">
          Chapter III · Heartfelt Gift
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#49383D] mt-2 mb-4 [text-wrap:balance]">
          {config.surpriseScreen.heading}
        </h2>
        <p className="text-base sm:text-lg text-[#C98598] font-serif italic [text-wrap:balance]">
          “{config.surpriseScreen.supportingText}”
        </p>
      </div>

      {/* SECTION A: THE HEARTFELT BIRTHDAY LETTER ENVELOPE */}
      <div className="mb-24 flex flex-col items-center" ref={letterRef}>
        {envelopeState !== 'opened' ? (
          <div
            onClick={handleOpenEnvelope}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpenEnvelope();
            }}
            data-testid="birthday-letter-envelope"
            aria-label="Sealed birthday letter for Saru. Tap to break wax seal and open."
            className="group cursor-pointer w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] via-[#FAF3EC] to-[#F3E7DC] rounded-3xl p-7 sm:p-10 border-2 border-[#C8A96B]/50 soft-card-shadow hover:border-[#C8A96B] transition-all duration-300 text-center relative overflow-hidden shadow-lg hover:shadow-xl select-none transform hover:-translate-y-1"
          >
            {/* Airmail Ribbon Accent Trim */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C98598] via-[#C8A96B] to-[#E9B8C4]" />

            {/* Vintage Airmail Postage Stamp */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-6 w-14 h-18 bg-white border-2 border-dashed border-[#C8A96B]/60 rounded-xs p-1 shadow-xs transform rotate-3 group-hover:rotate-6 transition-transform">
              <div className="w-full h-full bg-[#FFF9F2] border border-[#C8A96B]/30 flex flex-col items-center justify-between p-1">
                <span className="text-[9px] uppercase tracking-wider text-[#C8A96B] font-mono">Special</span>
                <span className="text-sm">🎂</span>
                <span className="text-[8px] font-mono text-[#49383D]/70 font-bold">20 NOV</span>
              </div>
            </div>

            {/* Decorative Gold Corner Accents */}
            <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-[#C8A96B]/50 rounded-tl-lg" />
            <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-[#C8A96B]/50 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-[#C8A96B]/50 rounded-br-lg" />

            {/* Realistic Top Folded Envelope Flap */}
            <div
              className={`mx-auto w-36 h-10 relative mb-2 transition-transform duration-500 origin-top ${
                envelopeState === 'opening' ? 'rotate-x-180 opacity-50 scale-95' : ''
              }`}
            >
              <div className="w-0 h-0 border-l-[72px] border-l-transparent border-r-[72px] border-r-transparent border-t-[44px] border-t-[#EEDBCB] drop-shadow-sm mx-auto" />
            </div>

            {/* 3D Wax Seal with Rose / Birthday Crest */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <div
                className={`w-18 h-18 rounded-full bg-gradient-to-br from-[#A8324F] via-[#85223A] to-[#601426] border-2 border-[#E5C583] shadow-md flex items-center justify-center text-white transition-all duration-300 ${
                  envelopeState === 'opening' ? 'scale-125 opacity-35' : 'group-hover:scale-110'
                }`}
              >
                <div className="w-13 h-13 rounded-full border border-dashed border-[#F3DFC1]/60 flex items-center justify-center text-2xl">
                  🌹
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-[#C8A96B] to-[#FFE8B3] border border-white flex items-center justify-center text-[10px] text-[#49383D] shadow-xs">
                ✨
              </div>
            </div>

            <span className="text-[11px] uppercase tracking-widest text-[#C8A96B] font-medium block mb-1">
              Special Birthday Delivery · Sealed with Love
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#49383D]">
              {config.surpriseScreen.envelope.coverTitle}
            </h3>
            <p className="font-handwriting text-2xl sm:text-3xl text-[#C98598] font-bold mt-1">
              For my dearest Saru (Sarena) 🌸
            </p>

            {/* Interactive Call to Action */}
            <div className="mt-7">
              <span className="inline-flex items-center gap-2 px-8 py-3 bg-[#C98598] group-hover:bg-[#b77487] text-white text-xs sm:text-sm font-medium rounded-full shadow-md transition-all duration-200 group-hover:scale-105 active:scale-95 ring-2 ring-[#C8A96B]/40">
                <span>{envelopeState === 'opening' ? 'Unfolding Birthday Letter... ✨' : 'Tap to Break Seal & Open Letter 💌'}</span>
              </span>
            </div>

            <p className="text-[11px] text-[#49383D]/60 italic font-serif mt-3">
              “A personal handwritten birthday wish written just for you.”
            </p>
          </div>
        ) : (
          /* THE NEW PAGE INSIDE THE LETTER: Warm antique parchment paper with distinct handwritten script */
          <div
            data-testid="birthday-letter-opened"
            className="w-full max-w-2xl letter-parchment-sheet rounded-3xl p-6 sm:p-12 border-2 border-[#C8A96B]/50 soft-card-shadow relative animate-letter-paper-rise text-left overflow-hidden"
          >
            {/* Top Gilded Stationery Header Ribbon */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#C8A96B]/30 pb-4 mb-8 gap-3">
              <div className="flex items-center gap-2 text-[#C8A96B]">
                <span className="text-xl">🎂</span>
                <span className="text-xs uppercase tracking-widest font-mono font-medium">
                  Happy Birthday, Saru · 20 November
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isTyping && (
                  <button
                    onClick={handleSkipTyping}
                    className="px-3 py-1 bg-white/80 hover:bg-white text-[#49383D] border border-[#C8A96B]/40 rounded-full text-xs font-medium cursor-pointer shadow-2xs transition-colors"
                  >
                    Read all ⏭
                  </button>
                )}
                <button
                  onClick={handleCloseEnvelope}
                  className="px-3 py-1 bg-[#FFF9F2] hover:bg-[#FDECEF] text-[#C98598] border border-[#C8A96B]/40 rounded-full text-xs font-medium cursor-pointer shadow-2xs transition-colors"
                  title="Fold letter and put it back in the envelope"
                >
                  Fold Letter ✉️
                </button>
              </div>
            </div>

            {/* Letter Body in Distinct Handwritten Calligraphy */}
            <div className="font-handwriting text-2xl sm:text-3xl text-[#3A272E] leading-relaxed sm:leading-loose whitespace-pre-wrap tracking-wide selection:bg-[#E9B8C4]/50">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-2 h-6 bg-[#C98598] ml-1 animate-pulse align-middle" />
              )}
            </div>

            {/* Bottom Gilded Flourish & Signature Bar */}
            <div className="mt-10 pt-6 border-t border-[#C8A96B]/30 flex flex-wrap items-center justify-between gap-4 text-xs font-serif text-[#49383D]/70">
              <div className="flex items-center gap-2 text-[#C8A96B]">
                <span>Written with warmth & care by Rihan</span>
                <span>·</span>
                <span className="text-[#C98598]">💗</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReadLetterAgain}
                  className="text-[#C98598] hover:text-[#49383D] underline underline-offset-4 cursor-pointer text-xs"
                >
                  Read letter from start
                </button>
                <button
                  onClick={handleCloseEnvelope}
                  className="text-[#49383D]/70 hover:text-[#C98598] underline underline-offset-4 cursor-pointer text-xs"
                >
                  Close envelope
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* SECTION B: FIVE PERSONAL MESSAGE CARDS */}
      <div className="mb-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#49383D]">
            Five Little Truths
          </h3>
          <p className="text-xs sm:text-sm text-[#49383D]/70 mt-1">
            Gentle notes to keep close to your heart. Tap any card to reflect.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {config.surpriseScreen.personalMessages.map((msg) => {
            const isFlipped = flippedCards[msg.id];
            return (
              <div
                key={msg.id}
                onClick={() => toggleCardFlip(msg.id)}
                className="bg-white rounded-2xl p-6 border border-[#C8A96B]/25 soft-card-shadow soft-card-hover cursor-pointer flex flex-col justify-between min-h-[160px] relative"
              >
                <div className="flex items-center justify-between text-[#C8A96B] text-xs font-mono mb-4">
                  <span>Note {msg.note}</span>
                  <span className="text-[#C98598]">🌹</span>
                </div>

                <p className="font-serif italic text-base sm:text-lg text-[#49383D] leading-snug [text-wrap:balance]">
                  “{msg.quote}”
                </p>

                <div className="mt-4 pt-3 border-t border-[#C8A96B]/15 text-[11px] text-[#49383D]/50 flex justify-between items-center">
                  <span>From Rihan to Saru</span>
                  <span>{isFlipped ? '✨ Touched' : 'Tap to cherish'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION C: PHOTO REVEAL (Couple photo + Sarena Gallery together) */}
      <div className="mb-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#49383D]">
            The Keepsake Gallery
          </h3>
          <p className="text-xs sm:text-sm text-[#49383D]/70 mt-1">
            All our special captures, preserved in one gentle collection.
          </p>
        </div>

        {/* Two Featured Couple Frames */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          {/* Couple Frame 1 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#C8A96B]/30 soft-card-shadow">
            <div className="aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#FFF9F2] border border-[#C8A96B]/20">
              <SafeImage
                src={config.photos.couplePhoto.src}
                fallbackSrc={config.photos.couplePhoto.fallbackSrc}
                alt={config.photos.couplePhoto.alt}
                className="w-full h-full object-cover object-top"
                fallbackTitle={config.photos.couplePhoto.title}
              />
            </div>
            <div className="mt-4 text-center">
              <h4 className="font-serif text-lg sm:text-xl font-bold text-[#49383D]">
                {config.photos.couplePhoto.title}
              </h4>
              <p className="font-serif italic text-xs sm:text-sm text-[#C98598] mt-1">
                “{config.photos.couplePhoto.caption}”
              </p>
            </div>
          </div>

          {/* Couple Frame 2 (Forehead kiss) */}
          {config.photos.couplePhoto2 && (
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#C8A96B]/30 soft-card-shadow">
              <div className="aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#FFF9F2] border border-[#C8A96B]/20">
                <SafeImage
                  src={config.photos.couplePhoto2.src}
                  fallbackSrc={config.photos.couplePhoto2.fallbackSrc}
                  alt={config.photos.couplePhoto2.alt}
                  className="w-full h-full object-cover object-top"
                  fallbackTitle={config.photos.couplePhoto2.title}
                />
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#49383D]">
                  {config.photos.couplePhoto2.title}
                </h4>
                <p className="font-serif italic text-xs sm:text-sm text-[#C98598] mt-1">
                  “{config.photos.couplePhoto2.caption}”
                </p>
              </div>
            </div>
          )}
        </div>

        {/* All Sarena Solo Photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {config.photos.sarenaGallery.map((p, idx) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-2.5 border border-[#C8A96B]/20 soft-card-shadow"
            >
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#FFF9F2] border border-[#C8A96B]/15">
                <SafeImage
                  src={p.src}
                  fallbackSrc={p.fallbackSrc}
                  alt={p.alt}
                  className="w-full h-full object-cover"
                  fallbackTitle={`Sarena 0${idx + 1}`}
                />
              </div>
              <p className="font-serif italic text-[11px] sm:text-xs text-center text-[#49383D] mt-2 line-clamp-2">
                “{p.caption}”
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION D: THE WHEEL OF DESTINY (Interactive Keepsake Surprise) */}
      <SpinWheelSection />

      {/* SECTION E: OPTIONAL BIRTHDAY FEATURE */}
      {config.birthday.enabled && (
        <div className="mb-24">
          <div className="max-w-xl mx-auto bg-gradient-to-r from-[#FFF9F2] via-white to-[#FFF9F2] rounded-3xl p-6 sm:p-10 border border-[#C8A96B]/40 soft-card-shadow text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-[#E9B8C4]/20 border border-[#C8A96B]/40 text-[#C98598]">
              <span className="text-xl" role="img" aria-label="Birthday celebration">
                🎂
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest text-[#C8A96B] font-medium block mb-1">
              A Special Wish for {config.birthday.displayDate}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#49383D] mb-3">
              Happy Birthday, Saru
            </h3>
            <p className="font-serif italic text-base sm:text-lg text-[#49383D]/90 max-w-md mx-auto leading-relaxed">
              “{config.birthday.message}”
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleScrollToAndOpenLetter}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C98598] hover:bg-[#b77487] text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ring-2 ring-[#C8A96B]/40"
              >
                <span>Read Full Birthday Letter 💌</span>
              </button>
            </div>
            <p className="mt-4 text-[11px] text-[#49383D]/50">
              Marked for 20 November 2026 · A gentle blessing meant for your special day
            </p>
          </div>
        </div>
      )}

      {/* SECTION E: MUSIC FEATURE (Alfaaz) */}
      <div className="mb-24">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#C8A96B]/30 soft-card-shadow text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FFF9F2] border border-[#C8A96B]/40 flex items-center justify-center text-[#C98598]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <span className="text-xs text-[#C8A96B] font-medium uppercase tracking-wider block">
            Favourite Song · {isPlaying ? 'Now Playing 🎵' : 'Paused'}
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#49383D] mt-1">
            {config.music.songTitle}
          </h3>
          <p className="text-sm text-[#C98598] font-serif italic mb-4">
            by {config.music.artists}
          </p>
          <p className="text-xs text-[#49383D]/70 max-w-sm mx-auto mb-6">
            {config.music.caption}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={togglePlay}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C98598] hover:bg-[#b77487] text-white text-xs sm:text-sm font-medium rounded-full shadow-xs transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>Pause Music</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Play Alfaaz</span>
                </>
              )}
            </button>

            {config.music.videoSrc && (
              <button
                onClick={() => setShowVideoModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#C8A96B]/40 hover:bg-[#FFF9F2] text-[#49383D] text-xs sm:text-sm font-medium rounded-full shadow-xs transition-colors cursor-pointer"
              >
                <span>Watch Video Clip 🎬</span>
              </button>
            )}

            <a
              href={config.music.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs text-[#49383D]/70 hover:text-[#49383D] underline underline-offset-4 cursor-pointer"
            >
              <span>Original Release</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-[#49383D]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none"
          onClick={handleCloseVideoModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#FFF9F2] rounded-3xl p-4 sm:p-6 max-w-sm w-full border border-[#C8A96B] soft-card-shadow relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseVideoModal}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-[#49383D] flex items-center justify-center text-sm font-bold shadow-xs cursor-pointer border border-[#C8A96B]/30 hover:bg-[#FFF9F2]"
              aria-label="Close video modal"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <p className="font-serif font-bold text-lg text-[#49383D] mb-1">
              Alfaaz · Video Clip
            </p>
            <p className="text-xs text-[#C98598] font-serif italic mb-3">
              “Unki tareef main kahe kya... Alfaaz hi nahi hain”
            </p>
            <div className="rounded-2xl overflow-hidden aspect-[9/16] max-h-[60vh] bg-black mx-auto border border-[#C8A96B]/30 shadow-inner">
              <video
                ref={videoRef}
                src={config.music.videoSrc}
                controls
                autoPlay
                playsInline
                onPlay={duckForVideo}
                onEnded={() => resumeFromVideo(true)}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION F: REPLAY OPTIONS */}
      <div className="pt-8 border-t border-[#C8A96B]/20 text-center">
        <p className="font-serif italic text-sm text-[#49383D]/70 mb-6">
          Every moment here is yours to revisit whenever you wish.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onRevisitStory}
            className="px-6 py-3 bg-white border border-[#C8A96B]/40 hover:bg-[#FFF9F2] text-[#49383D] rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
          >
            {config.surpriseScreen.replayButtons.revisitStory}
          </button>

          <button
            onClick={onPlayPuzzleAgain}
            className="px-6 py-3 bg-white border border-[#C8A96B]/40 hover:bg-[#FFF9F2] text-[#49383D] rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
          >
            {config.surpriseScreen.replayButtons.playPuzzleAgain}
          </button>

          <button
            onClick={handleReadLetterAgain}
            className="px-6 py-3 bg-[#C98598] hover:bg-[#b77487] text-white rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
          >
            {config.surpriseScreen.replayButtons.readLetterAgain}
          </button>
        </div>
      </div>
    </section>
  </>
  );
};
