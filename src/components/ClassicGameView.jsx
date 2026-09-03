import { useEffect } from 'react'
import Board from './Board.jsx'
import StatusBar from './StatusBar.jsx'
import { useClassicGame } from '../hooks/useClassicGame.js'

export default function ClassicGameView({ opponent, difficulty, humanSymbol, onRoundEnd }) {
  const { board, current, winner, winLine, isDraw, isOver, aiThinking, placeMark, reset } =
    useClassicGame({ opponent, difficulty, humanSymbol }, onRoundEnd)

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponent, difficulty, humanSymbol])

  return (
    <>
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
    </>
  )
}
