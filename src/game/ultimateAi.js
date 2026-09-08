import {
  calculateWinner,
  getAvailableMoves,
  otherSymbol,
} from "./gameLogic.js";
import { calculateMetaWinner, getLegalBoards } from "./ultimateLogic.js";

const CORNERS = new Set([0, 2, 6, 8]);

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function positionalBonus(index) {
  if (index === 4) return 3;
  if (CORNERS.has(index)) return 2;
  return 1;
}

function getLegalMoves(state) {
  const boards = getLegalBoards(state.boardWinners, state.activeBoard);
  const moves = [];
  for (const board of boards) {
    for (const cell of getAvailableMoves(state.boards[board])) {
      moves.push({ board, cell });
    }
  }
  return moves;
}

function canWinBoardNextTurn(cells, symbol) {
  return getAvailableMoves(cells).some((idx) => {
    const test = cells.slice();
    test[idx] = symbol;
    return calculateWinner(test).winner === symbol;
  });
}

function scoredMove(state, aiSymbol, { sendSafety }) {
  const humanSymbol = otherSymbol(aiSymbol);
  const moves = getLegalMoves(state);

  let bestScore = -Infinity;
  let bestMoves = [];

  for (const move of moves) {
    const subCells = state.boards[move.board];
    const nextSub = subCells.slice();
    nextSub[move.cell] = aiSymbol;
    const subResult = calculateWinner(nextSub);

    let score = positionalBonus(move.cell) + positionalBonus(move.board) * 1.2;

    if (subResult.winner === aiSymbol) {
      score += 60;
      const nextBoardWinners = state.boardWinners.slice();
      nextBoardWinners[move.board] = aiSymbol;
      if (calculateMetaWinner(nextBoardWinners).winner === aiSymbol)
        score += 1000;
    } else {
      const humanTest = subCells.slice();
      humanTest[move.cell] = humanSymbol;
      if (calculateWinner(humanTest).winner === humanSymbol) score += 45;
    }

    if (sendSafety) {
      const sendTarget = move.cell;
      const targetClosed = state.boardWinners[sendTarget] !== null;
      if (!targetClosed) {
        const targetCells =
          move.board === sendTarget ? nextSub : state.boards[sendTarget];
        if (canWinBoardNextTurn(targetCells, humanSymbol)) score -= 55;
      } else {
        score -= 8;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  return randomFrom(bestMoves);
}

/** @param {ReturnType<typeof import('./ultimateLogic.js').createUltimateState>} state @param {'X'|'O'} aiSymbol @param {'easy'|'medium'|'hard'} difficulty */
export function getUltimateAiMove(state, aiSymbol, difficulty) {
  if (difficulty === "easy") return randomFrom(getLegalMoves(state));
  if (difficulty === "medium")
    return scoredMove(state, aiSymbol, { sendSafety: false });
  return scoredMove(state, aiSymbol, { sendSafety: true });
}
