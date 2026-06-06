import { motion } from 'framer-motion'
import { BookOpen, PenLine, Target, Sparkles, Brain } from 'lucide-react'
import type { Week } from '../types'
import { DOMAINS } from '../data/curriculum'
import { useStore } from '../store'
import { popAt } from '../lib/confetti'
import { sfx } from '../lib/sound'
import { RichText } from './Math'
import { cn } from '../lib/utils'

const NOTE_STYLE: Record<string, string> = {
  ok: 'border-algebre/30 text-emerald-200',
  tip: 'border-gold/25 text-gold-2',
  py: 'border-python/30 text-yellow-200',
}
const NOTE_BG: Record<string, string> = {
  ok: 'rgba(110,231,183,.06)',
  tip: 'rgba(216,176,106,.08)',
  py: 'rgba(252,211,77,.06)',
}

export function WeekCard({
  week,
  index,
  onStudyChapter,
}: {
  week: Week
  index: number
  onStudyChapter?: (chapter: number) => void
}) {
  const topicsState = useStore((s) => s.topics)
  const toggle = useStore((s) => s.toggleTopic)
  const soundOn = useStore((s) => s.settings.sound)

  const dom = DOMAINS[week.dom]
  const done = week.topics.filter((t) => topicsState[t.id]).length
  const total = week.topics.length
  const allDone = done === total && total > 0

  const now = new Date()
  const isCurrent =
    now >= new Date(week.start + 'T00:00:00') && now <= new Date(week.end + 'T23:59:59')

  const wnLabel =
    week.kind === 'final' ? '✦' : week.kind === 'express' ? 'PRÉ' : String(week.n)

  function handleToggle(id: string, el: Element | null) {
    const wasChecked = !!topicsState[id]
    toggle(id)
    if (!wasChecked) {
      if (soundOn) sfx.check()
      popAt(el)
    } else if (soundOn) {
      sfx.tick()
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.3) }}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border bg-ink-2 transition-colors sm:flex-row',
        isCurrent ? 'border-gold' : 'border-white/8 hover:border-white/15',
        allDone && !isCurrent && 'opacity-70 hover:opacity-100',
        week.kind === 'express' && 'border-dashed',
      )}
      style={
        isCurrent ? { boxShadow: '0 0 0 1px rgba(216,176,106,.2), 0 10px 50px rgba(216,176,106,.08)' } : undefined
      }
    >
      {/* rail */}
      <div className="relative flex shrink-0 flex-row items-center gap-3 border-b border-white/8 bg-white/[0.012] px-5 py-4 sm:w-[150px] sm:flex-col sm:items-start sm:border-r sm:border-b-0">
        {isCurrent && (
          <span className="absolute right-3 top-3 rounded-md px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-gold-2" style={{ background: 'rgba(216,176,106,.14)' }}>
            en cours
          </span>
        )}
        <div>
          {week.kind === 'normal' && <div className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-faint">Sem</div>}
          <div className="font-display text-4xl font-semibold leading-none" style={{ color: dom.color }}>
            {wnLabel}
          </div>
        </div>
        <div className="sm:mt-1">
          <div className="font-mono text-xs text-dim">{week.dates}</div>
          <div className="mt-1 font-mono text-[0.7rem] text-faint">
            {done} / {total}
          </div>
        </div>
        <div
          className="ml-auto font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] sm:ml-0 sm:mt-auto sm:pt-2"
          style={{ color: dom.color }}
        >
          {dom.l}
        </div>
      </div>

      {/* body */}
      <div className="min-w-0 flex-1 px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.1em]" style={{ color: dom.color }}>
              {week.ch}
            </div>
            <h3 className="mt-0.5 font-display text-xl font-semibold leading-tight">{week.titre}</h3>
          </div>
          {week.chapter !== null && onStudyChapter && (
            <button
              onClick={() => onStudyChapter(week.chapter as number)}
              className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-ink-3 px-2.5 py-1.5 font-mono text-[0.68rem] text-dim transition hover:border-gold/40 hover:text-gold-2 sm:flex"
              title="Flashcards & quiz de ce chapitre"
            >
              <Brain size={13} /> Réviser
            </button>
          )}
        </div>

        {(week.pg || week.exo) && (
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.72rem] text-faint">
            {week.pg && (
              <span className="inline-flex items-center gap-1.5">
                <BookOpen size={12} /> cours {week.pg}
              </span>
            )}
            {week.exo && (
              <span className="inline-flex items-center gap-1.5 text-gold-2">
                <PenLine size={12} /> exercices {week.exo}
              </span>
            )}
          </div>
        )}

        <ul className="mt-3 flex flex-col gap-0.5">
          {week.topics.map((t) => {
            const checked = !!topicsState[t.id]
            return (
              <li key={t.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 transition hover:bg-white/[0.025]">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={(e) => handleToggle(t.id, (e.currentTarget.closest('label') as Element))}
                  />
                  <span
                    className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border-[1.5px] transition"
                    style={{
                      borderColor: checked ? dom.color : 'rgba(255,255,255,.18)',
                      background: checked ? dom.color : 'transparent',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" className={cn('transition', checked ? 'scale-100' : 'scale-0')}>
                      <path d="M1.5 5.5L4 8L9.5 2.5" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className={cn('flex-1 text-[0.92rem] transition', checked ? 'text-faint line-through decoration-faint' : 'text-txt')}>
                    {t.t}
                  </span>
                  {t.p && t.p !== '—' && (
                    <span className="shrink-0 pl-2 font-mono text-[0.7rem] text-faint">p.{t.p}</span>
                  )}
                </label>
              </li>
            )
          })}
        </ul>

        {week.note && (
          <div
            className={cn('mt-3 flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-[0.84rem]', NOTE_STYLE[week.note.k])}
            style={{ background: NOTE_BG[week.note.k] }}
          >
            <Sparkles size={15} className="mt-0.5 shrink-0" />
            <RichText text={week.note.t} />
          </div>
        )}

        {week.ds && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-dashed border-ds/40 px-3.5 py-2.5" style={{ background: 'rgba(251,113,133,.06)' }}>
            <Target size={16} className="mt-0.5 shrink-0 text-ds" />
            <div className="text-[0.86rem] text-rose-200">
              <b className="block font-mono text-[0.7rem] uppercase tracking-wide text-ds">DS blanc</b>
              {week.ds}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  )
}
