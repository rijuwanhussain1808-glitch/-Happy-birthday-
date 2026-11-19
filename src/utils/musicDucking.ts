/**
 * Utility logic for managing audio ducking and background music transitions
 * when custom media/video clips are played.
 */

export type VideoAudioEvent = 'videoPlay' | 'videoPause' | 'videoEnded' | 'modalClose';

export interface MusicTransitionResult {
  shouldPlayMusic: boolean;
  targetVolume: number;
}

/**
 * Determines whether background music should play and what its volume should be
 * based on video playback events.
 *
 * Rules:
 * - When video plays: automatically lower background music to 0 so only video sound is heard.
 * - When video ends: automatically play background music with full volume.
 * - When modal closes: resume background music if it was previously playing.
 */
export function handleVideoPlaybackTransition(
  event: VideoAudioEvent,
  wasMusicPlayingBefore: boolean
): MusicTransitionResult {
  switch (event) {
    case 'videoPlay':
      return { shouldPlayMusic: false, targetVolume: 0 };
    case 'videoEnded':
      return { shouldPlayMusic: true, targetVolume: 1 };
    case 'videoPause':
    case 'modalClose':
      return { shouldPlayMusic: wasMusicPlayingBefore, targetVolume: 1 };
    default:
      return { shouldPlayMusic: wasMusicPlayingBefore, targetVolume: 1 };
  }
}
