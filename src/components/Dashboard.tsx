import { motion } from 'framer-motion'
import { Flame, Zap, Target, ArrowRight, Brain, ListChecks, CalendarDays, BookOpen, Trophy } from 'lucide-react'
import { useStore, useLevel, selectContext, TOTAL_TOPICS } from '../store'
import { ALL_WEEKS, MILESTONES, DOMAINS, PLAN_END } from '../data/curriculum'
import { ACHIEVEMENTS } from '../lib/achievements'
import { Ring } from './ui/Ring'
import { Bar } from './ui/Bar'
import { Pomodoro } from './Pomodoro'
import { dayKey, daysBetween, relativeDays, cn } from '../lib/utils'
import type { TabId } from './Nav'

export function Dashboard({
  goTo,
  studyChapter,
}: {
  goTo: (t: TabId) => void
  studyChapter: (chapter: number) => void
}) {
  const s = useStore()
  const level = useLevel()
  const ctx = selectContext(s)

  const today = dayKey()
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  const daysLeft = Math.max(0, daysBetween(today, PLAN_END))
  const dailyXp = s.dailyXp[today] ?? 0
  const goalProgress = s.dailyGoal > 0 ? dailyXp / s.dailyGoal : 0
  const goalDone = dailyXp >= s.dailyGoal

  const currentWeek =
    ALL_WEEKS.find((w) => now >= new Date(w.start + 'T00:00:00') && now <= new Date(w.end + 'T23:59:59')) ??
    ALL_WEEKS.find((w) => new Date(w.start + 'T00:00:00') > now) ??
    ALL_WEEKS[ALL_WEEKS.length - 1]

  const cwDone = currentWeek.topics.filter((t) => s.topics[t.id]).length
  const cwDom = DOMAINS[currentWeek.dom]

  const nextMilestone = MILESTONES.find((m) => daysBetween(today, m.date) >= 0) ?? MILESTONES[MILESTONES.length - 1]

  const unlockedAch = ACHIEVEMENTS.filter((a) => s.unlocked[a.id])
  const globalPct = TOTAL_TOPICS ? Math.round((ctx.doneTopics / TOTAL_TOPICS) * 100) : 0

  return (
    <div className="space-y-5">
      {/* hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-gold">Programme intensif · été 2026</div>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {greeting} — il reste <span className="gold-text">{daysLeft} jours</span>
          <br className="hidden sm:block" /> avant la Terminale.
        </h1>
      </motion.div>

      {/* top row: level + daily goal + streak */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* level */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5 lg:col-span-2">
          <div className="flex items-center gap-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-display text-2xl font-bold text-gold-2" style={{ background: 'rgba(216,176,106,.12)', border: '1px solid rgba(216,176,106,.3)' }}>
              {level.level}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="font-display text-xl font-semibold">{level.title}</span>
                <span className="flex items-center gap-1 font-mono text-xs text-gold-2">
                  <Zap size={13} /> {s.xp.toLocaleString('fr-FR')} XP
                </span>
              </div>
              <div className="mt-2.5">
                <Bar progress={level.progress} height={9} />
              </div>
              <div className="mt-2 font-mono text-[0.72rem] text-faint">
                {level.xpToNext} XP avant <span className="text-dim">{level.nextTitle}</span> (niv. {level.level + 1})
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/8 pt-4">
            <Mini label="Programme" value={`${globalPct}%`} sub={`${ctx.doneTopics}/${TOTAL_TOPICS}`} />
            <Mini label="Chapitres" value={`${ctx.completedChapters}/11`} sub="terminés" />
            <Mini label="Succès" value={`${unlockedAch.length}/${ACHIEVEMENTS.length}`} sub="débloqués" />
          </div>
        </motion.div>

        {/* daily goal + streak */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card flex flex-col items-center justify-center p-5">
          <Ring progress={goalProgress} size={128} stroke={11} color={goalDone ? 'var(--color-algebre)' : 'var(--color-gold)'}>
            <div>
              <div className="font-display text-2xl font-semibold">{dailyXp}</div>
              <div className="font-mono text-[0.62rem] uppercase tracking-wide text-faint">/ {s.dailyGoal} XP</div>
            </div>
          </Ring>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Target size={15} className={goalDone ? 'text-algebre' : 'text-gold'} />
            <span className={goalDone ? 'text-emerald-200' : 'text-dim'}>{goalDone ? 'Objectif atteint !' : 'Objectif du jour'}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-xs text-orange-300">
            <Flame size={13} className={s.streak > 0 ? 'fill-orange-400/30' : ''} /> série de {s.streak} jour{s.streak > 1 ? 's' : ''}
          </div>
        </motion.div>
      </div>

      {/* focus of the day + pomodoro */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-faint">À réviser maintenant</span>
            <span className="font-mono text-[0.7rem]" style={{ color: cwDom.color }}>{cwDom.l}</span>
          </div>
          <div className="mt-2 font-mono text-[0.72rem]" style={{ color: cwDom.color }}>{currentWeek.ch}</div>
          <h3 className="mt-0.5 font-display text-2xl font-semibold leading-tight">{currentWeek.titre}</h3>
          <div className="mt-1 font-mono text-xs text-faint">{currentWeek.dates}</div>

          <div className="mt-3">
            <Bar progress={currentWeek.topics.length ? cwDone / currentWeek.topics.length : 0} height={7} color={cwDom.color} glow={false} />
            <div className="mt-1.5 font-mono text-[0.7rem] text-faint">
              {cwDone}/{currentWeek.topics.length} sous-parties
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => goTo('plan')} className="flex items-center gap-2 rounded-xl border border-white/12 px-4 py-2 text-sm font-medium text-dim transition hover:border-white/25 hover:text-txt">
              <CalendarDays size={15} /> Ouvrir le planning
            </button>
            {currentWeek.chapter !== null && (
              <>
                <button onClick={() => studyChapter(currentWeek.chapter as number)} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-ink" style={{ background: 'linear-gradient(180deg,var(--color-gold-2),var(--color-gold))' }}>
                  <Brain size={15} /> Réviser ce chapitre
                </button>
              </>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Pomodoro />
        </motion.div>
      </div>

      {/* quick actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction icon={Brain} label="Flashcards" sub="rappel actif" onClick={() => goTo('cards')} />
        <QuickAction icon={ListChecks} label="Quiz" sub="auto-éval" onClick={() => goTo('quiz')} />
        <QuickAction icon={BookOpen} label="Planning" sub="12 semaines" onClick={() => goTo('plan')} />
        <QuickAction icon={Trophy} label="Succès" sub={`${unlockedAch.length} obtenus`} onClick={() => goTo('badges')} />
      </div>

      {/* next milestone */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="card flex items-center gap-4 p-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl" style={{ background: 'rgba(251,113,133,.1)' }}>
          🎯
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[0.68rem] uppercase tracking-wide text-faint">Prochaine échéance</div>
          <div className="font-display text-lg font-semibold">
            {nextMilestone.label} <span className="text-dim">· {nextMilestone.detail}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-lg font-semibold text-gold-2">{relativeDays(nextMilestone.date, today)}</div>
        </div>
      </motion.div>

      {/* recent achievements */}
      {unlockedAch.length > 0 && (
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Derniers succès</h3>
            <button onClick={() => goTo('badges')} className="flex items-center gap-1 font-mono text-xs text-dim transition hover:text-gold-2">
              tout voir <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {unlockedAch.slice(-8).map((a) => (
              <div key={a.id} className="flex items-center gap-2 rounded-full border border-gold/20 px-3 py-1.5 text-sm" style={{ background: 'rgba(216,176,106,.06)' }} title={a.desc}>
                <span>{a.icon}</span>
                <span className="text-[0.82rem] text-gold-2">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Mini({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div className="font-mono text-[0.62rem] uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-0.5 font-display text-lg font-semibold leading-none">{value}</div>
      <div className="mt-0.5 font-mono text-[0.62rem] text-faint">{sub}</div>
    </div>
  )
}

function QuickAction({ icon: Icon, label, sub, onClick }: { icon: typeof Brain; label: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn('card card-hover flex flex-col items-start gap-2 p-4 text-left')}>
      <span className="grid h-10 w-10 place-items-center rounded-xl text-gold-2" style={{ background: 'rgba(216,176,106,.1)' }}>
        <Icon size={18} />
      </span>
      <div>
        <div className="font-semibold leading-tight">{label}</div>
        <div className="font-mono text-[0.66rem] text-faint">{sub}</div>
      </div>
    </button>
  )
}
