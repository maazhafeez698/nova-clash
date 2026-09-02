import SegmentedControl from './SegmentedControl.jsx'

const OPPONENT_OPTIONS = [
  { value: 'pvp', label: 'Local PvP' },
  { value: 'ai', label: 'Vs Nova AI' },
]

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Unbeatable' },
]

const SYMBOL_OPTIONS = [
  { value: 'X', label: 'Play as X' },
  { value: 'O', label: 'Play as O' },
]

export default function ControlBar({
  opponent,
  onOpponentChange,
  difficulty,
  onDifficultyChange,
  humanSymbol,
  onHumanSymbolChange,
}) {
  return (
    <div className="w-full max-w-[min(92vw,26rem)] mx-auto flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <SegmentedControl options={OPPONENT_OPTIONS} value={opponent} onChange={onOpponentChange} />
        <SegmentedControl
          options={SYMBOL_OPTIONS}
          value={humanSymbol}
          onChange={onHumanSymbolChange}
          size="sm"
        />
      </div>

      {opponent === 'ai' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-faint">Difficulty</span>
          <SegmentedControl options={DIFFICULTY_OPTIONS} value={difficulty} onChange={onDifficultyChange} size="sm" />
        </div>
      )}
    </div>
  )
}
