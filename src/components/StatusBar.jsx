const SYMBOL_STYLES = {
  X: { text: 'text-amber', dot: 'bg-amber' },
  O: { text: 'text-cyan', dot: 'bg-cyan' },
}

export default function StatusBar({ current, winner, isDraw, onRestart, aiThinking, hint }) {
  let message
  let tone = SYMBOL_STYLES[current]

  if (winner) {
    tone = SYMBOL_STYLES[winner]
    message = (
      <>
        <span className={`font-semibold ${tone.text}`}>{winner}</span> wins the round
      </>
    )
  } else if (isDraw) {
    message = <span className="text-ink-muted">Stalemate — board full</span>
  } else if (aiThinking) {
    message = <span className="text-ink-muted">Nova is calculating…</span>
  } else {
    message = (
      <>
        <span className={`font-semibold ${tone.text}`}>{current}</span>&rsquo;s move
      </>
    )
  }

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 font-body text-sm sm:text-base">
          <span
            className={`h-2.5 w-2.5 rounded-full ${tone.dot} ${
              !winner && !isDraw ? 'animate-pulse' : ''
            }`}
            aria-hidden="true"
          />
          <span className="text-ink">{message}</span>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="text-sm font-medium text-ink-muted hover:text-ink border border-void-line hover:border-ink-faint rounded-lg px-3 py-1.5 transition-colors"
        >
          Restart
        </button>
      </div>
      {hint && !winner && !isDraw && <p className="text-xs text-ink-faint pl-5">{hint}</p>}
    </div>
  )
}
