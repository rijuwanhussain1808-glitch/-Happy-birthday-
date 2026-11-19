import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextIndex, getPrevIndex, getSwipeDirection } from './slider.js';

test('getNextIndex loops forward and wraps around', () => {
  assert.equal(getNextIndex(0, 4), 1);
  assert.equal(getNextIndex(1, 4), 2);
  assert.equal(getNextIndex(2, 4), 3);
  assert.equal(getNextIndex(3, 4), 0); // loop around to start

  // Non-looping mode
  assert.equal(getNextIndex(3, 4, false), 3);
});

test('getPrevIndex loops backward and wraps around', () => {
  assert.equal(getPrevIndex(3, 4), 2);
  assert.equal(getPrevIndex(2, 4), 1);
  assert.equal(getPrevIndex(1, 4), 0);
  assert.equal(getPrevIndex(0, 4), 3); // loop around to end

  // Non-looping mode
  assert.equal(getPrevIndex(0, 4, false), 0);
});

test('getSwipeDirection detects left, right, or insignificant swipes', () => {
  // Swipe left (finger moved right-to-left: startX > endX) -> next slide
  assert.equal(getSwipeDirection(200, 100, 50), 'left');

  // Swipe right (finger moved left-to-right: startX < endX) -> prev slide
  assert.equal(getSwipeDirection(100, 200, 50), 'right');

  // Under threshold -> null
  assert.equal(getSwipeDirection(100, 130, 50), null);
});
