import { useCallback, useState } from 'react'
import Header from './components/Header.jsx'
import ScorePanel from './components/ScorePanel.jsx'
import ControlBar from './components/ControlBar.jsx'
import ClassicGameView from './components/ClassicGameView.jsx'
import UltimateGameView from './components/UltimateGameView.jsx'

export default function App() {
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })
  const [mode, setMode] = useState('classic') // 'classic' | 'ultimate'
  const [opponent, setOpponent] = useState('pvp') // 'pvp' | 'ai'
  const [difficulty, setDifficulty] = useState('medium')
  const [humanSymbol, setHumanSymbol] = useState('X')

  const handleRoundEnd = useCallback(({ winner, isDraw }) => {
    setScores((prev) => {
      if (isDraw) return { ...prev, draws: prev.draws + 1 }
      if (winner) return { ...prev, [winner]: prev[winner] + 1 }
      return prev
    })
  }, [])

  const xLabel = opponent === 'ai' ? (humanSymbol === 'X' ? 'YOU' : 'NOVA') : 'PLAYER X'
  const oLabel = opponent === 'ai' ? (humanSymbol === 'O' ? 'YOU' : 'NOVA') : 'PLAYER O'

  const GameView = mode === 'ultimate' ? UltimateGameView : ClassicGameView

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-8 sm:py-14">
      <div className="w-full max-w-[min(94vw,30rem)] mx-auto flex flex-col gap-5 sm:gap-6">
        <Header />

        <ControlBar
          mode={mode}
          onModeChange={setMode}
          opponent={opponent}
          onOpponentChange={setOpponent}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          humanSymbol={humanSymbol}
          onHumanSymbolChange={setHumanSymbol}
        />

        <GameView
          opponent={opponent}
          difficulty={difficulty}
          humanSymbol={humanSymbol}
          onRoundEnd={handleRoundEnd}
        />

        <ScorePanel scores={scores} xLabel={xLabel} oLabel={oLabel} />
      </div>
    </div>
  )
}
