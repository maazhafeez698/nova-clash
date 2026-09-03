import { useCallback } from 'react'
import * as sound from '../game/sound.js'
import { useLocalStorageState } from './useLocalStorageState.js'

export function useSound() {
  const [muted, setMuted] = useLocalStorageState('nova-clash:muted', false)

  const guarded = useCallback(
    (fn) =>
      (...args) => {
        if (!muted) fn(...args)
      },
    [muted]
  )

  return {
    muted,
    toggleMute: () => setMuted((m) => !m),
    playMove: guarded(sound.playMove),
    playWin: guarded(sound.playWin),
    playDraw: guarded(sound.playDraw),
    playClick: guarded(sound.playClick),
  }
}
