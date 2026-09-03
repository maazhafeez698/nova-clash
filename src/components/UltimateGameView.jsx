import { useEffect } from 'react'
import UltimateBoard from './UltimateBoard.jsx'
import StatusBar from './StatusBar.jsx'
import { useUltimateGame } from '../hooks/useUltimateGame.js'

export default function UltimateGameView({ opponent, difficulty, humanSymbol, onRoundEnd }) {
  const game = useUltimateGame({ opponent, difficulty, humanSymbol }, onRoundEnd)
  const { current, overallWinner, isDraw, isOver, aiThinking, placeMark, reset, activeBoard } = game

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponent, difficulty, humanSymbol])

  const hint = isDraw
    ? undefined
    : activeBoard === null
      ? 'Free choice — play in any open board'
      : `Sent to board ${activeBoard + 1}`

  return (
    <>
      <UltimateBoard state={game} onCellClick={placeMark} disabled={isOver || aiThinking} />
      <StatusBar
        current={current}
        winner={overallWinner}
        isDraw={isDraw}
        onRestart={() => reset()}
        aiThinking={aiThinking}
        hint={hint}
      />
    </>
  )
}
