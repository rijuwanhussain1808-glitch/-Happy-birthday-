import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateHeartTrail,
  generateHeartExplosion,
  cleanupExpiredHearts,
  capActiveHearts,
  shouldSpawnCursorHeart,
  createCursorHeart,
  ROMANTIC_PALETTE,
} from './heartTrail';

test('generateHeartTrail creates requested number of sequential hearts', () => {
  const count = 7;
  const particles = generateHeartTrail(200, 300, { count }, 1000);

  assert.equal(particles.length, count);
  // Unique IDs
  const ids = new Set(particles.map((p) => p.id));
  assert.equal(ids.size, count);
});

test('generateHeartTrail staggers entrance delays sequentially', () => {
  const stepDelayMs = 60;
  const particles = generateHeartTrail(150, 250, { count: 5, stepDelayMs }, 1000);

  for (let i = 0; i < particles.length; i++) {
    assert.equal(particles[i].delayMs, i * stepDelayMs);
  }
});

test('generateHeartTrail assigns colors from the romantic palette', () => {
  const particles = generateHeartTrail(100, 100, { count: 6 }, 1000);

  for (const p of particles) {
    assert.ok(ROMANTIC_PALETTE.includes(p.color), `Color ${p.color} must be in palette`);
    assert.ok(p.size >= 14 && p.size <= 32, `Size ${p.size} must be within reasonable bounds`);
    assert.ok(p.durationMs > 0);
  }
});

test('cleanupExpiredHearts purges only particles that have finished animation', () => {
  const timestamp = 1000;
  const particles = generateHeartTrail(100, 100, { count: 3, stepDelayMs: 100, durationMs: 1000 }, timestamp);
  // Particle 0: delay 0, duration 1000, buffer 300 -> expires at 2300
  // Particle 1: delay 100, duration 1000, buffer 300 -> expires at 2400
  // Particle 2: delay 200, duration 1000, buffer 300 -> expires at 2500

  // At t=2000: all should still be active
  const activeAt2000 = cleanupExpiredHearts(particles, 2000);
  assert.equal(activeAt2000.length, 3);

  // At t=2350: particle 0 is expired, 1 and 2 are active
  const activeAt2350 = cleanupExpiredHearts(particles, 2350);
  assert.equal(activeAt2350.length, 2);

  // At t=3000: all should be cleaned up
  const activeAt3000 = cleanupExpiredHearts(particles, 3000);
  assert.equal(activeAt3000.length, 0);
});

test('capActiveHearts maintains safe limit during rapid bursts', () => {
  const particles = generateHeartTrail(100, 100, { count: 20 }, 1000);
  const moreParticles = generateHeartTrail(100, 100, { count: 20 }, 1001);
  const combined = [...particles, ...moreParticles];

  assert.equal(combined.length, 40);

  const capped = capActiveHearts(combined, 15);
  assert.equal(capped.length, 15);
  // Retains the most recent particles
  assert.equal(capped[14].id, combined[39].id);
});

test('shouldSpawnCursorHeart throttles by time and distance', () => {
  // Same position and recent time -> false
  assert.equal(shouldSpawnCursorHeart(100, 100, 100, 100, 0, 10, 20, 50), false);

  // Moved far enough (distance > 20) but not enough time (< 50ms) -> false
  assert.equal(shouldSpawnCursorHeart(150, 100, 100, 100, 0, 30, 20, 50), false);

  // Enough time elapsed (>= 50ms) but hardly moved (distance < 20) -> false
  assert.equal(shouldSpawnCursorHeart(105, 105, 100, 100, 0, 60, 20, 50), false);

  // Both time (>= 50ms) and distance (>= 20px) met -> true
  assert.equal(shouldSpawnCursorHeart(130, 100, 100, 100, 0, 60, 20, 50), true);
});

test('createCursorHeart creates a lightweight delicate heart particle', () => {
  const heart = createCursorHeart(250, 400, 5000);
  assert.equal(heart.x, 250);
  assert.equal(heart.y, 400);
  assert.ok(heart.size >= 11 && heart.size <= 16);
  assert.ok(ROMANTIC_PALETTE.includes(heart.color));
  assert.equal(heart.delayMs, 0);
  assert.equal(heart.durationMs, 950);
  assert.equal(heart.createdAt, 5000);
});

test('generateHeartExplosion creates a 360-degree circular burst of hearts', () => {
  const count = 12;
  const originX = 350;
  const originY = 450;
  const burst = generateHeartExplosion(originX, originY, { count, radius: 80 }, 6000);

  assert.equal(burst.length, count);

  // All particles spawn at click origin
  for (const p of burst) {
    assert.equal(p.x, originX);
    assert.equal(p.y, originY);
    assert.equal(p.delayMs, 0);
    assert.ok(ROMANTIC_PALETTE.includes(p.color));
    assert.ok(p.size >= 13 && p.size <= 22);
  }

  // Check 360-degree radial distribution across all 4 quadrants
  const hasPositiveX = burst.some((p) => p.driftX > 15);
  const hasNegativeX = burst.some((p) => p.driftX < -15);
  const hasPositiveY = burst.some((p) => p.driftY > 0);
  const hasNegativeY = burst.some((p) => p.driftY < -30);

  assert.ok(hasPositiveX, 'Explosion should have particles moving right');
  assert.ok(hasNegativeX, 'Explosion should have particles moving left');
  assert.ok(hasPositiveY, 'Explosion should have particles moving downward');
  assert.ok(hasNegativeY, 'Explosion should have particles moving upward');
});
