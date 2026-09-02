import { useCallback, useState } from 'react'
import { calculateWinner, emptyBoard, isBoardFull, otherSymbol } from '../game/gameLogic.js'

/**
 * Local state machine for a single Classic (3x3) match.
 * @param {(result: { winner: string|null, isDraw: boolean }) => void} onRoundEnd
 */
export function useClassicGame(onRoundEnd) {
  const [board, setBoard] = useState(emptyBoard)
  const [current, setCurrent] = useState('X')
  const [winner, setWinner] = useState(null)
  const [winLine, setWinLine] = useState(null)
  const [isDraw, setIsDraw] = useState(false)

  const isOver = winner !== null || isDraw

  const placeMark = useCallback(
    (index) => {
      if (isOver || board[index] !== null) return

      const nextBoard = board.slice()
      nextBoard[index] = current
      setBoard(nextBoard)

      const result = calculateWinner(nextBoard)
      if (result.winner) {
        setWinner(result.winner)
        setWinLine(result.line)
        onRoundEnd?.({ winner: result.winner, isDraw: false })
        return
      }

      if (isBoardFull(nextBoard)) {
        setIsDraw(true)
        onRoundEnd?.({ winner: null, isDraw: true })
        return
      }

      setCurrent((prev) => otherSymbol(prev))
    },
    [board, current, isOver, onRoundEnd]
  )

  const reset = useCallback((startingPlayer = 'X') => {
    setBoard(emptyBoard())
    setCurrent(startingPlayer)
    setWinner(null)
    setWinLine(null)
    setIsDraw(false)
  }, [])

  return { board, current, winner, winLine, isDraw, isOver, placeMark, reset }
}
