import { useCallback, useEffect, useState } from "react";
import {
  applyUltimateMove,
  createUltimateState,
  isCellPlayable,
} from "../game/ultimateLogic.js";

/** @param {import('peerjs').DataConnection|null} connection @param {'X'|'O'} mySymbol @param {{ onMove?: (symbol: string) => void, onRoundEnd?: (result: { winner: string|null, isDraw: boolean }) => void }} callbacks */
export function useOnlineUltimateGame(
  connection,
  mySymbol,
  { onMove, onRoundEnd } = {},
) {
  const [state, setState] = useState(createUltimateState);
  const [lastMoveSymbol, setLastMoveSymbol] = useState(null);

  const isOver = state.overallWinner !== null || state.isDraw;
  const isMyTurn = !isOver && state.current === mySymbol;

  const reset = useCallback(
    (broadcast = true) => {
      setState(createUltimateState());
      setLastMoveSymbol(null);
      if (broadcast) connection?.send({ type: "restart" });
    },
    [connection],
  );

  const placeMark = useCallback(
    (boardIndex, cellIndex) => {
      if (!isMyTurn) return;
      if (!isCellPlayable(state, boardIndex, cellIndex)) return;

      const symbol = state.current;
      connection?.send({ type: "move", boardIndex, cellIndex });
      setLastMoveSymbol(symbol);
      setState(applyUltimateMove(state, boardIndex, cellIndex));
    },
    [state, isMyTurn, connection],
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
            return prev;
          setLastMoveSymbol(prev.current);
          return applyUltimateMove(prev, data.boardIndex, data.cellIndex);
        });
      } else if (data.type === "restart") {
        reset(false);
      }
    };

    connection.on("data", handleData);
    return () => {
      connection.off?.("data", handleData);
    };
  }, [connection, reset]);

  useEffect(() => {
    if (lastMoveSymbol) onMove?.(lastMoveSymbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.boards]);

  useEffect(() => {
    if (state.overallWinner)
      onRoundEnd?.({ winner: state.overallWinner, isDraw: false });
    else if (state.isDraw) onRoundEnd?.({ winner: null, isDraw: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.overallWinner, state.isDraw]);

  return { ...state, isOver, isMyTurn, placeMark, reset };
}
