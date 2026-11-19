/**
 * Web Audio API synthesizer for the realistic mechanical spin wheel.
 * Synthesizes crisp ratchet clicks, peg impacts, and a soft romantic chime
 * without requiring any external audio assets.
 */

class SpinSoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  /**
   * Initializes or resumes the AudioContext upon user gesture.
   */
  public init(): void {
    if (typeof window === 'undefined') return;

    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // AudioContext unavailable or denied
    }
  }

  /**
   * Plays a crisp, physical peg strike ratchet click.
   * @param pitchMultiplier slight pitch shift (+/- 8%) for organic variation
   * @param intensity volume factor (decreases as wheel decelerates)
   */
  public playTick(pitchMultiplier = 1.0, intensity = 1.0): void {
    if (this.isMuted || !this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const t = this.ctx.currentTime;
      const clampedIntensity = Math.max(0.15, Math.min(1.0, intensity));

      // 1. High-frequency transient (the sharp mechanical snap of the peg)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'triangle';
      const baseFreq = 880 * pitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.016);

      oscGain.gain.setValueAtTime(0.24 * clampedIntensity, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.025);

      // 2. Subtle low thump (the resonance of the wooden/acrylic wheel housing)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(220, t);
      subOsc.frequency.exponentialRampToValueAtTime(60, t + 0.03);

      subGain.gain.setValueAtTime(0.12 * clampedIntensity, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start(t);
      subOsc.stop(t + 0.038);
    } catch {
      // Audio playback failed safely
    }
  }

  /**
   * Plays a gentle, celebratory chime arpeggio when the wheel rests on Bracelet.
   */
  public playWinChime(): void {
    if (this.isMuted || !this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // Elegant romantic notes: E5, G#5, B5, E6
      const notes = [659.25, 830.61, 987.77, 1318.51];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = t + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.16, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.85);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.9);
      });
    } catch {
      // Audio playback failed safely
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const spinSound = new SpinSoundSynthesizer();
