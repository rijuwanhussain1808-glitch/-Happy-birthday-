import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStaggerDelay,
  shouldRevealEntry,
  getRevealClassName,
  DEFAULT_OBSERVER_CONFIG,
} from './scrollReveal';

test('calculateStaggerDelay applies proportional delays with cap', () => {
  assert.equal(calculateStaggerDelay(0), 0);
  assert.equal(calculateStaggerDelay(1, 100), 100);
  assert.equal(calculateStaggerDelay(2, 100), 200);
  assert.equal(calculateStaggerDelay(10, 100, 500), 500); // capped at 500
  assert.equal(calculateStaggerDelay(-1), 0);
});

test('shouldRevealEntry correctly validates intersection state', () => {
  assert.equal(shouldRevealEntry(false, 0, 0.15), false);
  assert.equal(shouldRevealEntry(true, 0.2, 0.15), true);
  assert.equal(shouldRevealEntry(true, 0.05, 0.15), true); // isIntersecting true
});

test('getRevealClassName outputs expected animation classes', () => {
  const visible = getRevealClassName(true);
  assert.ok(visible.includes('opacity-100'));
  assert.ok(visible.includes('translate-y-0'));
  assert.ok(!visible.includes('pointer-events-none'));
  assert.ok(visible.includes('motion-reduce:opacity-100'));

  const hidden = getRevealClassName(false);
  assert.ok(hidden.includes('opacity-0'));
  assert.ok(hidden.includes('translate-y-8'));
  assert.ok(hidden.includes('pointer-events-none'));

  const custom = getRevealClassName(true, 'my-custom-class');
  assert.ok(custom.includes('my-custom-class'));
});

test('DEFAULT_OBSERVER_CONFIG has sensible mobile & desktop thresholds', () => {
  assert.equal(DEFAULT_OBSERVER_CONFIG.root, null);
  assert.equal(DEFAULT_OBSERVER_CONFIG.threshold, 0.15);
  assert.equal(DEFAULT_OBSERVER_CONFIG.rootMargin, '0px 0px -40px 0px');
});
