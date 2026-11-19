import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTimeElapsed } from './dateCounter.js';

test('calculateTimeElapsed computes exact years, months, and days', () => {
  // Exactly 2 years, 3 months, 10 days
  const start = '2022-01-15T00:00:00';
  const now = '2024-04-25T00:00:00';
  const elapsed = calculateTimeElapsed(start, now);

  assert.equal(elapsed.isValid, true);
  assert.equal(elapsed.isFuture, false);
  assert.equal(elapsed.years, 2);
  assert.equal(elapsed.months, 3);
  assert.equal(elapsed.days, 10);
  assert.ok(elapsed.totalDays > 800);
});

test('calculateTimeElapsed handles month day borrowing across months', () => {
  // Start Jan 28, Now March 5 (non-leap year 2023)
  const start = '2023-01-28T00:00:00';
  const now = '2023-03-05T00:00:00';
  const elapsed = calculateTimeElapsed(start, now);

  assert.equal(elapsed.isValid, true);
  assert.equal(elapsed.years, 0);
  assert.equal(elapsed.months, 1); // February elapsed
  assert.ok(elapsed.days >= 5);
});

test('calculateTimeElapsed handles future dates gracefully', () => {
  const future = '2030-01-01';
  const now = '2026-10-22';
  const elapsed = calculateTimeElapsed(future, now);

  assert.equal(elapsed.isValid, true);
  assert.equal(elapsed.isFuture, true);
  assert.equal(elapsed.years, 0);
  assert.equal(elapsed.totalDays, 0);
});

test('calculateTimeElapsed rejects invalid date strings', () => {
  const elapsed = calculateTimeElapsed('invalid-date', '2026-10-22');
  assert.equal(elapsed.isValid, false);
});
