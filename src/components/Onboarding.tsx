import { motion } from 'framer-motion'
import { CalendarDays, Brain, ListChecks, Trophy, Zap } from 'lucide-react'
import { useStore } from '../store'

const FEATURES = [
  { icon: CalendarDays, title: 'Planning sur 12 semaines', desc: 'Coche chaque sous-partie, calée sur les pages exactes du manuel Belin.' },
  { icon: Brain, title: 'Flashcards & quiz', desc: 'Mémorise les formules par rappel actif et auto-évalue-toi chapitre par chapitre.' },
  { icon: Zap, title: 'XP, niveaux & séries', desc: 'Gagne de l’XP, monte de niveau et entretiens ta série de jours consécutifs.' },
  { icon: Trophy, title: 'Succès à débloquer', desc: 'Plus de 20 badges pour récompenser ta régularité — et quelques secrets.' },
]

export function Onboarding() {
  const onboarded = useStore((s) => s.onboarded)
  const setOnboarded = useStore((s) => s.setOnboarded)
  if (onboarded) return null

  return (
    <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="card w-full max-w-lg overflow-hidden"
      >
        <div className="relative px-7 pt-8 pb-6 text-center" style={{ background: 'radial-gradient(80% 100% at 50% 0%, rgba(216,176,106,.14), transparent 70%)' }}>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl font-display text-3xl font-bold text-gold-2" style={{ background: 'rgba(216,176,106,.14)', border: '1px solid rgba(216,176,106,.3)' }}>
            ∑
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Maths · Première Spé</h1>
          <p className="mt-1.5 text-[0.92rem] text-dim">
            Ta révision d’été, transformée en jeu. Tout le programme, du 6 juin au 1ᵉʳ septembre.
          </p>
        </div>

        <div className="grid gap-3 px-7 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-white/8 bg-ink-3/50 p-4">
              <f.icon size={19} className="text-gold-2" />
              <div className="mt-2 text-sm font-semibold">{f.title}</div>
              <div className="mt-1 text-[0.78rem] leading-snug text-faint">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className="p-7 pt-5">
          <button
            onClick={() => setOnboarded(true)}
            className="w-full rounded-xl py-3.5 font-display text-lg font-semibold text-ink transition active:scale-[0.99]"
            style={{ background: 'linear-gradient(180deg,var(--color-gold-2),var(--color-gold))' }}
          >
            C’est parti 🚀
          </button>
          <p className="mt-3 text-center font-mono text-[0.66rem] text-faint">
            <ListChecks size={11} className="mr-1 inline" /> Aucune inscription · progression sauvegardée sur cet appareil
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
