import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, X, ChevronRight, RotateCw, Trophy } from 'lucide-react'
import { CHAPTER_WEEKS, DOMAINS } from '../data/curriculum'
import { quizForChapter } from '../data/quizzes'
import { useStore } from '../store'
import { RichText } from './Math'
import { sfx } from '../lib/sound'
import { cn, shuffle } from '../lib/utils'
import type { QuizQuestion } from '../types'

const CHAPTERS = CHAPTER_WEEKS.filter((w) => quizForChapter(w.chapter as number).length > 0).map((w) => ({
  chapter: w.chapter as number,
  title: w.titre,
  ch: w.ch,
  dom: w.dom,
}))

export function Quiz({ initialChapter }: { initialChapter?: number | null }) {
  const [selected, setSelected] = useState<number | null>(initialChapter ?? null)
  const quizBest = useStore((s) => s.quizBest)

  useEffect(() => {
    if (initialChapter != null) setSelected(initialChapter)
  }, [initialChapter])

  if (selected === null) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-display text-2xl font-semibold">Quiz d’auto-évaluation</h2>
          <p className="mt-1 text-[0.92rem] text-dim">Un QCM rapide par chapitre. Vise au moins 60 % pour valider — 100 % pour le badge.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CHAPTERS.map((c) => {
            const n = quizForChapter(c.chapter).length
            const best = quizBest[c.chapter]
            return (
              <button key={c.chapter} onClick={() => setSelected(c.chapter)} className="card card-hover flex items-center gap-3 p-5 text-left">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-lg font-semibold" style={{ background: 'rgba(255,255,255,.04)', color: DOMAINS[c.dom].color }}>
                  {c.chapter}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-base font-semibold">{c.title}</div>
                  <div className="font-mono text-[0.72rem] text-faint">
                    {c.ch} · {n} questions
                  </div>
                </div>
                {best != null && (
                  <span className={cn('shrink-0 rounded-lg px-2 py-1 font-mono text-xs', best === 100 ? 'text-gold-2' : best >= 60 ? 'text-emerald-200' : 'text-dim')} style={{ background: 'rgba(255,255,255,.04)' }}>
                    {best}%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return <Runner chapter={selected} onBack={() => setSelected(null)} />
}

function Runner({ chapter, onBack }: { chapter: number; onBack: () => void }) {
  const submit = useStore((s) => s.submitQuiz)
  const prevBest = useStore((s) => s.quizBest[chapter])
  const soundOn = useStore((s) => s.settings.sound)

  const questions = useMemo<QuizQuestion[]>(() => shuffle(quizForChapter(chapter)), [chapter])

  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const q = questions[i]

  function choose(idx: number) {
    if (picked !== null) return
    setPicked(idx)
    const ok = idx === q.answer
    if (ok) setCorrect((c) => c + 1)
    if (soundOn) (ok ? sfx.correct : sfx.wrong)()
  }

  function next() {
    if (i + 1 >= questions.length) {
      if (!submitted) {
        submit(chapter, correct, questions.length)
        setSubmitted(true)
      }
      setFinished(true)
    } else {
      setI((x) => x + 1)
      setPicked(null)
    }
  }

  function restart() {
    setI(0)
    setPicked(null)
    setCorrect(0)
    setFinished(false)
    setSubmitted(false)
  }

  if (finished) {
    const pct = Math.round((correct / questions.length) * 100)
    const passed = pct >= 60
    const perfect = correct === questions.length
    return (
      <div className="space-y-5">
        <BackBar onBack={onBack} />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
          <div className="text-5xl">{perfect ? '💯' : passed ? '✅' : '📚'}</div>
          <h3 className="mt-3 font-display text-2xl font-semibold">{perfect ? 'Sans faute !' : passed ? 'Chapitre validé' : 'À retravailler'}</h3>
          <div className="mt-4 font-display text-5xl font-semibold text-gold-2">
            {correct}
            <span className="text-2xl text-faint">/{questions.length}</span>
          </div>
          <p className="mt-2 text-dim">{pct}% de bonnes réponses</p>
          {prevBest != null && prevBest > pct && (
            <p className="mt-1 font-mono text-xs text-faint">Meilleur score : {prevBest}%</p>
          )}
          {!passed && <p className="mx-auto mt-3 max-w-sm text-[0.86rem] text-dim">Revois les flashcards du chapitre, puis retente. La répétition paie.</p>}
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={restart} className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-ink" style={{ background: 'linear-gradient(180deg,var(--color-gold-2),var(--color-gold))' }}>
              <RotateCw size={16} /> Recommencer
            </button>
            <button onClick={onBack} className="rounded-xl border border-white/12 px-5 py-2.5 font-semibold text-dim transition hover:text-txt">
              Autres chapitres
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BackBar onBack={onBack} />

      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-3">
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,var(--color-gold),var(--color-gold-2))' }} animate={{ width: `${(i / questions.length) * 100}%` }} />
        </div>
        <span className="font-mono text-xs text-faint">
          {i + 1} / {questions.length}
        </span>
        <span className="flex items-center gap-1 font-mono text-xs text-gold-2">
          <Trophy size={12} /> {correct}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}>
          <div className="card p-6">
            <div className="text-lg leading-relaxed sm:text-xl">
              <RichText text={q.q} />
            </div>

            <div className="mt-5 grid gap-2.5">
              {q.choices.map((choice, idx) => {
                const isAnswer = idx === q.answer
                const isPicked = idx === picked
                const reveal = picked !== null
                return (
                  <button
                    key={idx}
                    onClick={() => choose(idx)}
                    disabled={reveal}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition',
                      !reveal && 'border-white/10 hover:border-gold/40 hover:bg-white/[0.03]',
                      reveal && isAnswer && 'border-algebre/50',
                      reveal && isPicked && !isAnswer && 'border-ds/50',
                      reveal && !isAnswer && !isPicked && 'border-white/8 opacity-55',
                    )}
                    style={reveal && isAnswer ? { background: 'rgba(110,231,183,.08)' } : reveal && isPicked && !isAnswer ? { background: 'rgba(251,113,133,.08)' } : undefined}
                  >
                    <span className={cn('text-[0.96rem]', reveal && isAnswer ? 'text-emerald-100' : reveal && isPicked ? 'text-rose-100' : 'text-txt')}>
                      <RichText text={choice} />
                    </span>
                    {reveal && isAnswer && <Check size={18} className="shrink-0 text-algebre" />}
                    {reveal && isPicked && !isAnswer && <X size={18} className="shrink-0 text-ds" />}
                  </button>
                )
              })}
            </div>

            <AnimatePresence>
              {picked !== null && q.explain && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                  <div className="mt-4 rounded-xl border border-white/10 bg-ink-3 px-4 py-3 text-[0.88rem] text-dim">
                    <b className="text-txt">Explication. </b>
                    <RichText text={q.explain} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {picked !== null && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={next}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-ink"
          style={{ background: 'linear-gradient(180deg,var(--color-gold-2),var(--color-gold))' }}
        >
          {i + 1 >= questions.length ? 'Voir le résultat' : 'Question suivante'} <ChevronRight size={18} />
        </motion.button>
      )}
    </div>
  )
}

function BackBar({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="flex items-center gap-2 font-mono text-xs text-dim transition hover:text-txt">
      <ArrowLeft size={14} /> chapitres
    </button>
  )
}
