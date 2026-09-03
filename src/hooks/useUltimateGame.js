import { useCallback, useEffect, useState } from 'react'
import { otherSymbol } from '../game/gameLogic.js'
import { applyUltimateMove, createUltimateState, isCellPlayable } from '../game/ultimateLogic.js'
import { getUltimateAiMove } from '../game/ultimateAi.js'

const AI_THINK_DELAY_MS = 550

/**
 * @param {{
 *   opponent: 'pvp'|'ai', difficulty: 'easy'|'medium'|'hard', humanSymbol: 'X'|'O',
 *   onMove?: (symbol: string) => void,
 *   onRoundEnd?: (result: { winner: string|null, isDraw: boolean }) => void,
 * }} options
 */
export function useUltimateGame({ opponent, difficulty, humanSymbol, onMove, onRoundEnd }) {
  const aiSymbol = otherSymbol(humanSymbol)

  const [state, setState] = useState(createUltimateState)
  const [aiThinking, setAiThinking] = useState(false)

  const isOver = state.overallWinner !== null || state.isDraw
  const isAiTurn = opponent === 'ai' && state.current === aiSymbol && !isOver

  const playMove = useCallback(
    (boardIndex, cellIndex) => {
      setState((prev) => {
        if (!isCellPlayable(prev, boardIndex, cellIndex)) return prev
        const symbol = prev.current
        const next = applyUltimateMove(prev, boardIndex, cellIndex)
        onMove?.(symbol)
        if (next.overallWinner) onRoundEnd?.({ winner: next.overallWinner, isDraw: false })
        else if (next.isDraw) onRoundEnd?.({ winner: null, isDraw: true })
        return next
      })
    },
    [onMove, onRoundEnd]
  )

  const placeMark = useCallback(
    (boardIndex, cellIndex) => {
      if (opponent === 'ai' && state.current !== humanSymbol) return
      playMove(boardIndex, cellIndex)
    },
    [opponent, humanSymbol, state.current, playMove]
  )

  useEffect(() => {
    if (!isAiTurn) return

    setAiThinking(true)
    const timer = setTimeout(() => {
      setState((prev) => {
        if (prev.overallWinner || prev.isDraw) return prev
        const move = getUltimateAiMove(prev, aiSymbol, difficulty)
        if (!move) return prev
        const next = applyUltimateMove(prev, move.board, move.cell)
        onMove?.(aiSymbol)
        if (next.overallWinner) onRoundEnd?.({ winner: next.overallWinner, isDraw: false })
        else if (next.isDraw) onRoundEnd?.({ winner: null, isDraw: true })
        return next
      })
      setAiThinking(false)
    }, AI_THINK_DELAY_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiTurn, aiSymbol, difficulty])

  const reset = useCallback(() => {
    setState(createUltimateState())
    setAiThinking(false)
  }, [])

  return { ...state, isOver, aiThinking, placeMark, reset, aiSymbol }
}
