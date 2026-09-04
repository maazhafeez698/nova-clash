import SegmentedControl from "./SegmentedControl.jsx";

const MODE_OPTIONS = [
  { value: "classic", label: "Classic" },
  { value: "ultimate", label: "Ultimate" },
];

const OPPONENT_OPTIONS = [
  { value: "pvp", label: "Local PvP" },
  { value: "ai", label: "Vs Nova AI" },
  { value: "online", label: "Invite Player" },
];

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Unbeatable" },
];

const SYMBOL_OPTIONS = [
  { value: "X", label: "Play as X" },
  { value: "O", label: "Play as O" },
];

export default function ControlBar({
  mode,
  onModeChange,
  opponent,
  onOpponentChange,
  difficulty,
  onDifficultyChange,
  humanSymbol,
  onHumanSymbolChange,
}) {
  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <SegmentedControl
          options={MODE_OPTIONS}
          value={mode}
          onChange={onModeChange}
        />
        {opponent !== "online" && (
          <SegmentedControl
            options={SYMBOL_OPTIONS}
            value={humanSymbol}
            onChange={onHumanSymbolChange}
            size="sm"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <SegmentedControl
          options={OPPONENT_OPTIONS}
          value={opponent}
          onChange={onOpponentChange}
          size="sm"
        />

        {opponent === "ai" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-faint hidden sm:inline">
              Difficulty
            </span>
            <SegmentedControl
              options={DIFFICULTY_OPTIONS}
              value={difficulty}
              onChange={onDifficultyChange}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
