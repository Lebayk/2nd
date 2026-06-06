import { motion } from 'framer-motion'
import { Zap, Flame, Timer, Brain, ListChecks, Star, CalendarCheck } from 'lucide-react'
import { ALL_WEEKS, DOMAINS } from '../data/curriculum'
import { useStore, useLevel } from '../store'
import { cn, dayKey, addDays, formatMinutes, formatDayKey } from '../lib/utils'
import type { DomainKey } from '../types'

export function Stats() {
  const s = useStore()
  const level = useLevel()

  const today = dayKey()
  const last14 = Array.from({ length: 14 }, (_, k) => addDays(today, -(13 - k)))
  const xpSeries = last14.map((d) => ({ day: d, xp: s.dailyXp[d] ?? 0 }))
  const maxXp = Math.max(10, ...xpSeries.map((x) => x.xp))

  // domain completion
  const domStats = (Object.keys(DOMAINS) as DomainKey[])
    .map((d) => {
      const weeks = ALL_WEEKS.filter((w) => w.dom === d)
      const total = weeks.reduce((a, w) => a + w.topics.length, 0)
      const done = weeks.reduce((a, w) => a + w.topics.filter((t) => s.topics[t.id]).length, 0)
      return { d, total, done }
    })
    .filter((x) => x.total > 0)

  // 70-day heatmap (10 cols × 7 rows), ending today
  const heat = Array.from({ length: 70 }, (_, k) => {
    const day = addDays(today, -(69 - k))
    return { day, xp: s.dailyXp[day] ?? 0 }
  })
  const maxHeat = Math.max(20, ...heat.map((h) => h.xp))

  const stats = [
    { icon: Zap, label: 'XP totale', value: s.xp.toLocaleString('fr-FR'), color: 'var(--color-gold-2)' },
    { icon: Star, label: 'Niveau', value: `${level.level} · ${level.title}`, color: 'var(--color-gold)' },
    { icon: Flame, label: 'Meilleure série', value: `${s.bestStreak} j`, color: '#fb923c' },
    { icon: Timer, label: 'Concentration', value: formatMinutes(s.focusMinutes), color: 'var(--color-analyse)' },
    { icon: Brain, label: 'Flashcards revues', value: String(s.flashcardsReviewed), color: 'var(--color-geometrie)' },
    { icon: ListChecks, label: 'Quiz réussis', value: String(s.quizzesPassed), color: 'var(--color-algebre)' },
  ]

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-display text-2xl font-semibold">Statistiques</h2>
        <p className="mt-1 text-[0.92rem] text-dim">Ta progression en un coup d’œil. La régularité bat l’intensité.</p>
      </div>

      {/* stat grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((st, idx) => (
          <motion.div
            key={st.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="card p-4"
          >
            <st.icon size={18} style={{ color: st.color }} />
            <div className="mt-2 font-display text-xl font-semibold leading-tight">{st.value}</div>
            <div className="font-mono text-[0.68rem] uppercase tracking-wide text-faint">{st.label}</div>
          </motion.div>
        ))}
      </div>

      {/* XP last 14 days */}
      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">XP — 14 derniers jours</h3>
          <span className="font-mono text-xs text-faint">{xpSeries.reduce((a, x) => a + x.xp, 0)} XP</span>
        </div>
        <div className="flex h-40 items-end gap-1.5">
          {xpSeries.map((x) => (
            <div key={x.day} className="group relative flex flex-1 flex-col items-center justify-end">
              <div className="absolute -top-6 hidden rounded-md bg-ink-4 px-1.5 py-0.5 font-mono text-[0.6rem] text-txt group-hover:block">{x.xp}</div>
              <motion.div
                className="w-full rounded-t-md"
                style={{ background: x.xp > 0 ? 'linear-gradient(180deg,var(--color-gold-2),var(--color-gold))' : 'rgba(255,255,255,.05)' }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(x.xp > 0 ? 6 : 3, (x.xp / maxXp) * 100)}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
              <div className="mt-1.5 font-mono text-[0.55rem] text-faint">{formatDayKey(x.day).split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* domain completion */}
      <div className="card p-5 sm:p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Avancement par domaine</h3>
        <div className="space-y-3">
          {domStats.map((ds) => {
            const pct = ds.total ? Math.round((ds.done / ds.total) * 100) : 0
            return (
              <div key={ds.d}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span style={{ color: DOMAINS[ds.d].color }}>{DOMAINS[ds.d].l}</span>
                  <span className="font-mono text-xs text-faint">
                    {ds.done}/{ds.total} · {pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-3">
                  <motion.div className="h-full rounded-full" style={{ background: DOMAINS[ds.d].color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* heatmap */}
      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <CalendarCheck size={17} className="text-gold-2" />
          <h3 className="font-display text-lg font-semibold">Assiduité — 10 dernières semaines</h3>
        </div>
        <div className="flex justify-center gap-[3px] overflow-x-auto pb-1">
          {Array.from({ length: 10 }, (_, col) => (
            <div key={col} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }, (_, row) => {
                const cell = heat[col * 7 + row]
                const intensity = cell.xp === 0 ? 0 : 0.2 + 0.8 * Math.min(1, cell.xp / maxHeat)
                const isToday = cell.day === today
                return (
                  <div
                    key={row}
                    title={`${formatDayKey(cell.day)} · ${cell.xp} XP`}
                    className={cn('h-3.5 w-3.5 rounded-[3px] transition', isToday && 'ring-1 ring-gold-2')}
                    style={{ background: cell.xp === 0 ? 'rgba(255,255,255,.04)' : `rgba(216,176,106,${intensity})` }}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[0.6rem] text-faint">
          moins
          {[0.04, 0.3, 0.55, 0.8, 1].map((a, k) => (
            <span key={k} className="h-3 w-3 rounded-[3px]" style={{ background: a < 0.1 ? 'rgba(255,255,255,.04)' : `rgba(216,176,106,${a})` }} />
          ))}
          plus
        </div>
      </div>
    </div>
  )
}
