import { useCallback, useEffect } from "react";
import Board from "./Board.jsx";
import StatusBar from "./StatusBar.jsx";
import { useClassicGame } from "../hooks/useClassicGame.js";

export default function ClassicGameView({
  opponent,
  difficulty,
  humanSymbol,
  onRoundEnd,
  sound,
}) {
  const handleRoundEnd = useCallback(
    (result) => {
      if (result.winner) sound.playWin();
      else sound.playDraw();
      onRoundEnd(result);
    },
    [sound, onRoundEnd],
  );

  const {
    board,
    current,
    winner,
    winLine,
    isDraw,
    isOver,
    aiThinking,
    placeMark,
    reset,
  } = useClassicGame({
    opponent,
    difficulty,
    humanSymbol,
    onMove: sound.playMove,
    onRoundEnd: handleRoundEnd,
  });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponent, difficulty, humanSymbol]);

  const perspective = opponent === "ai" ? humanSymbol : undefined;

  return (
    <>
      <div className="relative flex-1 min-h-0 aspect-square max-w-full mx-auto overflow-hidden">
        <Board
          board={board}
          winLine={winLine}
          onCellClick={placeMark}
          disabled={isOver || aiThinking}
          currentPlayer={current}
        />
      </div>
      <StatusBar
        current={current}
        winner={winner}
        isDraw={isDraw}
        onRestart={() => {
          sound.playClick();
          reset();
        }}
        aiThinking={aiThinking}
        perspective={perspective}
        opponentLabel="Nova"
      />
    </>
  );
}
