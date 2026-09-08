export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/** @param {(string|null)[]} cells @returns {{ winner: string|null, line: number[]|null }} */
export function calculateWinner(cells) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line };
    }
  }
  return { winner: null, line: null };
}

export function isBoardFull(cells) {
  return cells.every((cell) => cell !== null);
}

export function getAvailableMoves(cells) {
  const moves = [];
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === null) moves.push(i);
  }
  return moves;
}

export function otherSymbol(symbol) {
  return symbol === "X" ? "O" : "X";
}

export function emptyBoard() {
  return Array(9).fill(null);
}
