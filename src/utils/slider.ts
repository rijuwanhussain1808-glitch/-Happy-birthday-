/**
 * Slider navigation and swipe detection utilities.
 */

export function getNextIndex(currentIndex: number, total: number, loop: boolean = true): number {
  if (total <= 0) return 0;
  if (currentIndex >= total - 1) {
    return loop ? 0 : total - 1;
  }
  return currentIndex + 1;
}

export function getPrevIndex(currentIndex: number, total: number, loop: boolean = true): number {
  if (total <= 0) return 0;
  if (currentIndex <= 0) {
    return loop ? total - 1 : 0;
  }
  return currentIndex - 1;
}

export function getSwipeDirection(
  startX: number,
  endX: number,
  threshold: number = 50
): 'left' | 'right' | null {
  const diff = endX - startX;
  if (Math.abs(diff) < threshold) {
    return null;
  }
  return diff > 0 ? 'right' : 'left'; // right = swiped right (go to previous); left = swiped left (go to next)
}
