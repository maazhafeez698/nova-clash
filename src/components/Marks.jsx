export function XMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`h-[62%] w-[62%] ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="22" y1="22" x2="78" y2="78"
        stroke="currentColor" strokeWidth="10" strokeLinecap="round"
        pathLength="1"
        className="animate-[line-draw_260ms_ease-out_both]"
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
      <line
        x1="78" y1="22" x2="22" y2="78"
        stroke="currentColor" strokeWidth="10" strokeLinecap="round"
        pathLength="1"
        className="animate-[line-draw_260ms_ease-out_100ms_both]"
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
    </svg>
  )
}

export function OMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`h-[62%] w-[62%] ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="50" cy="50" r="32"
        stroke="currentColor" strokeWidth="10" strokeLinecap="round"
        pathLength="1"
        className="animate-[line-draw_320ms_ease-out_both]"
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
    </svg>
  )
}
