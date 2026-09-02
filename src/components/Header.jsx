export default function Header() {
  return (
    <header className="w-full max-w-[min(92vw,26rem)] mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-ink">
          Nova Clash
        </span>
        <span className="text-nova animate-drift" aria-hidden="true">
          ✦
        </span>
      </div>
    </header>
  )
}
