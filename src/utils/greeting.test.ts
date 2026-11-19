import test from 'node:test';
import assert from 'node:assert/strict';
import { getTimeOfDay, getPersonalizedGreeting, getBirthdayGreeting } from './greeting.js';

test('getBirthdayGreeting returns birthday celebration text', () => {
  const result = getBirthdayGreeting('Saru');
  assert.equal(result.greeting, 'Happy Birthday, Saru 🎂');
  assert.ok(result.subtitleText.includes('birthday'));
  assert.ok(!result.greeting.toLowerCase().includes('good night'));
});

test('getTimeOfDay categorizes all hours accurately', () => {
  // Morning (5am - 11am)
  assert.equal(getTimeOfDay(5), 'morning');
  assert.equal(getTimeOfDay(8), 'morning');
  assert.equal(getTimeOfDay(11), 'morning');

  // Afternoon (12pm - 4pm)
  assert.equal(getTimeOfDay(12), 'afternoon');
  assert.equal(getTimeOfDay(14), 'afternoon');
  assert.equal(getTimeOfDay(16), 'afternoon');

  // Evening (5pm - 9pm)
  assert.equal(getTimeOfDay(17), 'evening');
  assert.equal(getTimeOfDay(19), 'evening');
  assert.equal(getTimeOfDay(21), 'evening');

  // Night (10pm - 4am)
  assert.equal(getTimeOfDay(22), 'night');
  assert.equal(getTimeOfDay(23), 'night');
  assert.equal(getTimeOfDay(0), 'night');
  assert.equal(getTimeOfDay(4), 'night');
});

test('getPersonalizedGreeting formats custom name and greeting correctly without good night', () => {
  const morningDate = new Date('2026-10-22T08:30:00');
  const morningResult = getPersonalizedGreeting('Saru', morningDate);
  assert.equal(morningResult.greeting, 'Good morning, Saru');
  assert.equal(morningResult.period, 'morning');

  const eveningDate = new Date('2026-10-22T19:45:00');
  const eveningResult = getPersonalizedGreeting('Saru', eveningDate);
  assert.equal(eveningResult.greeting, 'Good evening, Saru');
  assert.equal(eveningResult.period, 'evening');

  const nightDate = new Date('2026-10-22T23:15:00');
  const nightResult = getPersonalizedGreeting('Saru', nightDate);
  // Replaced 'Good night' with birthday celebration
  assert.equal(nightResult.greeting, 'Happy Birthday, Saru 🎂');
  assert.equal(nightResult.period, 'night');
  assert.ok(!nightResult.greeting.toLowerCase().includes('good night'));
});
