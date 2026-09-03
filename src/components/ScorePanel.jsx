function ScoreCell({ label, value, colorClass }) {
  return (
    <div className="flex-1 rounded-xl border border-void-line bg-void-surface py-3 text-center">
      <div className={`font-display text-2xl sm:text-3xl font-semibold ${colorClass}`}>{value}</div>
      <div className="mt-0.5 text-[11px] tracking-wide text-ink-faint">{label}</div>
    </div>
  )
}

export default function ScorePanel({ scores, xLabel = 'PLAYER X', oLabel = 'PLAYER O' }) {
  return (
    <div className="flex gap-2.5 sm:gap-3 w-full">
      <ScoreCell label={xLabel} value={scores.X} colorClass="text-amber" />
      <ScoreCell label="TIES" value={scores.draws} colorClass="text-ink-muted" />
      <ScoreCell label={oLabel} value={scores.O} colorClass="text-cyan" />
    </div>
  )
}
