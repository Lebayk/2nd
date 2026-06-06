import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'
import { celebrate, fireworks, pop } from '../lib/confetti'
import { sfx } from '../lib/sound'

const ACCENT: Record<string, { ring: string; bg: string }> = {
  achievement: { ring: 'rgba(216,176,106,.4)', bg: 'rgba(216,176,106,.1)' },
  levelup: { ring: 'rgba(233,201,138,.5)', bg: 'rgba(216,176,106,.12)' },
  chapter: { ring: 'rgba(110,231,183,.4)', bg: 'rgba(110,231,183,.08)' },
  goal: { ring: 'rgba(125,211,252,.4)', bg: 'rgba(125,211,252,.08)' },
  finish: { ring: 'rgba(233,201,138,.6)', bg: 'rgba(216,176,106,.15)' },
}

const LABEL: Record<string, string> = {
  achievement: 'Succès débloqué',
  levelup: 'Niveau supérieur',
  chapter: 'Chapitre terminé',
  goal: 'Objectif',
  finish: 'Félicitations',
}

export function Celebrations() {
  const cels = useStore((s) => s.celebrations)
  const dismiss = useStore((s) => s.dismissCelebration)
  const soundOn = useStore((s) => s.settings.sound)
  const confettiOn = useStore((s) => s.settings.confetti)
  const fired = useRef(new Set<string>())

  useEffect(() => {
    cels.forEach((c) => {
      if (fired.current.has(c.id)) return
      fired.current.add(c.id)

      if (confettiOn) {
        if (c.kind === 'finish') fireworks()
        else if (c.kind === 'levelup' || c.kind === 'achievement') celebrate()
        else pop()
      }
      if (soundOn) {
        if (c.kind === 'levelup') sfx.levelup()
        else if (c.kind === 'achievement') sfx.achievement()
        else if (c.kind === 'finish') sfx.done()
        else sfx.correct()
      }
      const ms = c.kind === 'finish' ? 6500 : 4200
      window.setTimeout(() => dismiss(c.id), ms)
    })
  }, [cels, soundOn, confettiOn, dismiss])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {cels.slice(-3).map((c) => {
          const accent = ACCENT[c.kind] ?? ACCENT.achievement
          return (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              onClick={() => dismiss(c.id)}
              className="pointer-events-auto flex w-full max-w-sm cursor-pointer items-center gap-3 rounded-2xl border bg-ink-2/95 px-4 py-3 shadow-2xl backdrop-blur-xl"
              style={{ borderColor: accent.ring, boxShadow: `0 8px 40px ${accent.bg}` }}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl" style={{ background: accent.bg }}>
                {c.icon ?? '🎉'}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-gold-2/80">{LABEL[c.kind]}</div>
                <div className="truncate font-display text-base font-semibold leading-tight">{c.title}</div>
                {c.subtitle && <div className="truncate text-[0.8rem] text-dim">{c.subtitle}</div>}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
