import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, RotateCw, Check, X, Shuffle, Lightbulb } from 'lucide-react'
import { CHAPTER_WEEKS, DOMAINS } from '../data/curriculum'
import { FLASHCARDS, flashcardsForChapter } from '../data/flashcards'
import { useStore } from '../store'
import { RichText } from './Math'
import { sfx } from '../lib/sound'
import { shuffle } from '../lib/utils'
import type { Flashcard } from '../types'

const CHAPTERS = CHAPTER_WEEKS.filter((w) => flashcardsForChapter(w.chapter as number).length > 0).map((w) => ({
  chapter: w.chapter as number,
  title: w.titre,
  ch: w.ch,
  dom: w.dom,
}))

export function Flashcards({ initialChapter }: { initialChapter?: number | null }) {
  const [selected, setSelected] = useState<number | 'all' | null>(initialChapter ?? null)

  useEffect(() => {
    if (initialChapter != null) setSelected(initialChapter)
  }, [initialChapter])

  if (selected === null) {
    return (
      <div className="space-y-5">
        <Header />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => setSelected('all')}
            className="card card-hover flex items-center gap-3 p-5 text-left"
            style={{ background: 'rgba(216,176,106,.06)', borderColor: 'rgba(216,176,106,.25)' }}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-2" style={{ background: 'rgba(216,176,106,.14)' }}>
              <Shuffle size={20} />
            </span>
            <div>
              <div className="font-display text-lg font-semibold">Révision mélangée</div>
              <div className="text-[0.84rem] text-dim">Les {FLASHCARDS.length} cartes, tous chapitres confondus</div>
            </div>
          </button>
          {CHAPTERS.map((c) => {
            const n = flashcardsForChapter(c.chapter).length
            return (
              <button key={c.chapter} onClick={() => setSelected(c.chapter)} className="card card-hover flex items-center gap-3 p-5 text-left">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-lg font-semibold" style={{ background: 'rgba(255,255,255,.04)', color: DOMAINS[c.dom].color }}>
                  {c.chapter}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-display text-base font-semibold">{c.title}</div>
                  <div className="font-mono text-[0.72rem] text-faint">
                    {c.ch} · {n} cartes
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return <Deck selection={selected} onBack={() => setSelected(null)} />
}

function Header() {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Flashcards</h2>
      <p className="mt-1 text-[0.92rem] text-dim">
        Récupération active : essaie de répondre <em>avant</em> de retourner la carte. C’est l’effort de rappel qui ancre la formule.
      </p>
    </div>
  )
}

function Deck({ selection, onBack }: { selection: number | 'all'; onBack: () => void }) {
  const review = useStore((s) => s.reviewFlashcard)
  const soundOn = useStore((s) => s.settings.sound)

  const deck = useMemo<Flashcard[]>(
    () => shuffle(selection === 'all' ? FLASHCARDS : flashcardsForChapter(selection)),
    [selection],
  )

  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [hint, setHint] = useState(false)
  const [known, setKnown] = useState(0)
  const [done, setDone] = useState(false)

  const card = deck[i]

  function rate(ok: boolean) {
    review(card.id, ok)
    if (ok) setKnown((k) => k + 1)
    if (soundOn) (ok ? sfx.correct : sfx.tick)()
    if (i + 1 >= deck.length) {
      setDone(true)
    } else {
      setI((x) => x + 1)
      setFlipped(false)
      setHint(false)
    }
  }

  function restart() {
    setI(0)
    setFlipped(false)
    setHint(false)
    setKnown(0)
    setDone(false)
  }

  function flip() {
    setFlipped((f) => !f)
    if (soundOn) sfx.flip()
  }

  if (done) {
    const pct = Math.round((known / deck.length) * 100)
    return (
      <div className="space-y-5">
        <BackBar onBack={onBack} />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
          <div className="text-5xl">{pct >= 80 ? '🌟' : pct >= 50 ? '👏' : '💪'}</div>
          <h3 className="mt-3 font-display text-2xl font-semibold">Deck terminé !</h3>
          <p className="mt-2 text-dim">
            Tu as marqué <b className="text-gold-2">{known}</b> / {deck.length} cartes comme acquises ({pct}%).
          </p>
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

      {/* progress */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-3">
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,var(--color-gold),var(--color-gold-2))' }} animate={{ width: `${(i / deck.length) * 100}%` }} />
        </div>
        <span className="font-mono text-xs text-faint">
          {i + 1} / {deck.length}
        </span>
      </div>

      {/* card */}
      <div className="[perspective:1600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
          >
            <button onClick={flip} className="block w-full text-left [transform-style:preserve-3d]" style={{ minHeight: 280 }}>
              <motion.div className="relative w-full [transform-style:preserve-3d]" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }} style={{ minHeight: 280 }}>
                {/* front */}
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-ink-2 p-8 text-center [backface-visibility:hidden]" style={{ minHeight: 280 }}>
                  <span className="absolute left-5 top-4 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-faint">Question</span>
                  <div className="text-xl leading-relaxed sm:text-2xl">
                    <RichText text={card.front} />
                  </div>
                  {card.hint && (
                    <div className="absolute bottom-4 left-0 right-0 px-6">
                      {hint ? (
                        <p className="text-[0.8rem] text-gold-2/80">
                          <Lightbulb size={13} className="mr-1 inline" />
                          <RichText text={card.hint} />
                        </p>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setHint(true)
                          }}
                          className="inline-flex items-center gap-1 font-mono text-[0.7rem] text-faint transition hover:text-gold-2"
                        >
                          <Lightbulb size={12} /> indice
                        </button>
                      )}
                    </div>
                  )}
                  <span className="absolute bottom-4 right-5 font-mono text-[0.62rem] text-faint">appuyer pour retourner ↻</span>
                </div>
                {/* back */}
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-gold/25 p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ minHeight: 280, background: 'rgba(216,176,106,.05)' }}>
                  <span className="absolute left-5 top-4 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-gold-2/70">Réponse</span>
                  <div className="text-xl leading-relaxed text-gold-2 sm:text-2xl">
                    <RichText text={card.back} />
                  </div>
                </div>
              </motion.div>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* actions */}
      <AnimatePresence>
        {flipped ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
            <button onClick={() => rate(false)} className="flex items-center justify-center gap-2 rounded-xl border border-ds/30 py-3 font-semibold text-rose-200 transition hover:bg-ds/10" style={{ background: 'rgba(251,113,133,.05)' }}>
              <X size={18} /> À revoir
            </button>
            <button onClick={() => rate(true)} className="flex items-center justify-center gap-2 rounded-xl border border-algebre/30 py-3 font-semibold text-emerald-200 transition hover:bg-algebre/10" style={{ background: 'rgba(110,231,183,.05)' }}>
              <Check size={18} /> Acquis
            </button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={flip}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 py-3 font-semibold text-dim transition hover:text-txt"
          >
            <RotateCw size={17} /> Voir la réponse
          </motion.button>
        )}
      </AnimatePresence>
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
