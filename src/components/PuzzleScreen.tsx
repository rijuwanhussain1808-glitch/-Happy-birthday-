import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { config } from '../config';
import {
  EMPTY_TILE,
  isPuzzleSolved,
  moveTile,
  canTileMove,
  generateSolvableBoard,
  SOLVED_STATE,
} from '../utils/puzzle';

interface PuzzleScreenProps {
  onPuzzleSolved: () => void;
  onRevealSurprise: () => void;
  onBackToStory: () => void;
  isUnlocked: boolean;
}

export const PuzzleScreen: React.FC<PuzzleScreenProps> = ({
  onPuzzleSolved,
  onRevealSurprise,
  onBackToStory,
  isUnlocked,
}) => {
  const [board, setBoard] = useState<number[]>(() => generateSolvableBoard(35));
  const [moves, setMoves] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showNumbers, setShowNumbers] = useState<boolean>(true);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [activePhotoSrc, setActivePhotoSrc] = useState<string>(config.photos.couplePhoto.src);

  // Check if primary photo loads; if not, gracefully use fallbackSrc
  useEffect(() => {
    const testImg = new Image();
    testImg.src = config.photos.couplePhoto.src;
    testImg.onload = () => setActivePhotoSrc(config.photos.couplePhoto.src);
    testImg.onerror = () => setActivePhotoSrc(config.photos.couplePhoto.fallbackSrc);
  }, []);

  // Track whether we've already notified the parent that the puzzle was solved
  const hasReportedSolvedRef = React.useRef(false);

  // Trigger celebration confetti
  const triggerCelebration = useCallback(() => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E9B8C4', '#C98598', '#C8A96B', '#FFF9F2'],
    });
  }, []);

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    const emptyIndex = board.indexOf(EMPTY_TILE);
    if (!canTileMove(index, emptyIndex)) {
      return;
    }

    const next = moveTile(board, index);
    if (next) {
      setBoard(next);
      setMoves((m) => m + 1);

      if (isPuzzleSolved(next)) {
        setIsSolved(true);
        if (!hasReportedSolvedRef.current) {
          hasReportedSolvedRef.current = true;
          onPuzzleSolved();
        }
        triggerCelebration();
      }
    }
  };

  const handleRestart = () => {
    setBoard(generateSolvableBoard(35));
    setMoves(0);
    setIsSolved(false);
    hasReportedSolvedRef.current = false;
  };

  // Helper auto-solve for testing or when user requests assistance
  const handleAutoSolve = () => {
    setBoard([...SOLVED_STATE]);
    setMoves((m) => m + 1);
    setIsSolved(true);
    if (!hasReportedSolvedRef.current) {
      hasReportedSolvedRef.current = true;
      onPuzzleSolved();
    }
    triggerCelebration();
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs uppercase tracking-widest text-[#C8A96B] font-medium">
          Chapter II · Interactive Keepsake
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#49383D] mt-2 mb-3 [text-wrap:balance]">
          {config.puzzleScreen.heading}
        </h2>
        <p className="text-xs sm:text-sm text-[#49383D]/75 leading-relaxed [text-wrap:balance]">
          {config.puzzleScreen.instructionText}
        </p>

        {/* Moves & helper controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#49383D]/80">
          <div className="px-4 py-1.5 bg-white border border-[#C8A96B]/30 rounded-full font-medium shadow-2xs">
            Moves: <span className="font-mono text-[#C98598] font-bold text-sm ml-1">{moves}</span>
          </div>

          <button
            onClick={() => setShowNumbers(!showNumbers)}
            className="px-3.5 py-1.5 bg-white/70 hover:bg-white border border-[#C8A96B]/30 rounded-full cursor-pointer transition-colors shadow-2xs"
          >
            {showNumbers ? 'Hide Tile Numbers' : 'Show Tile Numbers'}
          </button>

          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="px-3.5 py-1.5 bg-white/70 hover:bg-white border border-[#C8A96B]/30 rounded-full cursor-pointer transition-colors shadow-2xs"
          >
            {showOriginal ? 'Hide Reference' : 'Peek Original'}
          </button>
        </div>
      </div>

      {/* Main Puzzle Card Container */}
      <div className="flex flex-col items-center">
        <div className="relative p-3 sm:p-5 bg-white rounded-3xl border border-[#C8A96B]/40 soft-card-shadow">
          {/* Reference Image Overlay Modal */}
          {showOriginal && (
            <div className="absolute inset-4 z-20 bg-white/95 backdrop-blur-xs rounded-2xl p-4 flex flex-col items-center justify-center border border-[#C8A96B]/30 text-center animate-fadeIn">
              <p className="text-xs font-serif text-[#C98598] mb-2 font-medium">Target Picture Preview</p>
              <div className="w-56 h-56 rounded-xl overflow-hidden border border-[#C8A96B]/40">
                <img
                  src={activePhotoSrc}
                  alt="Reference couple photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setShowOriginal(false)}
                className="mt-3 px-4 py-1 text-xs bg-[#49383D] text-white rounded-full cursor-pointer hover:bg-[#34272b]"
              >
                Close Preview
              </button>
            </div>
          )}

          {/* 3x3 Grid (Strict dimensions: 285px on mobile, 360px on desktop) */}
          <div
            className="grid grid-cols-3 gap-1.5 sm:gap-2 w-[285px] h-[285px] sm:w-[360px] sm:h-[360px] bg-[#FFF9F2] p-1.5 sm:p-2 rounded-2xl border border-[#C8A96B]/25 select-none"
            role="grid"
            aria-label="3 by 3 sliding photo puzzle"
          >
            {board.map((tileValue, index) => {
              const emptyIndex = board.indexOf(EMPTY_TILE);
              const isMovable = !isSolved && canTileMove(index, emptyIndex);

              if (tileValue === EMPTY_TILE) {
                // Empty cell
                return (
                  <div
                    key={`empty-${index}`}
                    className={`rounded-xl flex items-center justify-center transition-all ${
                      isSolved
                        ? 'bg-[#C98598]/20 border border-[#C98598]/30'
                        : 'bg-[#FFF9F2]/60 border border-dashed border-[#C8A96B]/30'
                    }`}
                    aria-label="Empty tile slot"
                  >
                    {isSolved && (
                      <span className="text-xl" role="img" aria-label="Heart">
                        💗
                      </span>
                    )}
                  </div>
                );
              }

              // Calculate background offset for 3x3 cropping
              // Tile value is 1..8
              const origRow = Math.floor((tileValue - 1) / 3);
              const origCol = (tileValue - 1) % 3;
              const bgPosX = origCol * 50; // 0%, 50%, 100%
              const bgPosY = origRow * 50; // 0%, 50%, 100%

              return (
                <button
                  key={`tile-${tileValue}`}
                  onClick={() => handleTileClick(index)}
                  disabled={isSolved}
                  style={{
                    backgroundImage: `url(${activePhotoSrc})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                  }}
                  className={`relative rounded-xl overflow-hidden border transition-transform duration-150 cursor-pointer shadow-xs ${
                    isMovable
                      ? 'border-[#C8A96B] hover:scale-[1.03] active:scale-[0.97] ring-1 ring-[#C8A96B]/40'
                      : 'border-[#C8A96B]/30 opacity-95'
                  }`}
                  aria-label={`Tile ${tileValue} at position ${index + 1}`}
                >
                  {/* Optional Tile Number Badge for ease of solving */}
                  {showNumbers && (
                    <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold flex items-center justify-center">
                      {tileValue}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Success Banner when Solved */}
          {isSolved && (
            <div className="mt-6 p-4 rounded-2xl bg-[#E9B8C4]/20 border border-[#C98598]/40 text-center animate-fadeIn">
              <p className="font-serif text-lg sm:text-xl font-bold text-[#49383D]">
                {config.puzzleScreen.successMessage}
              </p>
              <div className="mt-4">
                <button
                  onClick={onRevealSurprise}
                  className="px-8 py-3.5 bg-[#C98598] hover:bg-[#b77487] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-base sm:text-lg hover:scale-[1.02] active:scale-[0.98] ring-2 ring-[#C8A96B]/50"
                >
                  {config.puzzleScreen.revealButtonText} 💗
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Puzzle Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleRestart}
            className="px-5 py-2.5 bg-white border border-[#C8A96B]/40 text-[#49383D] rounded-full hover:bg-[#FFF9F2] text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
          >
            {config.puzzleScreen.restartButtonText}
          </button>

          <button
            onClick={onBackToStory}
            className="px-5 py-2.5 bg-white border border-[#C8A96B]/40 text-[#49383D] rounded-full hover:bg-[#FFF9F2] text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
          >
            {config.puzzleScreen.backButtonText}
          </button>

          {/* Friendly Auto-Solve helper button (keeps user in complete control) */}
          {!isSolved && (
            <button
              onClick={handleAutoSolve}
              className="px-4 py-2.5 text-xs text-[#C98598] hover:text-[#49383D] underline underline-offset-4 cursor-pointer transition-colors"
              title="Align the tiles automatically"
            >
              Solve Puzzle For Me
            </button>
          )}

          {/* If already unlocked previously, allow instant advance */}
          {isUnlocked && !isSolved && (
            <button
              onClick={onRevealSurprise}
              className="px-5 py-2.5 bg-[#C98598]/20 border border-[#C98598]/50 text-[#49383D] rounded-full hover:bg-[#C98598]/30 text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
            >
              Skip to Surprise
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
