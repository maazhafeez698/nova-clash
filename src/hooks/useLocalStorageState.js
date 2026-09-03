import { useEffect, useState } from 'react'

/** Same shape as useState, but persisted to localStorage under `key`. */
export function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // Storage unavailable (private browsing, quota, etc.) — fail silently.
    }
  }, [key, state])

  return [state, setState]
}
