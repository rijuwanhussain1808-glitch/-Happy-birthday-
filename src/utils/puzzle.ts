/**
 * 3x3 Sliding Puzzle Logic
 * Decoupled, pure functions for state, solvability, valid moves, and victory detection.
 */

export const EMPTY_TILE = 0;
export const GRID_SIZE = 3;
export const TOTAL_TILES = GRID_SIZE * GRID_SIZE; // 9

// Standard solved board state: [1, 2, 3, 4, 5, 6, 7, 8, 0]
export const SOLVED_STATE: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 0];

/**
 * Checks if two board states are identical.
 */
export function areBoardsEqual(a: readonly number[], b: readonly number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Checks if the board is in the solved configuration.
 */
export function isPuzzleSolved(board: readonly number[]): boolean {
  return areBoardsEqual(board, SOLVED_STATE);
}

/**
 * Calculates row and column coordinates from a linear 0..8 index.
 */
export function getCoordinates(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
}

/**
 * Calculates linear index from row and column.
 */
export function getIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

/**
 * Checks if a tile at `tileIndex` can legally slide into `emptyIndex`.
 * A move is legal if and only if the Manhattan distance between the two cells is exactly 1.
 */
export function canTileMove(tileIndex: number, emptyIndex: number): boolean {
  if (tileIndex < 0 || tileIndex >= TOTAL_TILES) return false;
  if (emptyIndex < 0 || emptyIndex >= TOTAL_TILES) return false;
  if (tileIndex === emptyIndex) return false;

  const tile = getCoordinates(tileIndex);
  const empty = getCoordinates(emptyIndex);

  const rowDiff = Math.abs(tile.row - empty.row);
  const colDiff = Math.abs(tile.col - empty.col);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

/**
 * Finds all tile indices that can currently slide into the empty spot.
 */
export function getMovableTileIndices(board: readonly number[]): number[] {
  const emptyIndex = board.indexOf(EMPTY_TILE);
  if (emptyIndex === -1) return [];

  const { row, col } = getCoordinates(emptyIndex);
  const movable: number[] = [];

  const directions = [
    { r: row - 1, c: col }, // Up
    { r: row + 1, c: col }, // Down
    { r: row, c: col - 1 }, // Left
    { r: row, c: col + 1 }, // Right
  ];

  for (const { r, c } of directions) {
    if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      movable.push(getIndex(r, c));
    }
  }

  return movable;
}

/**
 * Attempts to move the tile at `tileIndex` into the empty spot.
 * Returns a new board array if the move was valid, or null if the move was invalid.
 */
export function moveTile(board: readonly number[], tileIndex: number): number[] | null {
  const emptyIndex = board.indexOf(EMPTY_TILE);
  if (!canTileMove(tileIndex, emptyIndex)) {
    return null;
  }

  const newBoard = [...board];
  newBoard[emptyIndex] = board[tileIndex];
  newBoard[tileIndex] = EMPTY_TILE;
  return newBoard;
}

/**
 * Counts the number of inversions in the board (ignoring the empty tile 0).
 * An inversion is when a tile with a greater number appears before a tile with a smaller number.
 */
export function countInversions(board: readonly number[]): number {
  let inversions = 0;
  const tilesWithoutEmpty = board.filter((n) => n !== EMPTY_TILE);

  for (let i = 0; i < tilesWithoutEmpty.length - 1; i++) {
    for (let j = i + 1; j < tilesWithoutEmpty.length; j++) {
      if (tilesWithoutEmpty[i] > tilesWithoutEmpty[j]) {
        inversions++;
      }
    }
  }

  return inversions;
}

/**
 * In a 3x3 sliding puzzle (odd grid width), a board is solvable
 * if and only if the number of inversions is even.
 */
export function isSolvable(board: readonly number[]): boolean {
  return countInversions(board) % 2 === 0;
}

/**
 * Generates a guaranteed solvable shuffled board.
 * Takes a minimum number of random valid moves from the solved state (or parity adjustment)
 * to ensure both 100% solvability and that it is not already in the solved state.
 */
export function generateSolvableBoard(seedMoves: number = 40): number[] {
  let currentBoard = [...SOLVED_STATE];

  // Perform random walks of legal moves to guarantee solvability and reachability
  let lastMovedTile = -1;
  for (let i = 0; i < seedMoves; i++) {
    const movable = getMovableTileIndices(currentBoard);
    // Don't immediately undo the previous move if other options exist
    const candidates =
      movable.length > 1 ? movable.filter((idx) => currentBoard[idx] !== lastMovedTile) : movable;

    const chosenIndex = candidates[Math.floor(Math.random() * candidates.length)] ?? movable[0];
    lastMovedTile = currentBoard[chosenIndex];
    const nextBoard = moveTile(currentBoard, chosenIndex);
    if (nextBoard) {
      currentBoard = nextBoard;
    }
  }

  // If by rare chance it ended up solved, make one more legal move
  if (isPuzzleSolved(currentBoard)) {
    const movable = getMovableTileIndices(currentBoard);
    const fallback = moveTile(currentBoard, movable[0]);
    if (fallback) currentBoard = fallback;
  }

  return currentBoard;
}
