import { useCallback, useEffect, useState } from "react";
import {
  applyUltimateMove,
  createUltimateState,
  isCellPlayable,
} from "../game/ultimateLogic.js";

/**
 * @param {import('peerjs').DataConnection|null} connection
 * @param {'X'|'O'} mySymbol
 * @param {{ onMove?: (symbol: string) => void, onRoundEnd?: (result: { winner: string|null, isDraw: boolean }) => void }} callbacks
 */
export function useOnlineUltimateGame(
  connection,
  mySymbol,
  { onMove, onRoundEnd } = {},
) {
  const [state, setState] = useState(createUltimateState);

  const isOver = state.overallWinner !== null || state.isDraw;
  const isMyTurn = !isOver && state.current === mySymbol;

  const reset = useCallback(
    (broadcast = true) => {
      setState(createUltimateState());
      if (broadcast) connection?.send({ type: "restart" });
    },
    [connection],
  );

  const applyAndReport = useCallback(
    (prev, boardIndex, cellIndex, symbol) => {
      const next = applyUltimateMove(prev, boardIndex, cellIndex);
      onMove?.(symbol);
      if (next.overallWinner)
        onRoundEnd?.({ winner: next.overallWinner, isDraw: false });
      else if (next.isDraw) onRoundEnd?.({ winner: null, isDraw: true });
      return next;
    },
    [onMove, onRoundEnd],
  );

  const placeMark = useCallback(
    (boardIndex, cellIndex) => {
      if (!isMyTurn) return;
      setState((prev) => {
        if (!isCellPlayable(prev, boardIndex, cellIndex)) return prev;
        connection?.send({ type: "move", boardIndex, cellIndex });
        return applyAndReport(prev, boardIndex, cellIndex, mySymbol);
      });
    },
    [isMyTurn, connection, applyAndReport, mySymbol],
  );

  useEffect(() => {
    if (!connection) return undefined;

    const handleData = (data) => {
      if (!data || typeof data !== "object") return;

      if (
        data.type === "move" &&
        typeof data.boardIndex === "number" &&
        typeof data.cellIndex === "number"
      ) {
        setState((prev) => {
          if (!isCellPlayable(prev, data.boardIndex, data.cellIndex))
            return prev; // ignore illegal/duplicate moves
          const remoteSymbol = prev.current;
          return applyAndReport(
            prev,
            data.boardIndex,
            data.cellIndex,
            remoteSymbol,
          );
        });
      } else if (data.type === "restart") {
        reset(false);
      }
    };

    connection.on("data", handleData);
    return () => {
      connection.off?.("data", handleData);
    };
  }, [connection, applyAndReport, reset]);

  return { ...state, isOver, isMyTurn, placeMark, reset };
}
