import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Nav, type TabId } from './components/Nav'
import { Dashboard } from './components/Dashboard'
import { Planning } from './components/Planning'
import { Flashcards } from './components/Flashcards'
import { Quiz } from './components/Quiz'
import { Stats } from './components/Stats'
import { Achievements } from './components/Achievements'
import { Celebrations } from './components/Celebrations'
import { SettingsModal } from './components/Settings'
import { Onboarding } from './components/Onboarding'
import { useTimer } from './lib/timerStore'

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [studyChapter, setStudyChapter] = useState<number | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // global 1-second timer engine (keeps the Pomodoro running across tabs)
  useEffect(() => {
    const id = window.setInterval(() => useTimer.getState().tick(), 1000)
    return () => window.clearInterval(id)
  }, [])

  // update document title with the running timer
  const running = useTimer((s) => s.running)
  const remaining = useTimer((s) => s.remaining)
  const mode = useTimer((s) => s.mode)
  useEffect(() => {
    const base = 'Maths Première · Révision Spé'
    if (running) {
      const m = String(Math.floor(remaining / 60)).padStart(2, '0')
      const s = String(remaining % 60).padStart(2, '0')
      document.title = `${m}:${s} · ${mode === 'focus' ? 'Focus' : 'Pause'}`
    } else {
      document.title = base
    }
  }, [running, remaining, mode])

  function navTo(t: TabId) {
    setStudyChapter(null)
    setTab(t)
  }
  function goStudy(chapter: number) {
    setStudyChapter(chapter)
    setTab('cards')
  }
  function goQuiz(chapter: number) {
    setStudyChapter(chapter)
    setTab('quiz')
  }

  return (
    <>
      <Onboarding />
      <Celebrations />
      <Nav tab={tab} setTab={navTo} onSettings={() => setSettingsOpen(true)} />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'home' && <Dashboard goTo={navTo} studyChapter={goStudy} />}
            {tab === 'plan' && <Planning onStudyChapter={goStudy} />}
            {tab === 'cards' && <Flashcards initialChapter={studyChapter} />}
            {tab === 'quiz' && <Quiz initialChapter={studyChapter} />}
            {tab === 'stats' && <Stats />}
            {tab === 'badges' && <Achievements />}
          </motion.div>
        </AnimatePresence>

        <Footer onQuiz={() => goQuiz(11)} />
      </main>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}

function Footer({ onQuiz }: { onQuiz: () => void }) {
  return (
    <footer className="mt-14 border-t border-white/8 pt-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Tip title="↻ Répétition espacée">
          Chaque dimanche : <span className="font-mono text-gold-2">30 min</span> de brouillon chronométré sur 2–3 exercices des semaines précédentes.
        </Tip>
        <Tip title="🎯 Les 4 jalons">
          DS n°1 fin juin (Ch.2–4) · DS n°2 fin juillet (Ch.5–8) · DS n°3 mi-août (Ch.9–11) · <b className="text-gold-2">bac blanc</b> fin août.
        </Tip>
        <Tip title="📕 Dans ton manuel">
          « Entraînement au BAC » <span className="font-mono text-gold-2">p.322</span> · « Corrigés » <span className="font-mono text-gold-2">p.326</span> · « Logique » <span className="font-mono text-gold-2">p.308</span>.
        </Tip>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2 text-center">
        <button onClick={onQuiz} className="font-mono text-[0.7rem] text-faint transition hover:text-gold-2">
          06 / 06 / 2026 → 01 / 09 / 2026 · <b className="text-gold">Objectif : prêt pour la Terminale</b>
        </button>
      </div>
    </footer>
  )
}

function Tip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card p-4">
      <h4 className="font-display text-[1.02rem] font-semibold text-gold-2">{title}</h4>
      <p className="mt-1.5 text-[0.84rem] leading-relaxed text-dim">{children}</p>
    </div>
  )
}
