import { useCallback, useState } from 'react'
import Header from './components/Header.jsx'
import Board from './components/Board.jsx'
import StatusBar from './components/StatusBar.jsx'
import ScorePanel from './components/ScorePanel.jsx'
import { useClassicGame } from './hooks/useClassicGame.js'

export default function App() {
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const handleRoundEnd = useCallback(({ winner, isDraw }) => {
    setScores((prev) => {
      if (isDraw) return { ...prev, draws: prev.draws + 1 }
      if (winner) return { ...prev, [winner]: prev[winner] + 1 }
      return prev
    })
  }, [])

  const { board, current, winner, winLine, isDraw, isOver, placeMark, reset } =
    useClassicGame(handleRoundEnd)

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full flex flex-col gap-6 sm:gap-8">
        <Header />

        <Board
          board={board}
          winLine={winLine}
          onCellClick={placeMark}
          disabled={isOver}
          currentPlayer={current}
        />

        <StatusBar current={current} winner={winner} isDraw={isDraw} onRestart={() => reset()} />

        <ScorePanel scores={scores} />
      </div>
    </div>
  )
}
