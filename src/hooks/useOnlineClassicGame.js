import { useCallback, useEffect, useState } from "react";
import {
  calculateWinner,
  emptyBoard,
  isBoardFull,
  otherSymbol,
} from "../game/gameLogic.js";

/**
 * Mirrors useClassicGame's shape, but the "other side" is a remote human
 * connected via `connection` instead of the built-in AI.
 *
 * Both the local (click-driven) move and the incoming-message move only ever
 * set state — neither calls onMove/onRoundEnd directly. Those callbacks fire
 * exclusively from the two watcher effects below, which react to *committed*
 * state (board / winner / isDraw). That's deliberate: the incoming-message
 * handler has to use a functional setBoard(prev => ...) updater (it's
 * registered once per connection and must always see the latest board, not a
 * stale closure), and React's dev-mode Strict Mode invokes functional
 * updaters twice to check purity. Routing every side effect through state
 * changes instead of firing them inline means each one can only ever fire
 * once per real transition — regardless of whether the move was local or
 * remote, and regardless of how many times an updater itself re-ran.
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
  const [lastMoveSymbol, setLastMoveSymbol] = useState(null);

  const isOver = winner !== null || isDraw;
  const isMyTurn = !isOver && current === mySymbol;

  const reset = useCallback(
    (broadcast = true) => {
      setBoard(emptyBoard());
      setCurrent("X");
      setWinner(null);
      setWinLine(null);
      setIsDraw(false);
      setLastMoveSymbol(null);
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
      setLastMoveSymbol(mySymbol); // onMove/onRoundEnd fire from the watcher effects below, not here —
      connection?.send({ type: "move", index }); // that's what keeps local and remote moves on one single path

      const result = calculateWinner(nextBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinLine(result.line);
      } else if (isBoardFull(nextBoard)) {
        setIsDraw(true);
      } else {
        setCurrent(otherSymbol(mySymbol));
      }
    },
    [board, isMyTurn, mySymbol, connection],
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
          setLastMoveSymbol(remoteSymbol); // pure setState call — side effects live in the effects below

          const result = calculateWinner(nextBoard);
          if (result.winner) {
            setWinner(result.winner);
            setWinLine(result.line);
          } else if (isBoardFull(nextBoard)) {
            setIsDraw(true);
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
  }, [connection, mySymbol, reset]);

  // Fires exactly once per real move (local or remote), regardless of how
  // many times React invoked the setBoard updater above.
  useEffect(() => {
    if (lastMoveSymbol) onMove?.(lastMoveSymbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  // Fires exactly once per real win/draw (local or remote).
  useEffect(() => {
    if (winner) onRoundEnd?.({ winner, isDraw: false });
    else if (isDraw) onRoundEnd?.({ winner: null, isDraw: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, isDraw]);

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
