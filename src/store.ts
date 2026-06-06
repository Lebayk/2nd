import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { serverStorage } from './lib/serverStorage'
import { ALL_TOPIC_IDS, CHAPTER_WEEKS, ALL_WEEKS } from './data/curriculum'
import { ACHIEVEMENTS } from './lib/achievements'
import { levelFromXp, XP } from './lib/levels'
import { dayKey, daysBetween, isWeekend, clamp } from './lib/utils'
import type { AchievementContext, DomainKey } from './types'

export interface Celebration {
  id: string
  kind: 'achievement' | 'levelup' | 'chapter' | 'goal' | 'finish'
  title: string
  subtitle?: string
  icon?: string
}

export interface Settings {
  sound: boolean
  confetti: boolean
}

interface StoreState {
  // progress
  topics: Record<string, boolean>
  awardedTopics: Record<string, true>
  awardedChapters: Record<number, true>
  finishedCelebrated: boolean

  // gamification
  xp: number
  streak: number
  bestStreak: number
  lastActiveDay: string | null

  // counters
  pomodoros: number
  focusMinutes: number
  flashcardsReviewed: number
  quizzesPassed: number
  perfectQuizzes: number

  // detailed
  quizBest: Record<number, number>
  quizPassedCh: Record<number, true>
  quizAcedCh: Record<number, true>
  cardBox: Record<string, number>
  dailyXp: Record<string, number>
  goalDays: Record<string, true>
  dailyGoal: number

  // flags
  studiedEarly: boolean
  studiedLate: boolean
  weekendStudied: boolean

  // achievements & meta
  unlocked: Record<string, string>
  onboarded: boolean
  settings: Settings

  // transient
  celebrations: Celebration[]

  // actions
  toggleTopic: (id: string) => void
  completePomodoro: (minutes: number) => void
  reviewFlashcard: (cardId: string, known: boolean) => void
  submitQuiz: (chapter: number, correct: number, total: number) => void
  setDailyGoal: (n: number) => void
  setOnboarded: (v: boolean) => void
  toggleSetting: (k: keyof Settings) => void
  dismissCelebration: (id: string) => void
  resetProgress: () => void
}

const initial = {
  topics: {} as Record<string, boolean>,
  awardedTopics: {} as Record<string, true>,
  awardedChapters: {} as Record<number, true>,
  finishedCelebrated: false,
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastActiveDay: null as string | null,
  pomodoros: 0,
  focusMinutes: 0,
  flashcardsReviewed: 0,
  quizzesPassed: 0,
  perfectQuizzes: 0,
  quizBest: {} as Record<number, number>,
  quizPassedCh: {} as Record<number, true>,
  quizAcedCh: {} as Record<number, true>,
  cardBox: {} as Record<string, number>,
  dailyXp: {} as Record<string, number>,
  goalDays: {} as Record<string, true>,
  dailyGoal: 45,
  studiedEarly: false,
  studiedLate: false,
  weekendStudied: false,
  unlocked: {} as Record<string, string>,
  onboarded: false,
  settings: { sound: true, confetti: true } as Settings,
  celebrations: [] as Celebration[],
}

export const selectContext = (s: StoreState): AchievementContext => {
  const doneTopics = ALL_TOPIC_IDS.filter((id) => s.topics[id]).length
  const completedChapters = CHAPTER_WEEKS.filter((w) => w.topics.every((t) => s.topics[t.id])).length

  const byDom = {} as Record<DomainKey, boolean[]>
  CHAPTER_WEEKS.forEach((w) => {
    ;(byDom[w.dom] ??= []).push(w.topics.every((t) => s.topics[t.id]))
  })
  let domainsCompleted = 0
  ;(Object.keys(byDom) as DomainKey[]).forEach((d) => {
    if (byDom[d].every(Boolean)) domainsCompleted++
  })

  return {
    doneTopics,
    totalTopics: ALL_TOPIC_IDS.length,
    completedChapters,
    xp: s.xp,
    level: levelFromXp(s.xp).level,
    streak: s.streak,
    bestStreak: s.bestStreak,
    pomodoros: s.pomodoros,
    focusMinutes: s.focusMinutes,
    flashcardsReviewed: s.flashcardsReviewed,
    quizzesPassed: s.quizzesPassed,
    perfectQuizzes: s.perfectQuizzes,
    domainsCompleted,
    studiedEarly: s.studiedEarly,
    studiedLate: s.studiedLate,
    weekendStudied: s.weekendStudied,
  }
}

