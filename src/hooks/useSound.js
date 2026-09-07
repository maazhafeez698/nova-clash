import { useCallback, useMemo } from 'react'
import * as sound from '../game/sound.js'
import { useLocalStorageState } from './useLocalStorageState.js'

export function useSound() {
  const [muted, setMuted] = useLocalStorageState('nova-clash:muted', false)

  const toggleMute = useCallback(() => setMuted((m) => !m), [setMuted])

  // Memoized so playMove/playWin/playDraw/playClick keep a stable identity
  // across renders — anything downstream that depends on them (like the
  // online-match data-connection listeners) only re-subscribes when `muted`
  // actually changes, not on every unrelated re-render.
  return useMemo(() => {
    const guarded =
      (fn) =>
      (...args) => {
        if (!muted) fn(...args)
      }

    return {
      muted,
      toggleMute,
      playMove: guarded(sound.playMove),
      playWin: guarded(sound.playWin),
      playDraw: guarded(sound.playDraw),
      playClick: guarded(sound.playClick),
    }
  }, [muted, toggleMute])
}