import { useCallback, useEffect, useState } from "react";
import {
  calculateWinner,
  emptyBoard,
  isBoardFull,
  otherSymbol,
} from "../game/gameLogic.js";
import { getAiMove } from "../game/ai.js";

const AI_THINK_DELAY_MS = 450;

/**
 * Local state machine for a single Classic (3x3) match. Supports local PvP or a
 * built-in AI opponent (easy / medium / hard) that plays the symbol the human
 * did not choose.
 *
 * @param {{
 *   opponent: 'pvp'|'ai', difficulty: 'easy'|'medium'|'hard', humanSymbol: 'X'|'O',
 *   onMove?: (symbol: string) => void,
 *   onRoundEnd?: (result: { winner: string|null, isDraw: boolean }) => void,
 * }} options
 */
export function useClassicGame({
  opponent,
  difficulty,
  humanSymbol,
  onMove,
  onRoundEnd,
}) {
  const aiSymbol = otherSymbol(humanSymbol);

  const [board, setBoard] = useState(emptyBoard);
  const [current, setCurrent] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);

  const isOver = winner !== null || isDraw;
  const isAiTurn = opponent === "ai" && current === aiSymbol && !isOver;

  const placeMark = useCallback(
    (index) => {
      if (isOver || board[index] !== null) return;
      if (opponent === "ai" && current !== humanSymbol) return; // ignore clicks during AI turn

      const nextBoard = board.slice();
      nextBoard[index] = current;
      setBoard(nextBoard);
      onMove?.(current);

      const result = calculateWinner(nextBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinLine(result.line);
        onRoundEnd?.({ winner: result.winner, isDraw: false });
        return;
      }
      if (isBoardFull(nextBoard)) {
        setIsDraw(true);
        onRoundEnd?.({ winner: null, isDraw: true });
        return;
      }
      setCurrent((prev) => otherSymbol(prev));
    },
    [board, current, isOver, opponent, humanSymbol, onMove, onRoundEnd],
  );

  // AI turn: "think" briefly, then play. Reads `board` straight from the
  // render closure rather than a functional setBoard(prev => ...) updater —
  // safe here because this effect only (re-)runs when isAiTurn flips true,
  // which happens on the exact render where `board` was last updated, so the
  // closure is guaranteed fresh. This also avoids React's dev-mode
  // double-invocation of functional updaters, which would otherwise call
  // onMove/onRoundEnd twice for a single real move.
  useEffect(() => {
    if (!isAiTurn) return;

    setAiThinking(true);
    const timer = setTimeout(() => {
      const move = getAiMove(board, aiSymbol, difficulty);
      if (move === undefined || move === null) {
        setAiThinking(false);
        return;
      }

      const nextBoard = board.slice();
      nextBoard[move] = aiSymbol;
      setBoard(nextBoard);
      onMove?.(aiSymbol);

      const result = calculateWinner(nextBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinLine(result.line);
        onRoundEnd?.({ winner: result.winner, isDraw: false });
      } else if (isBoardFull(nextBoard)) {
        setIsDraw(true);
        onRoundEnd?.({ winner: null, isDraw: true });
      } else {
        setCurrent(humanSymbol);
      }
      setAiThinking(false);
    }, AI_THINK_DELAY_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiTurn, aiSymbol, difficulty, humanSymbol]);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setCurrent("X"); // X always opens the round, per classic rules
    setWinner(null);
    setWinLine(null);
    setIsDraw(false);
    setAiThinking(false);
  }, []);

  return {
    board,
    current,
    winner,
    winLine,
    isDraw,
    isOver,
    aiThinking,
    placeMark,
    reset,
    aiSymbol,
  };
}
