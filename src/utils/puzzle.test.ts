import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SOLVED_STATE,
  EMPTY_TILE,
  isPuzzleSolved,
  canTileMove,
  moveTile,
  countInversions,
  isSolvable,
  generateSolvableBoard,
  getMovableTileIndices,
} from './puzzle.js';

test('isPuzzleSolved detects solved and unsolved states', () => {
  assert.equal(isPuzzleSolved([1, 2, 3, 4, 5, 6, 7, 8, 0]), true);
  assert.equal(isPuzzleSolved([1, 2, 3, 4, 5, 6, 7, 0, 8]), false);
  assert.equal(isPuzzleSolved([8, 7, 6, 5, 4, 3, 2, 1, 0]), false);
});

test('canTileMove enforces adjacent 4-directional moves only', () => {
  // Empty tile at index 8 (bottom-right: row 2, col 2)
  // Neighbors are index 7 (row 2, col 1) and index 5 (row 1, col 2)
  assert.equal(canTileMove(7, 8), true);
  assert.equal(canTileMove(5, 8), true);

  // Diagonal or non-adjacent moves are disallowed
  assert.equal(canTileMove(4, 8), false); // center (row 1, col 1) is diagonal!
  assert.equal(canTileMove(0, 8), false); // top-left
  assert.equal(canTileMove(8, 8), false); // same tile
});

test('moveTile swaps tile with empty position and returns new board', () => {
  const initial = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  const moved = moveTile(initial, 7); // slide tile 8 (at index 7) to index 8
  assert.notEqual(moved, null);
  assert.deepEqual(moved, [1, 2, 3, 4, 5, 6, 7, 0, 8]);

  // Attempting invalid move returns null
  const invalidMove = moveTile(initial, 0);
  assert.equal(invalidMove, null);
});

test('solvability and inversion counting', () => {
  // Solved state has 0 inversions and is solvable
  assert.equal(countInversions(SOLVED_STATE), 0);
  assert.equal(isSolvable(SOLVED_STATE), true);

  // Swapping two tiles introduces 1 inversion (odd = unsolvable in 15/8-puzzle)
  const unsolvableBoard = [2, 1, 3, 4, 5, 6, 7, 8, 0];
  assert.equal(countInversions(unsolvableBoard), 1);
  assert.equal(isSolvable(unsolvableBoard), false);
});

test('generateSolvableBoard always produces a solvable, valid board', () => {
  for (let i = 0; i < 5; i++) {
    const board = generateSolvableBoard(30);
    assert.equal(board.length, 9);
    assert.equal(board.includes(EMPTY_TILE), true);
    assert.equal(isSolvable(board), true, 'Board must be solvable');

    // Movable tiles should be between 2 and 4
    const movable = getMovableTileIndices(board);
    assert.ok(movable.length >= 2 && movable.length <= 4);
  }
});
