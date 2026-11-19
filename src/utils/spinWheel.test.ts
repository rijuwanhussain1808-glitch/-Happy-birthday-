import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  WHEEL_ITEMS,
  BRACELET_INDEX,
  calculateNextRotation,
  calculateTargetRotation,
  getSliceFromRotation,
  calculateSpinProgress,
  countPegsCrossed,
} from './spinWheel';

test('WHEEL_ITEMS contains exact 4 user products with Bracelet at BRACELET_INDEX', () => {
  assert.equal(WHEEL_ITEMS.length, 4);

  const productNames = WHEEL_ITEMS.map((item) => item.name);
  assert.deepEqual(productNames, [
    'Watch',
    'Photo Frame',
    'Personal Alphabet Keychain',
    'Bracelet',
  ]);

  assert.equal(WHEEL_ITEMS[BRACELET_INDEX].name, 'Bracelet');
});

test('calculateTargetRotation always stops on Bracelet across different spin counts and jitters', () => {
  const fullSpinsList = [3, 5, 6, 8, 10];
  const jitters = [-25, -15, -5, 0, 5, 15, 25];

  for (const spins of fullSpinsList) {
    for (const jitter of jitters) {
      const rotation = calculateTargetRotation(BRACELET_INDEX, 4, spins, jitter);
      const landedSlice = getSliceFromRotation(rotation, 4);

      assert.equal(
        landedSlice,
        BRACELET_INDEX,
        `Rotation ${rotation} with ${spins} spins and ${jitter}° jitter must land on Bracelet (index 3)`
      );
    }
  }
});

test('getSliceFromRotation accurately detects all 4 slices', () => {
  // Slice 0 (Watch): center at 45° -> rotation to align is 360 - 45 = 315°
  const rot0 = calculateTargetRotation(0, 4, 2, 0);
  assert.equal(getSliceFromRotation(rot0, 4), 0);

  // Slice 1 (Photo Frame): center at 135° -> rotation is 225°
  const rot1 = calculateTargetRotation(1, 4, 2, 0);
  assert.equal(getSliceFromRotation(rot1, 4), 1);

  // Slice 2 (Keychain): center at 225° -> rotation is 135°
  const rot2 = calculateTargetRotation(2, 4, 2, 0);
  assert.equal(getSliceFromRotation(rot2, 4), 2);

  // Slice 3 (Bracelet): center at 315° -> rotation is 45°
  const rot3 = calculateTargetRotation(3, 4, 2, 0);
  assert.equal(getSliceFromRotation(rot3, 4), 3);
});

test('calculateTargetRotation clamps excessive jitter safely inside slice', () => {
  // Extreme jitter of 100° should be clamped so it does not slip into neighboring slice
  const rotationExcessivePositive = calculateTargetRotation(BRACELET_INDEX, 4, 5, 100);
  assert.equal(getSliceFromRotation(rotationExcessivePositive, 4), BRACELET_INDEX);

  const rotationExcessiveNegative = calculateTargetRotation(BRACELET_INDEX, 4, 5, -100);
  assert.equal(getSliceFromRotation(rotationExcessiveNegative, 4), BRACELET_INDEX);
});

test('calculateSpinProgress returns smooth ease-out values from 0 to 1', () => {
  assert.equal(calculateSpinProgress(0), 0);
  assert.equal(calculateSpinProgress(1), 1);

  // Midpoint should be significantly more than 50% due to rapid initial spin
  const mid = calculateSpinProgress(0.5);
  assert.ok(mid > 0.85, `Expected mid progress > 0.85, got ${mid}`);

  // Monotonically increasing
  let prev = 0;
  for (let t = 0.05; t <= 1; t += 0.05) {
    const val = calculateSpinProgress(t);
    assert.ok(val >= prev, `Progress at ${t} (${val}) must be >= previous (${prev})`);
    prev = val;
  }
});

test('countPegsCrossed tracks perimeter peg boundary hits accurately', () => {
  // PEG_ANGLE is 22.5° (16 pegs)
  assert.equal(countPegsCrossed(0, 10), 0);
  assert.equal(countPegsCrossed(0, 23), 1);
  assert.equal(countPegsCrossed(0, 46), 2);
  assert.equal(countPegsCrossed(0, 360), 16);
  assert.equal(countPegsCrossed(100, 100), 0);
  assert.equal(countPegsCrossed(100, 90), 0);
});

test('calculateNextRotation guarantees landing on Bracelet across consecutive spins', () => {
  let currentRotation = 0;

  // Run 50 consecutive spins in a row, accumulating rotation forward each time
  for (let spin = 1; spin <= 50; spin++) {
    const fullSpins = 5 + (spin % 4);
    // Variable jitter between -10° and +10°
    const jitter = ((spin * 7) % 21) - 10;

    const delta = calculateNextRotation(currentRotation, BRACELET_INDEX, 4, fullSpins, jitter);
    assert.ok(delta >= fullSpins * 360, `Delta degrees (${delta}) must be at least ${fullSpins * 360}`);

    currentRotation += delta;
    const landedSlice = getSliceFromRotation(currentRotation, 4);

    assert.equal(
      landedSlice,
      BRACELET_INDEX,
      `Spin #${spin} (accumulated angle ${currentRotation}°) MUST land on Bracelet (index 3)`
    );
  }
});


