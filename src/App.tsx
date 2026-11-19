import { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar, ScreenId } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SecretWordScreen } from './components/SecretWordScreen';
import { OurStoryScreen } from './components/OurStoryScreen';
import { PuzzleScreen } from './components/PuzzleScreen';
import { FinalSurpriseScreen } from './components/FinalSurpriseScreen';
import { PhotoGuideModal } from './components/PhotoGuideModal';
import { FloatingHearts } from './components/FloatingHearts';
import { MusicProvider, useMusic } from './context/MusicContext';
import {
  HeartTrailParticle,
  createCursorHeart,
  shouldSpawnCursorHeart,
  generateHeartExplosion,
  cleanupExpiredHearts,
  capActiveHearts,
} from './utils/heartTrail';
import { config } from './config';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');
  const [unlockedScreens, setUnlockedScreens] = useState<Set<ScreenId>>(
    new Set(['welcome', 'secret'])
  );
  const [isPhotoGuideOpen, setIsPhotoGuideOpen] = useState(false);
  const { play } = useMusic();

  // Check URL query parameters for testability (?autostart=1 or ?screen=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' || params.get('unlock') === 'all') {
      setUnlockedScreens(new Set(['welcome', 'secret', 'story', 'puzzle', 'surprise']));
      const targetScreen = params.get('screen') as ScreenId;
      if (['welcome', 'secret', 'story', 'puzzle', 'surprise'].includes(targetScreen)) {
        setCurrentScreen(targetScreen);
      } else {
        setCurrentScreen('story');
      }
    } else if (params.get('screen')) {
      const targetScreen = params.get('screen') as ScreenId;
      if (['welcome', 'secret', 'story', 'puzzle', 'surprise'].includes(targetScreen)) {
        setUnlockedScreens((prev) => new Set([...prev, targetScreen]));
        setCurrentScreen(targetScreen);
      }
    }
  }, []);

  const handleNavigate = useCallback((screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleUnlockSecret = useCallback(() => {
    // Automatically start the video song after password unlock!
    if (config.music.autoPlayOnUnlock) {
      play();
    }
    setUnlockedScreens((prev) => {
      if (prev.has('story') && prev.has('puzzle')) return prev;
      return new Set([...prev, 'story', 'puzzle']);
    });
    handleNavigate('story');
  }, [handleNavigate, play]);

  const handlePuzzleSolved = useCallback(() => {
    setUnlockedScreens((prev) => {
      if (prev.has('surprise')) return prev;
      return new Set([...prev, 'surprise']);
    });
  }, []);

  const handleRevealSurprise = useCallback(() => {
    setUnlockedScreens((prev) => {
      if (prev.has('surprise')) return prev;
      return new Set([...prev, 'surprise']);
    });
    handleNavigate('surprise');
  }, [handleNavigate]);

  // Cursor heart trail following cursor on global mousemove
  const [cursorHearts, setCursorHearts] = useState<HeartTrailParticle[]>([]);
  const cursorHeartsRef = useRef<HeartTrailParticle[]>([]);
  cursorHeartsRef.current = cursorHearts;

  // Global mousemove event listener to spawn small heart trail following cursor
  useEffect(() => {
    let lastPos = { x: 0, y: 0, time: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (
        shouldSpawnCursorHeart(
          e.clientX,
          e.clientY,
          lastPos.x,
          lastPos.y,
          lastPos.time,
          now,
          22, // min 22px movement
          40  // min 40ms interval
        )
      ) {
        lastPos = { x: e.clientX, y: e.clientY, time: now };
        const newParticle = createCursorHeart(e.clientX, e.clientY);
        setCursorHearts((prev) => capActiveHearts([...prev, newParticle], 32));
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Global click & tap listener triggering circular 'explosion' of hearts
  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (clientX > 0 || clientY > 0) {
        const explosion = generateHeartExplosion(clientX, clientY, {
          count: 14,
          radius: 85,
          durationMs: 1100,
        });
        setCursorHearts((prev) => capActiveHearts([...prev, ...explosion], 60));
      }
    };

    window.addEventListener('click', handleClick as EventListener, { passive: true });
    return () => window.removeEventListener('click', handleClick as EventListener);
  }, []);

  // Periodic cleanup of expired cursor particles
  useEffect(() => {
    if (cursorHearts.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const active = cleanupExpiredHearts(cursorHeartsRef.current, now, 100);
      if (active.length !== cursorHeartsRef.current.length) {
        setCursorHearts(active);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [cursorHearts.length > 0]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F2] text-[#49383D] relative overflow-x-hidden">
      {/* Subtle floating background hearts across all screens */}
      <FloatingHearts />

      {/* Global mousemove cursor heart trail effect using .animate-heart-trail */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-50 select-none"
        aria-hidden="true"
        data-testid="cursor-heart-trail-container"
        data-cursor-hearts-count={cursorHearts.length}
      >
        {cursorHearts.map((heart) => (
          <div
            key={heart.id}
            data-testid="cursor-heart-particle"
            className="absolute animate-heart-trail"
            style={
              {
                left: `${heart.x}px`,
                top: `${heart.y}px`,
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                '--trail-delay': '0ms',
                '--trail-duration': `${heart.durationMs}ms`,
                '--trail-drift-x': `${heart.driftX}px`,
                '--trail-drift-y': `${heart.driftY}px`,
                '--trail-rotate': `${heart.rotation}deg`,
                '--trail-scale': heart.scale,
              } as React.CSSProperties
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill={heart.color}
              className="w-full h-full filter drop-shadow-[0_1px_4px_rgba(201,133,152,0.45)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Top Bar Navigation */}
      <Navbar
        currentScreen={currentScreen}
        unlockedScreens={unlockedScreens}
        onNavigate={handleNavigate}
        onOpenPhotoGuide={() => setIsPhotoGuideOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="flex-1 relative z-10">
        {currentScreen === 'welcome' && (
          <WelcomeScreen onBegin={() => handleNavigate('secret')} />
        )}

        {currentScreen === 'secret' && (
          <SecretWordScreen onUnlock={handleUnlockSecret} />
        )}

        {currentScreen === 'story' && (
          <OurStoryScreen onProceedToPuzzle={() => handleNavigate('puzzle')} />
        )}

        {currentScreen === 'puzzle' && (
          <PuzzleScreen
            onPuzzleSolved={handlePuzzleSolved}
            onRevealSurprise={handleRevealSurprise}
            onBackToStory={() => handleNavigate('story')}
            isUnlocked={unlockedScreens.has('surprise')}
          />
        )}

        {currentScreen === 'surprise' && (
          <FinalSurpriseScreen
            onRevisitStory={() => handleNavigate('story')}
            onPlayPuzzleAgain={() => handleNavigate('puzzle')}
          />
        )}
      </main>

      {/* Elegant Quiet Romantic Footer */}
      <footer className="relative z-10 border-t border-[#C8A96B]/20 py-8 px-4 text-center text-xs text-[#49383D]/60 bg-[#FFF9F2]/80 backdrop-blur-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif italic text-sm text-[#49383D]/80">
            “{config.tagline}”
          </p>
          <div className="flex items-center gap-2">
            <span>Made with love by {config.senderName} for {config.recipientName}</span>
            <span aria-hidden="true" className="text-[#C98598]">💗</span>
          </div>
        </div>
      </footer>

      {/* Beginner-friendly Photo Setup Guide Modal */}
      <PhotoGuideModal
        isOpen={isPhotoGuideOpen}
        onClose={() => setIsPhotoGuideOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}
