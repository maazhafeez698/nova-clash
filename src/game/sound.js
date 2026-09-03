// Every sound in Nova Clash is synthesized at runtime via the Web Audio API —
// no audio assets to fetch, and it stays perfectly in tune with the theme.

let ctx = null

function getContext() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq, duration = 0.12, type = 'sine', startTime = 0, gain = 0.15, glideTo }) {
  const audioCtx = getContext()
  if (!audioCtx) return

  const osc = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  const t0 = audioCtx.currentTime + startTime

  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + duration)

  gainNode.gain.setValueAtTime(0.0001, t0)
  gainNode.gain.linearRampToValueAtTime(gain, t0 + 0.008)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  osc.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

/** Short blip on every mark placed — pitch differs by symbol so X/O read distinctly. */
export function playMove(symbol) {
  tone({ freq: symbol === 'X' ? 660 : 494, type: symbol === 'X' ? 'triangle' : 'sine', duration: 0.09, gain: 0.11 })
}

/** Rising three-note arpeggio for a round win. */
export function playWin() {
  const notes = [523.25, 659.25, 783.99]
  notes.forEach((freq, i) => tone({ freq, startTime: i * 0.09, duration: 0.18, type: 'triangle', gain: 0.13 }))
}

/** Neutral downward glide for a draw. */
export function playDraw() {
  tone({ freq: 320, glideTo: 180, duration: 0.28, type: 'sawtooth', gain: 0.07 })
}

/** Tiny tick for UI interactions (restart, toggles). */
export function playClick() {
  tone({ freq: 880, duration: 0.035, type: 'square', gain: 0.045 })
}
