import { XMark, OMark } from './Marks.jsx'

export default function Cell({ value, onClick, disabled, highlight, ghost, label }) {
  const isEmpty = value === null

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !isEmpty}
      aria-label={label}
      className={[
        'group relative aspect-square rounded-xl border flex items-center justify-center',
        'bg-void-surface border-void-line transition-all duration-150',
        isEmpty && !disabled
          ? 'hover:bg-void-raised hover:border-ink-faint cursor-pointer active:scale-[0.97]'
          : '',
        disabled && isEmpty ? 'opacity-40 cursor-not-allowed' : '',
        highlight
          ? 'border-nova/70 shadow-[0_0_0_1px_rgba(255,92,138,0.35),0_0_22px_rgba(255,92,138,0.22)]'
          : '',
      ].join(' ')}
    >
      {value === 'X' && <XMark className="text-amber drop-shadow-[0_0_10px_rgba(255,180,84,0.35)]" />}
      {value === 'O' && <OMark className="text-cyan drop-shadow-[0_0_10px_rgba(76,224,210,0.35)]" />}
      {isEmpty && ghost && (
        <span
          className={[
            'pointer-events-none absolute h-[46%] w-[46%] rounded-full opacity-0',
            'group-hover:opacity-20 transition-opacity duration-150',
            ghost === 'X' ? 'bg-amber' : 'bg-cyan',
          ].join(' ')}
          aria-hidden="true"
        />
      )}
    </button>
  )
}
