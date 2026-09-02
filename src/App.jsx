import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Board from './components/Board.jsx'
import StatusBar from './components/StatusBar.jsx'
import ScorePanel from './components/ScorePanel.jsx'
import ControlBar from './components/ControlBar.jsx'
import { useClassicGame } from './hooks/useClassicGame.js'

export default function App() {
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })
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

  const { board, current, winner, winLine, isDraw, isOver, aiThinking, placeMark, reset } =
    useClassicGame({ opponent, difficulty, humanSymbol }, handleRoundEnd)

  // Start a fresh round whenever the match setup changes, so mid-game
  // switches never leave the board in a half-configured state.
  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponent, difficulty, humanSymbol])

  const xLabel = opponent === 'ai' ? (humanSymbol === 'X' ? 'YOU' : 'NOVA') : 'PLAYER X'
  const oLabel = opponent === 'ai' ? (humanSymbol === 'O' ? 'YOU' : 'NOVA') : 'PLAYER O'

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-8 sm:py-14">
      <div className="w-full flex flex-col gap-5 sm:gap-6">
        <Header />

        <ControlBar
          opponent={opponent}
          onOpponentChange={setOpponent}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          humanSymbol={humanSymbol}
          onHumanSymbolChange={setHumanSymbol}
        />

        <Board
          board={board}
          winLine={winLine}
          onCellClick={placeMark}
          disabled={isOver || aiThinking}
          currentPlayer={current}
        />

        <StatusBar
          current={current}
          winner={winner}
          isDraw={isDraw}
          onRestart={() => reset()}
          aiThinking={aiThinking}
        />

        <ScorePanel scores={scores} xLabel={xLabel} oLabel={oLabel} />
      </div>
    </div>
  )
}
