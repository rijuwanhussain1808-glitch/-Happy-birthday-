import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScrollProgress } from './scrollProgress.js';

test('calculateScrollProgress returns 0 when at top of document', () => {
  const progress = calculateScrollProgress(0, 2000, 800);
  assert.equal(progress, 0);
});

test('calculateScrollProgress calculates middle progress accurately', () => {
  // scrollHeight 2000, clientHeight 1000 -> maxScroll = 1000
  // scrollTop 500 -> 50%
  const progress = calculateScrollProgress(500, 2000, 1000);
  assert.equal(progress, 50);
});

test('calculateScrollProgress returns 100 when scrolled to bottom', () => {
  // maxScroll = 1200, scrollTop = 1200 -> 100%
  const progress = calculateScrollProgress(1200, 2000, 800);
  assert.equal(progress, 100);
});

test('calculateScrollProgress clamps values between 0 and 100', () => {
  // Negative scroll (iOS bounce)
  assert.equal(calculateScrollProgress(-50, 2000, 800), 0);
  // Overscroll
  assert.equal(calculateScrollProgress(1500, 2000, 800), 100);
});

test('calculateScrollProgress handles unscrollable content gracefully', () => {
  // Content fits entirely on screen
  assert.equal(calculateScrollProgress(0, 600, 800), 100);
});
