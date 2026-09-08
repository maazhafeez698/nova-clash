import {
  calculateWinner,
  getAvailableMoves,
  isBoardFull,
  otherSymbol,
} from "./gameLogic.js";

const CENTER = 4;
const CORNERS = [0, 2, 6, 8];
const EDGES = [1, 3, 5, 7];

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function findWinningMove(cells, symbol) {
  for (const move of getAvailableMoves(cells)) {
    const next = cells.slice();
    next[move] = symbol;
    if (calculateWinner(next).winner === symbol) return move;
  }
  return null;
}

function getEasyMove(cells) {
  return randomFrom(getAvailableMoves(cells));
}

function getMediumMove(cells, aiSymbol) {
  const humanSymbol = otherSymbol(aiSymbol);

  const winningMove = findWinningMove(cells, aiSymbol);
  if (winningMove !== null) return winningMove;

  const blockingMove = findWinningMove(cells, humanSymbol);
  if (blockingMove !== null) return blockingMove;

  if (cells[CENTER] === null) return CENTER;

  const openCorners = CORNERS.filter((i) => cells[i] === null);
  if (openCorners.length) return randomFrom(openCorners);

  const openEdges = EDGES.filter((i) => cells[i] === null);
  return randomFrom(openEdges);
}

function scoreForWinner(winner, aiSymbol, depth) {
  if (winner === aiSymbol) return 10 - depth;
  if (winner === otherSymbol(aiSymbol)) return depth - 10;
  return 0;
}

function minimax(cells, symbolToMove, aiSymbol, depth, alpha, beta) {
  const { winner } = calculateWinner(cells);
  if (winner) return scoreForWinner(winner, aiSymbol, depth);
  if (isBoardFull(cells)) return 0;

  const maximizing = symbolToMove === aiSymbol;
  let best = maximizing ? -Infinity : Infinity;

  for (const move of getAvailableMoves(cells)) {
    const next = cells.slice();
    next[move] = symbolToMove;
    const score = minimax(
      next,
      otherSymbol(symbolToMove),
      aiSymbol,
      depth + 1,
      alpha,
      beta,
    );

    if (maximizing) {
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }

  return best;
}

function getHardMove(cells, aiSymbol) {
  let bestScore = -Infinity;
  let bestMoves = [];

  for (const move of getAvailableMoves(cells)) {
    const next = cells.slice();
    next[move] = aiSymbol;
    const score = minimax(
      next,
      otherSymbol(aiSymbol),
      aiSymbol,
      1,
      -Infinity,
      Infinity,
    );

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  return randomFrom(bestMoves);
}

/** @param {(string|null)[]} cells @param {'X'|'O'} aiSymbol @param {'easy'|'medium'|'hard'} difficulty */
export function getAiMove(cells, aiSymbol, difficulty) {
  if (difficulty === "hard") return getHardMove(cells, aiSymbol);
  if (difficulty === "medium") return getMediumMove(cells, aiSymbol);
  return getEasyMove(cells);
}
