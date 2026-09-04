import { useCallback, useEffect, useState } from "react";
import {
  calculateWinner,
  emptyBoard,
  isBoardFull,
  otherSymbol,
} from "../game/gameLogic.js";

/**
 * Mirrors useClassicGame's shape, but the "other side" is a remote human
 * connected via `connection` instead of the built-in AI. Both peers run this
 * same reducer locally and stay in sync purely by exchanging move indices —
 * neither side trusts the other blindly, every incoming move is re-validated
 * against local state before it's applied.
 *
 * @param {import('peerjs').DataConnection|null} connection
 * @param {'X'|'O'} mySymbol
 * @param {{ onMove?: (symbol: string) => void, onRoundEnd?: (result: { winner: string|null, isDraw: boolean }) => void }} callbacks
 */
export function useOnlineClassicGame(
  connection,
  mySymbol,
  { onMove, onRoundEnd } = {},
) {
  const [board, setBoard] = useState(emptyBoard);
  const [current, setCurrent] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const isOver = winner !== null || isDraw;
  const isMyTurn = !isOver && current === mySymbol;

  const reset = useCallback(
    (broadcast = true) => {
      setBoard(emptyBoard());
      setCurrent("X");
      setWinner(null);
      setWinLine(null);
      setIsDraw(false);
      if (broadcast) connection?.send({ type: "restart" });
    },
    [connection],
  );

  const placeMark = useCallback(
    (index) => {
      if (!isMyTurn || board[index] !== null) return;

      const nextBoard = board.slice();
      nextBoard[index] = mySymbol;
      setBoard(nextBoard);
      onMove?.(mySymbol);
      connection?.send({ type: "move", index });

      const result = calculateWinner(nextBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinLine(result.line);
        onRoundEnd?.({ winner: result.winner, isDraw: false });
      } else if (isBoardFull(nextBoard)) {
        setIsDraw(true);
        onRoundEnd?.({ winner: null, isDraw: true });
      } else {
        setCurrent(otherSymbol(mySymbol));
      }
    },
    [board, isMyTurn, mySymbol, connection, onMove, onRoundEnd],
  );

  useEffect(() => {
    if (!connection) return undefined;

    const handleData = (data) => {
      if (!data || typeof data !== "object") return;

      if (data.type === "move" && typeof data.index === "number") {
        setBoard((prevBoard) => {
          if (prevBoard[data.index] !== null) return prevBoard; // ignore malformed/duplicate moves

          const remoteSymbol = otherSymbol(mySymbol);
          const nextBoard = prevBoard.slice();
          nextBoard[data.index] = remoteSymbol;
          onMove?.(remoteSymbol);

          const result = calculateWinner(nextBoard);
          if (result.winner) {
            setWinner(result.winner);
            setWinLine(result.line);
            onRoundEnd?.({ winner: result.winner, isDraw: false });
          } else if (isBoardFull(nextBoard)) {
            setIsDraw(true);
            onRoundEnd?.({ winner: null, isDraw: true });
          } else {
            setCurrent(mySymbol);
          }
          return nextBoard;
        });
      } else if (data.type === "restart") {
        reset(false); // opponent restarted — mirror it, don't bounce the message back
      }
    };

    connection.on("data", handleData);
    return () => {
      connection.off?.("data", handleData);
    };
  }, [connection, mySymbol, onMove, onRoundEnd, reset]);

  return {
    board,
    current,
    winner,
    winLine,
    isDraw,
    isOver,
    isMyTurn,
    placeMark,
    reset,
  };
}
