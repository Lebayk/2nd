import { useState } from 'react'
import { motion } from 'framer-motion'
import { PHASES, DOMAINS, ALL_TOPIC_IDS } from '../data/curriculum'
import { useStore } from '../store'
import { WeekCard } from './WeekCard'
import { Bar } from './ui/Bar'
import { cn } from '../lib/utils'
import type { DomainKey } from '../types'

const RHYTHM = [
  { j: 'J1', nm: 'Cours', ds: 'Lire le cours + exemples' },
  { j: 'J2', nm: 'Cours + méthodes', ds: 'Théorèmes, démos clés' },
  { j: 'J3', nm: 'Exos faciles', ds: 'Application directe' },
  { j: 'J4', nm: 'Exos moyens', ds: 'Exos à étapes' },
  { j: 'J5', nm: 'Exos type bac', ds: 'Problèmes complets' },
  { j: 'J6', nm: 'Fiche + Python', ds: 'Synthèse 1 page' },
  { j: 'J7', nm: 'Repos', ds: 'Révision flash', rest: true },
]

const DOMAIN_FILTERS: DomainKey[] = ['alg', 'ana', 'geo', 'pro', 'py', 'rev']

export function Planning({ onStudyChapter }: { onStudyChapter: (chapter: number) => void }) {
  const topics = useStore((s) => s.topics)
  const [filter, setFilter] = useState<DomainKey | 'all'>('all')

  const done = ALL_TOPIC_IDS.filter((id) => topics[id]).length
  const total = ALL_TOPIC_IDS.length
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div className="space-y-8">
      {/* progress */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-faint">Progression globale</span>
          <span className="font-display text-2xl font-semibold text-gold-2">{pct}%</span>
        </div>
        <Bar progress={pct / 100} className="mt-3" height={10} />
        <div className="mt-3 font-mono text-xs text-dim">
          {done} / {total} sous-parties validées
        </div>
      </div>

      {/* rhythm */}
      <section>
        <h2 className="mb-3 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-faint">
          Rythme hebdomadaire type
          <span className="h-px flex-1 bg-white/8" />
        </h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
          {RHYTHM.map((d) => (
            <div key={d.j} className="card card-hover p-3.5">
              <div className={cn('font-display text-lg font-semibold', d.rest ? 'text-analyse' : 'text-gold')}>{d.j}</div>
              <div className="mt-0.5 text-[0.9rem] font-semibold">{d.nm}</div>
              <div className="mt-0.5 text-[0.76rem] leading-snug text-faint">{d.ds}</div>
            </div>
          ))}
        </div>
      </section>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'rounded-full border px-3.5 py-1.5 font-mono text-xs transition',
            filter === 'all' ? 'border-gold/50 bg-gold-soft text-gold-2' : 'border-white/10 text-dim hover:text-txt',
          )}
          style={filter === 'all' ? { background: 'rgba(216,176,106,.12)' } : undefined}
        >
          Tout
        </button>
        {DOMAIN_FILTERS.map((d) => {
          const active = filter === d
          return (
            <button
              key={d}
              onClick={() => setFilter(active ? 'all' : d)}
              className={cn('rounded-full border px-3.5 py-1.5 font-mono text-xs transition', active ? 'text-ink' : 'border-white/10 text-dim hover:text-txt')}
              style={active ? { background: DOMAINS[d].color, borderColor: DOMAINS[d].color } : undefined}
            >
              {DOMAINS[d].l}
            </button>
          )
        })}
      </div>

      {/* phases */}
      {PHASES.map((phase, pi) => {
        const weeks = phase.weeks.filter((w) => filter === 'all' || w.dom === filter)
        if (!weeks.length) return null
        return (
          <motion.section
            key={phase.ph}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: pi * 0.05 }}
            className="space-y-3.5"
          >
            <div className="flex flex-wrap items-baseline gap-3 pt-2">
              <span className="font-display text-2xl font-semibold tracking-tight">{phase.ph}</span>
              <span className="text-[0.92rem] text-dim">{phase.pn}</span>
            </div>
            <div className="h-px" style={{ background: 'linear-gradient(90deg,rgba(216,176,106,.25),transparent)' }} />
            <div className="space-y-3.5">
              {weeks.map((w, i) => (
                <WeekCard key={w.id} week={w} index={i} onStudyChapter={onStudyChapter} />
              ))}
            </div>
          </motion.section>
        )
      })}
    </div>
  )
}
