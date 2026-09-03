export default function WinGlow({ symbol }) {
  if (!symbol) return null
  const colorClass = symbol === 'X' ? 'bg-amber' : 'bg-cyan'

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl"
      aria-hidden="true"
    >
      <span className={`h-28 w-28 rounded-full ${colorClass} opacity-25 animate-pulse-ring`} />
      <span
        className={`absolute h-28 w-28 rounded-full ${colorClass} opacity-20 animate-pulse-ring`}
        style={{ animationDelay: '350ms' }}
      />
    </div>
  )
}
