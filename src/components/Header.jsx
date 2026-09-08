function SpeakerIcon({ muted }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
      {!muted && <path d="M16.5 9a4 4 0 0 1 0 6" strokeLinecap="round" />}
      {!muted && <path d="M19 7a7.5 7.5 0 0 1 0 10" strokeLinecap="round" />}
      {muted && <path d="M16 9l4 6M20 9l-4 6" strokeLinecap="round" />}
    </svg>
  );
}

export default function Header({ muted, onToggleMute }) {
  return (
    <header className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-ink">
          Nova Clash
        </span>
        <span className="text-nova animate-drift" aria-hidden="true">
          ✦
        </span>
      </div>

      <button
        type="button"
        onClick={onToggleMute}
        aria-pressed={muted}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
        className="flex items-center justify-center h-8 w-8 rounded-lg border border-void-line text-ink-muted hover:text-ink hover:border-ink-faint transition-colors"
      >
        <SpeakerIcon muted={muted} />
      </button>
    </header>
  );
}
