import { useCallback, useEffect, useState } from "react";
import { otherSymbol } from "../game/gameLogic.js";
import {
  applyUltimateMove,
  createUltimateState,
  isCellPlayable,
} from "../game/ultimateLogic.js";
import { getUltimateAiMove } from "../game/ultimateAi.js";

const AI_THINK_DELAY_MS = 550;

/**
 * @param {{
 *   opponent: 'pvp'|'ai', difficulty: 'easy'|'medium'|'hard', humanSymbol: 'X'|'O',
 *   onMove?: (symbol: string) => void,
 *   onRoundEnd?: (result: { winner: string|null, isDraw: boolean }) => void,
 * }} options
 */
export function useUltimateGame({
  opponent,
  difficulty,
  humanSymbol,
  onMove,
  onRoundEnd,
}) {
  const aiSymbol = otherSymbol(humanSymbol);

  const [state, setState] = useState(createUltimateState);
  const [aiThinking, setAiThinking] = useState(false);

  const isOver = state.overallWinner !== null || state.isDraw;
  const isAiTurn = opponent === "ai" && state.current === aiSymbol && !isOver;

  // Local (human-click) move: reads `state` straight from the render closure
  // and commits a plain next-state value — no functional setState(prev => ...)
  // updater, so onMove/onRoundEnd here can never be double-invoked by React's
  // dev-mode Strict Mode purity check.
  const placeMark = useCallback(
    (boardIndex, cellIndex) => {
      if (opponent === "ai" && state.current !== humanSymbol) return;
      if (!isCellPlayable(state, boardIndex, cellIndex)) return;

      const symbol = state.current;
      const next = applyUltimateMove(state, boardIndex, cellIndex);
      setState(next);
      onMove?.(symbol);

      if (next.overallWinner)
        onRoundEnd?.({ winner: next.overallWinner, isDraw: false });
      else if (next.isDraw) onRoundEnd?.({ winner: null, isDraw: true });
    },
    [state, opponent, humanSymbol, onMove, onRoundEnd],
  );

  // AI turn: same reasoning as useClassicGame's AI effect — reads `state`
  // directly rather than via a functional updater, since the closure is
  // guaranteed fresh whenever isAiTurn just became true.
  useEffect(() => {
    if (!isAiTurn) return;

    setAiThinking(true);
    const timer = setTimeout(() => {
      const move = getUltimateAiMove(state, aiSymbol, difficulty);
      if (!move) {
        setAiThinking(false);
        return;
      }

      const next = applyUltimateMove(state, move.board, move.cell);
      setState(next);
      onMove?.(aiSymbol);

      if (next.overallWinner)
        onRoundEnd?.({ winner: next.overallWinner, isDraw: false });
      else if (next.isDraw) onRoundEnd?.({ winner: null, isDraw: true });

      setAiThinking(false);
    }, AI_THINK_DELAY_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiTurn, aiSymbol, difficulty]);

  const reset = useCallback(() => {
    setState(createUltimateState());
    setAiThinking(false);
  }, []);

  return { ...state, isOver, aiThinking, placeMark, reset, aiSymbol };
}
