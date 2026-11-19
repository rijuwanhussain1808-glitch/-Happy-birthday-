/**
 * Pure functions and algorithms for the interactive Heart Trail sequence effect.
 */

export interface HeartTrailParticle {
  id: string;
  x: number; // spawn X in pixels
  y: number; // spawn Y in pixels
  size: number; // heart size in pixels
  color: string; // hex color code
  delayMs: number; // staggered entrance delay in ms
  driftX: number; // horizontal drift distance in px
  driftY: number; // vertical float distance in px
  rotation: number; // rotation in deg
  scale: number; // scale multiplier
  createdAt: number; // timestamp in ms
  durationMs: number; // total animation duration in ms
}

export interface TrailOptions {
  count?: number;
  stepDelayMs?: number;
  colors?: string[];
  spreadRadius?: number;
  durationMs?: number;
}

export const ROMANTIC_PALETTE = [
  '#C98598', // Deep Rose
  '#E9B8C4', // Soft Blush
  '#C8A96B', // Champagne Gold
  '#F3A6B8', // Rose Petal
  '#D67590', // Vibrant Rose
  '#FCE4EC', // Delicate Cream Pink
];

/**
 * Generates an elegant sequence of hearts arching across the screen from a click coordinate.
 * Hearts are staggered along a gentle romantic curve so they appear to blossom and sweep in sequence.
 */
export function generateHeartTrail(
  originX: number,
  originY: number,
  options: TrailOptions = {},
  timestamp = Date.now()
): HeartTrailParticle[] {
  const count = options.count ?? 8;
  const stepDelayMs = options.stepDelayMs ?? 55;
  const colors = options.colors ?? ROMANTIC_PALETTE;
  const baseDurationMs = options.durationMs ?? 1600;

  const particles: HeartTrailParticle[] = [];

  // Randomize initial trajectory direction slightly (bias toward an upward arc)
  // Arc angle spans between -60° and +60° around the click
  const directionBias = (Math.random() - 0.5) * 40; // slight random lean
  const baseSpread = options.spreadRadius ?? 32;

  for (let i = 0; i < count; i++) {
    const progress = (i + 1) / count;
    // Sequential wave path across the screen:
    // Staggered points fan out in an expressive trailing ribbon
    const angle = ((-Math.PI / 2) + ((i - count / 2) * 0.28) + (directionBias * Math.PI / 180));
    const distance = (i + 1) * (baseSpread * 0.85);

    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance * 0.6; // flatter vertically so they trail across

    const particleX = originX + offsetX;
    const particleY = originY + offsetY;

    // Sizing: slightly vary sizes along the sequence with a crescendo in the middle
    const sizeVariation = Math.sin(progress * Math.PI) * 8;
    const size = Math.round(16 + sizeVariation + (Math.random() * 6));

    const color = colors[i % colors.length];
    const delayMs = i * stepDelayMs;

    // Upward floating physics
    const driftX = (Math.random() - 0.5) * 50 + (offsetX * 0.4);
    const driftY = -(65 + Math.random() * 45); // float upward
    const rotation = (Math.random() - 0.5) * 40;

    particles.push({
      id: `trail-${timestamp}-${i}-${Math.random().toString(36).substring(2, 7)}`,
      x: Math.round(particleX),
      y: Math.round(particleY),
      size,
      color,
      delayMs,
      driftX: Math.round(driftX),
      driftY: Math.round(driftY),
      rotation: Math.round(rotation),
      scale: +(0.85 + Math.random() * 0.35).toFixed(2),
      createdAt: timestamp,
      durationMs: baseDurationMs,
    });
  }

  return particles;
}

/**
 * Removes particles whose lifetime has exceeded their duration.
 */
export function cleanupExpiredHearts(
  particles: HeartTrailParticle[],
  currentTime: number,
  maxSafetyBufferMs = 300
): HeartTrailParticle[] {
  return particles.filter((p) => {
    const totalLifetime = p.delayMs + p.durationMs + maxSafetyBufferMs;
    return currentTime - p.createdAt < totalLifetime;
  });
}

