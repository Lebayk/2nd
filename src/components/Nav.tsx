import { motion } from 'framer-motion'
import { Home, CalendarDays, Layers, ListChecks, BarChart3, Trophy, Flame, Settings } from 'lucide-react'
import { useLevel, useStore } from '../store'
import { cn } from '../lib/utils'

export type TabId = 'home' | 'plan' | 'cards' | 'quiz' | 'stats' | 'badges'

export const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'plan', label: 'Planning', icon: CalendarDays },
  { id: 'cards', label: 'Réviser', icon: Layers },
  { id: 'quiz', label: 'Quiz', icon: ListChecks },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'badges', label: 'Succès', icon: Trophy },
]

export function Nav({
  tab,
  setTab,
  onSettings,
}: {
  tab: TabId
  setTab: (t: TabId) => void
  onSettings: () => void
}) {
  const level = useLevel()
  const streak = useStore((s) => s.streak)

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        {/* brand */}
        <button onClick={() => setTab('home')} className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-gold/30 bg-gold-soft font-display text-lg font-semibold text-gold-2" style={{ background: 'rgba(216,176,106,.12)' }}>
            ∑
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block font-display text-[0.95rem] font-semibold">Maths · Première</span>
            <span className="block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint">Révision Spé · Belin</span>
          </span>
        </button>

        <div className="flex-1" />

        {/* streak */}
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs',
            streak > 0 ? 'border-orange-400/30 text-orange-300' : 'border-white/10 text-faint',
          )}
          style={streak > 0 ? { background: 'rgba(251,146,60,.08)' } : undefined}
          title={`Série de ${streak} jour${streak > 1 ? 's' : ''}`}
        >
          <Flame size={14} className={streak > 0 ? 'fill-orange-400/30' : ''} />
          <b className="font-semibold">{streak}</b>
        </div>

        {/* level chip */}
        <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-ink-2 px-3 py-1.5 sm:flex">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-gold-soft font-mono text-xs font-bold text-gold-2" style={{ background: 'rgba(216,176,106,.14)' }}>
            {level.level}
          </div>
          <div className="leading-tight">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold text-txt">{level.title}</span>
              <span className="font-mono text-[0.6rem] text-faint">{level.xpToNext} XP</span>
            </div>
            <div className="mt-1 h-1 w-28 overflow-hidden rounded-full bg-ink-3">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,var(--color-gold),var(--color-gold-2))' }}
                animate={{ width: `${level.progress * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={onSettings}
          className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-ink-2 text-dim transition hover:border-white/20 hover:text-txt"
          title="Réglages"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* tabs */}
      <nav className="mx-auto max-w-5xl px-2 sm:px-5">
        <div className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  'relative flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition',
                  active ? 'text-ink' : 'text-dim hover:text-txt',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'linear-gradient(180deg,var(--color-gold-2),var(--color-gold))' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon size={15} className="relative z-10" />
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
