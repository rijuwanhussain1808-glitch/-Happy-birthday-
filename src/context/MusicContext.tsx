import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { config } from '../config';

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  play: () => Promise<void>;
  pause: () => void;
  hasStarted: boolean;
  duckForVideo: () => void;
  resumeFromVideo: (forcePlay?: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingBeforeVideo = useRef(false);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(config.music.audioSrc || '/audio/alfaaz.mp3');
    audio.loop = true;
    audio.preload = 'auto';

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.volume = 1;
      await audioRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } catch (err) {
      console.warn('Audio play request was not allowed or failed:', err);
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const duckForVideo = useCallback(() => {
    if (!audioRef.current) return;
    wasPlayingBeforeVideo.current = !audioRef.current.paused;
    audioRef.current.volume = 0;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const resumeFromVideo = useCallback((forcePlay = true) => {
    if (!audioRef.current) return;
    audioRef.current.volume = 1;
    if (forcePlay || wasPlayingBeforeVideo.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch((err) => {
          console.warn('Audio resume request failed:', err);
        });
    }
    wasPlayingBeforeVideo.current = false;
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        togglePlay,
        play,
        pause,
        hasStarted,
        duckForVideo,
        resumeFromVideo,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export function useMusic(): MusicContextType {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