/**
 * Limits total active particles to prevent performance degradation on rapid clicking.
 */
export function capActiveHearts(
  particles: HeartTrailParticle[],
  maxAllowed = 40
): HeartTrailParticle[] {
  if (particles.length <= maxAllowed) return particles;
  // Keep the most recent particles
  return particles.slice(particles.length - maxAllowed);
}

/**
 * Determines whether a mousemove event has traveled far enough and enough time has elapsed
 * to spawn the next small cursor heart.
 */
export function shouldSpawnCursorHeart(
  currentX: number,
  currentY: number,
  lastX: number,
  lastY: number,
  lastTime: number,
  currentTime: number,
  minDistance = 24,
  minIntervalMs = 45
): boolean {
  if (currentTime - lastTime < minIntervalMs) {
    return false;
  }
  const dx = currentX - lastX;
  const dy = currentY - lastY;
  const distanceSq = dx * dx + dy * dy;
  return distanceSq >= minDistance * minDistance;
}

/**
 * Creates a single delicate heart particle following the cursor.
 */
export function createCursorHeart(
  x: number,
  y: number,
  timestamp = Date.now()
): HeartTrailParticle {
  const colors = ROMANTIC_PALETTE;
  const colorIndex = Math.floor(Math.random() * colors.length);
  const color = colors[colorIndex];
  const size = Math.round(11 + Math.random() * 5); // small delicate size (11px - 16px)

  return {
    id: `cursor-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
    x: Math.round(x),
    y: Math.round(y),
    size,
    color,
    delayMs: 0,
    driftX: Math.round((Math.random() - 0.5) * 24),
    driftY: -Math.round(30 + Math.random() * 35), // gentle float upward
    rotation: Math.round((Math.random() - 0.5) * 35),
    scale: +(0.85 + Math.random() * 0.25).toFixed(2),
    createdAt: timestamp,
    durationMs: 950,
  };
}

export interface ExplosionOptions {
  count?: number;
  radius?: number;
  colors?: string[];
  durationMs?: number;
}

/**
 * Generates a circular 360-degree radial "explosion" of hearts originating from a click coordinate.
 * Hearts burst outward uniformly in a circle with subtle organic variation in distance, angle, and size.
 */
export function generateHeartExplosion(
  originX: number,
  originY: number,
  options: ExplosionOptions = {},
  timestamp = Date.now()
): HeartTrailParticle[] {
  const count = options.count ?? 12;
  const baseRadius = options.radius ?? 80;
  const colors = options.colors ?? ROMANTIC_PALETTE;
  const durationMs = options.durationMs ?? 1100;

  const particles: HeartTrailParticle[] = [];
  const angleStep = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    // Distribute angles evenly around the 360-degree circle with a small organic jitter
    const jitter = (Math.random() - 0.5) * (angleStep * 0.35);
    const angle = i * angleStep + jitter;

    // Radius with slight variation so the explosion feels organic
    const distance = baseRadius * (0.8 + Math.random() * 0.45);

    const driftX = Math.cos(angle) * distance;
    // Radial burst with gentle buoyant upward bias
    const driftY = Math.sin(angle) * distance - 20;

    const size = Math.round(13 + Math.random() * 8); // 13px - 21px
    const color = colors[i % colors.length];
    const rotation = Math.round((Math.random() - 0.5) * 50);
    const scale = +(0.95 + Math.random() * 0.35).toFixed(2);

    particles.push({
      id: `burst-${timestamp}-${i}-${Math.random().toString(36).substring(2, 7)}`,
      x: Math.round(originX),
      y: Math.round(originY),
      size,
      color,
      delayMs: 0,
      driftX: Math.round(driftX),
      driftY: Math.round(driftY),
      rotation,
      scale,
      createdAt: timestamp,
      durationMs,
    });
  }

  return particles;
}
