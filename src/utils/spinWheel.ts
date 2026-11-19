/**
 * Pure functions and configuration for the Surprise Spin Wheel.
 */

export interface WheelItem {
  id: number;
  name: string;
  icon: string;
  subtitle: string;
  sliceColor: string;
  textColor: string;
  accentColor: string;
  revealMessage: string;
}

export const WHEEL_ITEMS: WheelItem[] = [
  {
    id: 1,
    name: 'Watch',
    icon: '⌚',
    subtitle: 'Timeless Keepsake',
    sliceColor: '#FFF9F2',
    textColor: '#49383D',
    accentColor: '#C8A96B',
    revealMessage: 'For every second we have shared, and all the moments still waiting for us.',
  },
  {
    id: 2,
    name: 'Photo Frame',
    icon: '🖼️',
    subtitle: 'Preserved Memory',
    sliceColor: '#FDECEF',
    textColor: '#49383D',
    accentColor: '#C98598',
    revealMessage: 'A frame to hold our warmest smile together right by your bedside.',
  },
  {
    id: 3,
    name: 'Personal Alphabet Keychain',
    icon: '🗝️',
    subtitle: 'Initial Keepsake',
    sliceColor: '#F5EBE1',
    textColor: '#49383D',
    accentColor: '#C8A96B',
    revealMessage: 'A little initial piece to carry wherever your day takes you.',
  },
  {
    id: 4,
    name: 'Bracelet',
    icon: '✨',
    subtitle: 'A Shining Promise',
    sliceColor: '#E9B8C4',
    textColor: '#49383D',
    accentColor: '#C98598',
    revealMessage:
      'Out of everything, this was always meant for you. A delicate bracelet to wrap around your wrist—a quiet, shining reminder that you are cherished beyond words.',
  },
];

/** Index of the predetermined winning product (Bracelet is index 3) */
export const BRACELET_INDEX = 3;

/** Total perimeter pegs on the wheel */
export const TOTAL_PEGS = 16;
export const PEG_ANGLE = 360 / TOTAL_PEGS; // 22.5°

/**
 * Calculates spin progress at normalized time t in [0, 1] using a realistic
 * deceleration curve (quartic ease-out) matching physical friction.
 */
export function calculateSpinProgress(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  // 1 - (1 - t)^4.2 gives a rapid start with long, suspenseful deceleration
  return 1 - Math.pow(1 - clamped, 4.2);
}

/**
 * Calculates how many perimeter pegs were crossed between startAngle and currentAngle.
 */
export function countPegsCrossed(startAngle: number, currentAngle: number, pegAngle = PEG_ANGLE): number {
  if (currentAngle <= startAngle) return 0;
  const startPeg = Math.floor(startAngle / pegAngle);
  const endPeg = Math.floor(currentAngle / pegAngle);
  return Math.max(0, endPeg - startPeg);
}

/**
 * Calculates the exact rotation degrees to add to currentRotation so the wheel spins
 * clockwise across fullSpins revolutions and lands squarely on targetIndex (Bracelet).
 * Works flawlessly on the 1st spin, 2nd spin, 3rd spin, and every subsequent spin.
 */
export function calculateNextRotation(
  currentRotation: number = 0,
  targetIndex = BRACELET_INDEX,
  totalSlices = WHEEL_ITEMS.length,
  fullSpins = 5,
  jitterDeg = 0
): number {
  const sliceAngle = 360 / totalSlices;
  // Center of target slice on wheel (for Bracelet at index 3, center is 315°)
  const sliceCenter = (targetIndex + 0.5) * sliceAngle;
  // Modulo angle needed so that sliceCenter aligns with the top pointer (0°)
  const targetModulo = (360 - sliceCenter + 360) % 360;

  // Maximum safe jitter to keep needle comfortably inside slice (±12° for 90° slice)
  const maxSafeJitter = sliceAngle * 0.28;
  const safeJitter = Math.max(-maxSafeJitter, Math.min(maxSafeJitter, jitterDeg));

  // Current wheel angle normalized [0, 360)
  const currentModulo = ((currentRotation % 360) + 360) % 360;

  // Degrees clockwise from current position to target slice
  let forwardDeg = ((targetModulo + safeJitter) - currentModulo) % 360;
  if (forwardDeg <= 0) {
    forwardDeg += 360;
  }

  // Total delta degrees to rotate forward
  return (fullSpins * 360) + forwardDeg;
}

/**
 * Calculates the total rotation degrees needed so the top pointer lands inside the target slice.
 * Supports currentRotation parameter to guarantee landing on Bracelet on every consecutive spin.
 */
export function calculateTargetRotation(
  targetIndex = BRACELET_INDEX,
  totalSlices = WHEEL_ITEMS.length,
  fullSpins = 5,
  jitterDeg = 0,
  currentRotation = 0
): number {
  return calculateNextRotation(currentRotation, targetIndex, totalSlices, fullSpins, jitterDeg);
}

/**
 * Given the final rotation degree, calculates which slice is currently under the top pointer (0°).
 */
export function getSliceFromRotation(
  rotationDeg: number,
  totalSlices = WHEEL_ITEMS.length
): number {
  const sliceAngle = 360 / totalSlices;
  // Normalize positive modulo 360
  const normalized = ((rotationDeg % 360) + 360) % 360;
  // Angle under pointer
  const pointerAngleOnWheel = (360 - normalized + 360) % 360;
  const index = Math.floor(pointerAngleOnWheel / sliceAngle);
  return (index + totalSlices) % totalSlices;
}


