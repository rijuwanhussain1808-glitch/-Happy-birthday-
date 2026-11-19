/**
 * Pure utility functions and configurations for scroll-triggered intersection observer reveals.
 */

export interface RevealOptions {
  delayMs?: number;
  distancePx?: number;
  reducedMotion?: boolean;
}

export const DEFAULT_OBSERVER_CONFIG: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px 0px -40px 0px',
  threshold: 0.15,
};

/**
 * Calculates a staggered entrance delay in milliseconds for list / grid items.
 * @param index Index of the item (0-based)
 * @param stepMs Delay increment per item (default 90ms)
 * @param maxDelayMs Cap on maximum delay (default 600ms to keep mobile snappy)
 */
export function calculateStaggerDelay(
  index: number,
  stepMs = 90,
  maxDelayMs = 600
): number {
  if (index < 0) return 0;
  return Math.min(index * stepMs, maxDelayMs);
}

/**
 * Determines whether an intersection entry meets the criteria to trigger a reveal.
 */
export function shouldRevealEntry(
  isIntersecting: boolean,
  intersectionRatio = 0,
  requiredThreshold = 0.1
): boolean {
  if (!isIntersecting) return false;
  return intersectionRatio >= requiredThreshold || isIntersecting;
}

/**
 * Generates the Tailwind CSS class names for scroll-reveal fade-and-slide.
 */
export function getRevealClassName(
  isVisible: boolean,
  extraClasses = ''
): string {
  const baseTransitions =
    'transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100';

  const visibilityClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-8 pointer-events-none';

  return `${baseTransitions} ${visibilityClasses} ${extraClasses}`.trim();
}
