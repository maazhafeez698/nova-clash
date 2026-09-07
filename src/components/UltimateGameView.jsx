import { useCallback, useEffect } from "react";
import UltimateBoard from "./UltimateBoard.jsx";
import StatusBar from "./StatusBar.jsx";
import WinGlow from "./WinGlow.jsx";
import { useUltimateGame } from "../hooks/useUltimateGame.js";

export default function UltimateGameView({
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

  const game = useUltimateGame({
    opponent,
    difficulty,
    humanSymbol,
    onMove: sound.playMove,
    onRoundEnd: handleRoundEnd,
  });
  const {
    current,
    overallWinner,
    isDraw,
    isOver,
    aiThinking,
    placeMark,
    reset,
    activeBoard,
  } = game;

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponent, difficulty, humanSymbol]);

  const hint = isDraw
    ? undefined
    : activeBoard === null
      ? "Free choice — play in any open board"
      : `Sent to board ${activeBoard + 1}`;

  return (
    <>
      <div className="relative flex-1 min-h-0 aspect-square max-w-full mx-auto overflow-hidden">
        <WinGlow symbol={overallWinner} />
        <UltimateBoard
          state={game}
          onCellClick={placeMark}
          disabled={isOver || aiThinking}
        />
      </div>
      <StatusBar
        current={current}
        winner={overallWinner}
        isDraw={isDraw}
        onRestart={() => {
          sound.playClick();
          reset();
        }}
        aiThinking={aiThinking}
        hint={hint}
      />
    </>
  );
}
