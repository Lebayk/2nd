import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { clamp } from '../../lib/utils'

interface RingProps {
  progress: number
  size?: number
  stroke?: number
  color?: string
  track?: string
  children?: ReactNode
  glow?: boolean
}

export function Ring({
  progress,
  size = 120,
  stroke = 10,
  color = 'var(--color-gold)',
  track = 'rgba(255,255,255,0.08)',
  children,
  glow = true,
}: RingProps) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const p = clamp(progress, 0, 1)

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={glow ? { filter: 'drop-shadow(0 0 6px rgba(216,176,106,.25))' } : undefined}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - p) }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}
