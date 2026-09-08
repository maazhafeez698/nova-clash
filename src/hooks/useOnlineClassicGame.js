import { useCallback, useEffect, useState } from "react";
import {
  calculateWinner,
  emptyBoard,
  isBoardFull,
  otherSymbol,
} from "../game/gameLogic.js";

/** @param {import('peerjs').DataConnection|null} connection @param {'X'|'O'} mySymbol @param {{ onMove?: (symbol: string) => void, onRoundEnd?: (result: { winner: string|null, isDraw: boolean }) => void }} callbacks */
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
      setLastMoveSymbol(mySymbol);
      connection?.send({ type: "move", index });

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
          if (prevBoard[data.index] !== null) return prevBoard;

          const remoteSymbol = otherSymbol(mySymbol);
          const nextBoard = prevBoard.slice();
          nextBoard[data.index] = remoteSymbol;
          setLastMoveSymbol(remoteSymbol);

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
        reset(false);
      }
    };

    connection.on("data", handleData);
    return () => {
      connection.off?.("data", handleData);
    };
  }, [connection, mySymbol, reset]);

  useEffect(() => {
    if (lastMoveSymbol) onMove?.(lastMoveSymbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

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
