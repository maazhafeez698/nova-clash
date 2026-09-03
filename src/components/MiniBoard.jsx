import { XMark, OMark } from './Marks.jsx'

export default function MiniBoard({ cells, winnerSymbol, isActive, onCellClick, metaHighlight, boardIndex }) {
  const resolved = winnerSymbol !== null

  return (
    <div
      role="group"
      aria-label={
        resolved
          ? `Board ${boardIndex + 1}, ${winnerSymbol === 'draw' ? 'tied' : `won by ${winnerSymbol}`}`
          : `Board ${boardIndex + 1}${isActive ? ', playable' : ', locked'}`
      }
      className={[
        'relative grid grid-cols-3 gap-1 rounded-lg p-1 sm:p-1.5 border transition-colors duration-200',
        isActive ? 'border-cyan/60 bg-void-surface shadow-glow' : 'border-void-line bg-void-surface/60',
        metaHighlight
          ? 'border-nova/70 shadow-[0_0_0_1px_rgba(255,92,138,0.35),0_0_18px_rgba(255,92,138,0.2)]'
          : '',
        resolved ? 'opacity-75' : '',
      ].join(' ')}
    >
      {cells.map((value, i) => {
        const clickable = isActive && !resolved && value === null
        return (
          <button
            key={i}
            type="button"
            onClick={() => onCellClick(i)}
            disabled={!clickable}
            aria-label={value ? `board ${boardIndex + 1} cell ${i + 1}, marked ${value}` : `board ${boardIndex + 1} cell ${i + 1}, empty`}
            tabIndex={clickable ? 0 : -1}
            className={[
              'aspect-square rounded-sm flex items-center justify-center bg-void-deep/60',
              clickable ? 'hover:bg-void-raised cursor-pointer' : 'cursor-default',
            ].join(' ')}
          >
            {value === 'X' && <XMark className="text-amber" />}
            {value === 'O' && <OMark className="text-cyan" />}
          </button>
        )
      })}

      {resolved && winnerSymbol !== 'draw' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={[
              'font-display text-3xl sm:text-4xl font-bold animate-mark-in',
              winnerSymbol === 'X' ? 'text-amber' : 'text-cyan',
            ].join(' ')}
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
          >
            {winnerSymbol}
          </span>
        </div>
      )}

      {resolved && winnerSymbol === 'draw' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-ink-faint" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
