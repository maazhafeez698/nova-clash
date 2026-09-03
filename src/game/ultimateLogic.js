import { WIN_LINES, calculateWinner, emptyBoard, isBoardFull, otherSymbol } from './gameLogic.js'

// Ultimate Tic Tac Toe: a 3x3 meta-grid where every cell is itself a full
// Classic board. Playing cell `c` inside a sub-board sends your opponent to
// play in sub-board `c` next — unless that board is already decided, in
// which case they may play in any open board.

export function createUltimateState() {
  return {
    boards: Array.from({ length: 9 }, () => emptyBoard()),
    boardWinners: Array(9).fill(null), // null | 'X' | 'O' | 'draw'
    activeBoard: null, // null = free choice among any open board
    current: 'X',
    overallWinner: null,
    overallWinLine: null,
    isDraw: false,
  }
}

/** Same win geometry as a Classic board, applied to the 9 sub-board results. */
export function calculateMetaWinner(boardWinners) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    const va = boardWinners[a]
    if (va && va !== 'draw' && va === boardWinners[b] && va === boardWinners[c]) {
      return { winner: va, line }
    }
  }
  return { winner: null, line: null }
}

export function getLegalBoards(boardWinners, activeBoard) {
  if (activeBoard !== null && boardWinners[activeBoard] === null) return [activeBoard]
  const open = []
  for (let i = 0; i < boardWinners.length; i++) {
    if (boardWinners[i] === null) open.push(i)
  }
  return open
}

export function isCellPlayable(state, boardIndex, cellIndex) {
  if (state.overallWinner || state.isDraw) return false
  if (state.boardWinners[boardIndex] !== null) return false
  if (state.boards[boardIndex][cellIndex] !== null) return false
  return getLegalBoards(state.boardWinners, state.activeBoard).includes(boardIndex)
}

/** Pure transition: apply a legal move and return a brand-new state object. */
export function applyUltimateMove(state, boardIndex, cellIndex) {
  const symbol = state.current

  const boards = state.boards.map((b, i) => (i === boardIndex ? b.slice() : b))
  boards[boardIndex][cellIndex] = symbol

  const boardWinners = state.boardWinners.slice()
  const subResult = calculateWinner(boards[boardIndex])
  if (subResult.winner) {
    boardWinners[boardIndex] = subResult.winner
  } else if (isBoardFull(boards[boardIndex])) {
    boardWinners[boardIndex] = 'draw'
  }

  const meta = calculateMetaWinner(boardWinners)
  const boardsAllClosed = boardWinners.every((w) => w !== null)
  const nextActiveBoard = boardWinners[cellIndex] === null ? cellIndex : null

  return {
    boards,
    boardWinners,
    activeBoard: meta.winner || boardsAllClosed ? null : nextActiveBoard,
    current: otherSymbol(symbol),
    overallWinner: meta.winner,
    overallWinLine: meta.line,
    isDraw: !meta.winner && boardsAllClosed,
  }
}