const cid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export const useStore = create<StoreState>()(
  persist(
    (set, get) => {
      const push = (c: Omit<Celebration, 'id'>) =>
        set((s) => ({ celebrations: [...s.celebrations, { id: cid(), ...c }] }))

      const award = (amount: number) =>
        set((s) => {
          const t = dayKey()
          return { xp: s.xp + amount, dailyXp: { ...s.dailyXp, [t]: (s.dailyXp[t] ?? 0) + amount } }
        })

      const touch = () =>
        set((s) => {
          const t = dayKey()
          const now = new Date()
          const hour = now.getHours()
          let { streak, bestStreak, lastActiveDay } = s
          if (lastActiveDay !== t) {
            streak = lastActiveDay && daysBetween(lastActiveDay, t) === 1 ? streak + 1 : 1
            bestStreak = Math.max(bestStreak, streak)
            lastActiveDay = t
          }
          return {
            streak,
            bestStreak,
            lastActiveDay,
            studiedEarly: s.studiedEarly || hour < 7,
            studiedLate: s.studiedLate || hour >= 23,
            weekendStudied: s.weekendStudied || isWeekend(now),
          }
        })

      const checkDailyGoal = () => {
        const s = get()
        const t = dayKey()
        if (!s.goalDays[t] && (s.dailyXp[t] ?? 0) >= s.dailyGoal) {
          set((st) => ({
            goalDays: { ...st.goalDays, [t]: true },
            xp: st.xp + XP.dailyGoal,
            dailyXp: { ...st.dailyXp, [t]: (st.dailyXp[t] ?? 0) + XP.dailyGoal },
          }))
          push({ kind: 'goal', title: 'Objectif du jour atteint !', subtitle: `+${XP.dailyGoal} XP bonus`, icon: '🎯' })
        }
      }

      const runChecks = (prevLevel: number) => {
        checkDailyGoal()
        const s = get()
        const newLevel = levelFromXp(s.xp)
        if (newLevel.level > prevLevel) {
          push({ kind: 'levelup', title: `Niveau ${newLevel.level}`, subtitle: newLevel.title, icon: '✦' })
        }
        const ctx = selectContext(s)
        const newly = ACHIEVEMENTS.filter((a) => !s.unlocked[a.id] && a.check(ctx))
        if (newly.length) {
          set((st) => {
            const u = { ...st.unlocked }
            const day = dayKey()
            newly.forEach((a) => (u[a.id] = day))
            return { unlocked: u }
          })
          newly.forEach((a) => push({ kind: 'achievement', title: a.name, subtitle: a.desc, icon: a.icon }))
        }
        // grand finale
        if (!s.finishedCelebrated && ctx.doneTopics >= ctx.totalTopics && ctx.totalTopics > 0) {
          set({ finishedCelebrated: true })
          push({ kind: 'finish', title: 'Programme terminé ! 🎓', subtitle: 'Prêt pour la Terminale', icon: '🎓' })
        }
      }

      /** Award XP, register daily activity, then run level/achievement checks. */
      const gain = (amount: number) => {
        const prevLevel = levelFromXp(get().xp).level
        award(amount)
        touch()
        runChecks(prevLevel)
      }

      const checkChapters = () => {
        const s = get()
        const newly = CHAPTER_WEEKS.filter(
          (w) => w.chapter !== null && !s.awardedChapters[w.chapter] && w.topics.every((t) => s.topics[t.id]),
        )
        if (!newly.length) return
        set((st) => {
          const ac = { ...st.awardedChapters }
          newly.forEach((w) => (ac[w.chapter as number] = true))
          return { awardedChapters: ac }
        })
        newly.forEach((w) => {
          push({ kind: 'chapter', title: `${w.ch} terminé !`, subtitle: w.titre, icon: '📗' })
          gain(XP.chapterBonus)
        })
      }

      return {
        ...initial,

        toggleTopic: (id) => {
          const wasChecked = !!get().topics[id]
          set((s) => {
            const topics = { ...s.topics }
            if (topics[id]) delete topics[id]
            else topics[id] = true
            return { topics }
          })
          if (!wasChecked) {
            if (!get().awardedTopics[id]) {
              set((s) => ({ awardedTopics: { ...s.awardedTopics, [id]: true } }))
              gain(XP.topic)
            } else {
              gain(0) // still counts as daily activity / re-checks
            }
            checkChapters()
          }
        },

        completePomodoro: (minutes) => {
          set((s) => ({ pomodoros: s.pomodoros + 1, focusMinutes: s.focusMinutes + minutes }))
          gain(XP.pomodoro)
        },

        reviewFlashcard: (cardId, known) => {
          set((s) => ({
            flashcardsReviewed: s.flashcardsReviewed + 1,
            cardBox: { ...s.cardBox, [cardId]: clamp((s.cardBox[cardId] ?? 0) + (known ? 1 : -1), 0, 4) },
          }))
          gain(XP.flashcard)
        },

        submitQuiz: (chapter, correct, total) => {
          const pct = total > 0 ? Math.round((correct / total) * 100) : 0
          const passed = pct >= 60
          const perfect = total > 0 && correct === total
          const s = get()
          const firstPass = passed && !s.quizPassedCh[chapter]
          const firstPerfect = perfect && !s.quizAcedCh[chapter]
          set((st) => ({
            quizBest: { ...st.quizBest, [chapter]: Math.max(st.quizBest[chapter] ?? 0, pct) },
            quizPassedCh: firstPass ? { ...st.quizPassedCh, [chapter]: true } : st.quizPassedCh,
            quizAcedCh: firstPerfect ? { ...st.quizAcedCh, [chapter]: true } : st.quizAcedCh,
            quizzesPassed: firstPass ? st.quizzesPassed + 1 : st.quizzesPassed,
            perfectQuizzes: firstPerfect ? st.perfectQuizzes + 1 : st.perfectQuizzes,
          }))
          if (firstPass) gain(XP.quizPass)
          if (firstPerfect) gain(XP.quizPerfect)
          if (!firstPass && !firstPerfect) gain(0)
        },

        setDailyGoal: (n) => set({ dailyGoal: clamp(Math.round(n), 10, 300) }),
        setOnboarded: (v) => set({ onboarded: v }),
        toggleSetting: (k) => set((s) => ({ settings: { ...s.settings, [k]: !s.settings[k] } })),
        dismissCelebration: (id) => set((s) => ({ celebrations: s.celebrations.filter((c) => c.id !== id) })),

        resetProgress: () =>
          set({
            topics: {},
            awardedTopics: {},
            awardedChapters: {},
            finishedCelebrated: false,
            xp: 0,
            streak: 0,
            bestStreak: 0,
            lastActiveDay: null,
            pomodoros: 0,
            focusMinutes: 0,
            flashcardsReviewed: 0,
            quizzesPassed: 0,
            perfectQuizzes: 0,
            quizBest: {},
            quizPassedCh: {},
            quizAcedCh: {},
            cardBox: {},
            dailyXp: {},
            goalDays: {},
            studiedEarly: false,
            studiedLate: false,
            weekendStudied: false,
            unlocked: {},
            celebrations: [],
          }),
      }
    },
    {
      name: 'maths-premiere-v2',
      storage: createJSONStorage(() => serverStorage),
      version: 1,
      partialize: ({ celebrations, ...rest }) => rest,
    },
  ),
)

// Convenience selectors -------------------------------------------------------
export const useLevel = () => levelFromXp(useStore((s) => s.xp))
export const useDoneCount = () => useStore((s) => ALL_TOPIC_IDS.filter((id) => s.topics[id]).length)
export const TOTAL_TOPICS = ALL_TOPIC_IDS.length
export const TOTAL_WEEKS = ALL_WEEKS.length
