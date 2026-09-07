import { useCallback, useState } from "react";
import Header from "./components/Header.jsx";
import ScorePanel from "./components/ScorePanel.jsx";
import ControlBar from "./components/ControlBar.jsx";
import ClassicGameView from "./components/ClassicGameView.jsx";
import UltimateGameView from "./components/UltimateGameView.jsx";
import OnlineGameView from "./components/OnlineGameView.jsx";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";
import { useSound } from "./hooks/useSound.js";

export default function App() {
  const [scores, setScores] = useLocalStorageState("nova-clash:scores", {
    X: 0,
    O: 0,
    draws: 0,
  });
  const [mode, setMode] = useState("classic"); // 'classic' | 'ultimate'
  const [opponent, setOpponent] = useState("pvp"); // 'pvp' | 'ai' | 'online'
  const [difficulty, setDifficulty] = useState("medium");
  const [humanSymbol, setHumanSymbol] = useState("X");

  const sound = useSound();

  const handleRoundEnd = useCallback(
    ({ winner, isDraw }) => {
      setScores((prev) => {
        if (isDraw) return { ...prev, draws: prev.draws + 1 };
        if (winner) return { ...prev, [winner]: prev[winner] + 1 };
        return prev;
      });
    },
    [setScores],
  );

  const withClick = useCallback(
    (setter) => (value) => {
      sound.playClick();
      setter(value);
    },
    [sound],
  );

  const xLabel =
    opponent === "ai" ? (humanSymbol === "X" ? "YOU" : "NOVA") : "PLAYER X";
  const oLabel =
    opponent === "ai" ? (humanSymbol === "O" ? "YOU" : "NOVA") : "PLAYER O";

  const GameView = mode === "ultimate" ? UltimateGameView : ClassicGameView;

  const resetScores = useCallback(() => {
    sound.playClick();
    setScores({ X: 0, O: 0, draws: 0 });
  }, [sound, setScores]);

  return (
    <div className="h-dvh overflow-hidden flex items-center justify-center px-3 py-3 sm:px-4 sm:py-4">
      <div className="w-full h-full max-w-[min(94vw,30rem)] mx-auto flex flex-col gap-2 sm:gap-3">
        <Header muted={sound.muted} onToggleMute={sound.toggleMute} />

        <ControlBar
          mode={mode}
          onModeChange={withClick(setMode)}
          opponent={opponent}
          onOpponentChange={withClick(setOpponent)}
          difficulty={difficulty}
          onDifficultyChange={withClick(setDifficulty)}
          humanSymbol={humanSymbol}
          onHumanSymbolChange={withClick(setHumanSymbol)}
        />

        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center gap-2 sm:gap-3">
          {opponent === "online" ? (
            <OnlineGameView
              mode={mode}
              onRoundEnd={handleRoundEnd}
              sound={sound}
            />
          ) : (
            <GameView
              opponent={opponent}
              difficulty={difficulty}
              humanSymbol={humanSymbol}
              onRoundEnd={handleRoundEnd}
              sound={sound}
            />
          )}
        </div>

        <ScorePanel
          scores={scores}
          xLabel={xLabel}
          oLabel={oLabel}
          onResetScores={resetScores}
        />
      </div>
    </div>
  );
}
