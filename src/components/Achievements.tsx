import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { ACHIEVEMENTS } from '../lib/achievements'
import { useStore } from '../store'
import { Bar } from './ui/Bar'
import { cn } from '../lib/utils'

export function Achievements() {
  const unlocked = useStore((s) => s.unlocked)
  const count = Object.keys(unlocked).filter((id) => ACHIEVEMENTS.some((a) => a.id === id)).length
  const total = ACHIEVEMENTS.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">Succès</h2>
        <p className="mt-1 text-[0.92rem] text-dim">
          {count} / {total} débloqués — chaque jalon est une preuve de ta régularité.
        </p>
        <div className="mt-3 max-w-md">
          <Bar progress={total ? count / total : 0} height={8} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map((a, idx) => {
          const isUnlocked = !!unlocked[a.id]
          const hidden = a.secret && !isUnlocked
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(idx * 0.03, 0.4) }}
              className={cn('card relative overflow-hidden p-4 text-center', isUnlocked ? '' : 'opacity-80')}
              style={isUnlocked ? { borderColor: 'rgba(216,176,106,.3)', background: 'rgba(216,176,106,.05)' } : undefined}
            >
              <div className={cn('mx-auto grid h-14 w-14 place-items-center rounded-2xl text-3xl', !isUnlocked && 'grayscale')} style={{ background: isUnlocked ? 'rgba(216,176,106,.12)' : 'rgba(255,255,255,.03)' }}>
                {hidden ? <Lock size={22} className="text-faint" /> : a.icon}
              </div>
              <div className="mt-2.5 font-display text-[0.98rem] font-semibold leading-tight">
                {hidden ? 'Succès secret' : a.name}
              </div>
              <div className="mt-1 text-[0.76rem] leading-snug text-faint">
                {hidden ? 'À découvrir…' : a.desc}
              </div>
              {isUnlocked && (
                <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-wide text-gold-2/70">débloqué le {unlocked[a.id]}</div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
