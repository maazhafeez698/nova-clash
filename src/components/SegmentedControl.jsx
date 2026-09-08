export default function SegmentedControl({
  options,
  value,
  onChange,
  size = "md",
}) {
  const padding = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";

  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-void-line bg-void-surface p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={[
              "rounded-md font-medium transition-colors",
              padding,
              active
                ? "bg-void-raised text-ink shadow-glow"
                : "text-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
