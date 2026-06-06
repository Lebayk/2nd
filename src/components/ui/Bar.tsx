import { motion } from 'framer-motion'
import { clamp } from '../../lib/utils'

interface BarProps {
  progress: number
  height?: number
  color?: string
  track?: string
  glow?: boolean
  className?: string
}

export function Bar({
  progress,
  height = 9,
  color = 'linear-gradient(90deg,var(--color-gold),var(--color-gold-2))',
  track = 'var(--color-ink-3)',
  glow = true,
  className = '',
}: BarProps) {
  return (
    <div
      className={`overflow-hidden rounded-full ${className}`}
      style={{ height, background: track }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: color, boxShadow: glow ? '0 0 16px rgba(216,176,106,.4)' : undefined }}
        initial={{ width: 0 }}
        animate={{ width: `${clamp(progress, 0, 1) * 100}%` }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </div>
  )
}
