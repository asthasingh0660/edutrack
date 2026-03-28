import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function ProgressRing({ value = 0, total = 1, size = 120, stroke = 8 }) {
  const circleRef = useRef(null)
  const pct = total === 0 ? 0 : Math.round((value / total) * 100)
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r

  useEffect(() => {
    const offset = circumference - (pct / 100) * circumference
    gsap.to(circleRef.current, {
      strokeDashoffset: offset,
      duration: 1.2,
      ease: 'power2.out',
    })
  }, [pct, circumference])

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="currentColor"
          strokeWidth={stroke}
          className="text-cream-dark dark:text-cream/10"
        />
        {/* Fill */}
        <circle
          ref={circleRef}
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="text-forest-mid"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      {/* Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-2xl text-ink dark:text-cream leading-none">{pct}%</span>
        <span className="font-mono text-[9px] text-ink/40 dark:text-cream/40 tracking-widest uppercase mt-0.5">Done</span>
      </div>
    </div>
  )
}