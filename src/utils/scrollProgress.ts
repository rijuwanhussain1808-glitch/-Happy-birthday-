/**
 * Utility for calculating scroll reading progress as a percentage between 0 and 100.
 */

export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) {
    return 100;
  }
  const progress = (scrollTop / maxScroll) * 100;
  return Math.min(100, Math.max(0, progress));
}
