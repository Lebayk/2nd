import { AnimatePresence, motion } from 'framer-motion'
import { X, Volume2, Sparkles, Target, Trash2 } from 'lucide-react'
import { useStore } from '../store'
import { cn } from '../lib/utils'

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = useStore((s) => s.settings)
  const toggle = useStore((s) => s.toggleSetting)
  const dailyGoal = useStore((s) => s.dailyGoal)
  const setDailyGoal = useStore((s) => s.setDailyGoal)
  const reset = useStore((s) => s.resetProgress)

  function confirmReset() {
    if (window.confirm('Réinitialiser TOUTE ta progression (XP, niveaux, succès, cases cochées) ? Action irréversible.')) {
      reset()
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Réglages</h2>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-dim transition hover:text-txt">
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              <Toggle icon={Volume2} label="Sons" desc="Effets sonores subtils" on={settings.sound} onClick={() => toggle('sound')} />
              <Toggle icon={Sparkles} label="Confettis" desc="Animations de célébration" on={settings.confetti} onClick={() => toggle('confetti')} />
            </div>

            <div className="mt-5 rounded-xl border border-white/8 p-4">
              <div className="flex items-center gap-2.5">
                <Target size={17} className="text-gold-2" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">Objectif quotidien</div>
                  <div className="font-mono text-[0.7rem] text-faint">{dailyGoal} XP par jour (~{Math.round(dailyGoal / 15)} sous-parties)</div>
                </div>
                <span className="font-display text-lg font-semibold text-gold-2">{dailyGoal}</span>
              </div>
              <input
                type="range"
                min={15}
                max={150}
                step={15}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="mt-3 w-full accent-[var(--color-gold)]"
              />
            </div>

            <button
              onClick={confirmReset}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-ds/30 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-ds/10"
            >
              <Trash2 size={15} /> Réinitialiser la progression
            </button>

            <p className="mt-4 text-center font-mono text-[0.66rem] text-faint">
              Tout est sauvegardé localement dans ton navigateur · Maths Première Spé · Belin
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Toggle({ icon: Icon, label, desc, on, onClick }: { icon: typeof Volume2; label: string; desc: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-white/8 px-4 py-3 text-left transition hover:border-white/15">
      <Icon size={17} className={on ? 'text-gold-2' : 'text-faint'} />
      <div className="flex-1">
        <div className="text-sm font-semibold">{label}</div>
        <div className="font-mono text-[0.7rem] text-faint">{desc}</div>
      </div>
      <span className={cn('relative h-6 w-11 rounded-full transition', on ? 'bg-gold' : 'bg-ink-4')}>
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-all', on ? 'left-[22px]' : 'left-0.5')} />
      </span>
    </button>
  )
}
