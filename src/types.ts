export type DomainKey = 'alg' | 'ana' | 'geo' | 'pro' | 'py' | 'rev'

export interface Domain {
  l: string
  color: string
  short: string
}

export interface Topic {
  id: string
  t: string
  p?: string
}

export interface Flashcard {
  id: string
  chapter: number
  front: string
  back: string
  hint?: string
}

export interface QuizQuestion {
  id: string
  chapter: number
  q: string
  choices: string[]
  answer: number
  explain?: string
}

export interface WeekNote {
  k: 'ok' | 'tip' | 'py'
  t: string
}

export interface Week {
  id: string
  n: number
  kind: 'normal' | 'express' | 'final'
  dates: string
  start: string
  end: string
  dom: DomainKey
  chapter: number | null
  ch: string
  titre: string
  pg?: string
  exo?: string
  topics: Topic[]
  note?: WeekNote
  ds?: string
}

export interface Phase {
  ph: string
  pn: string
  weeks: Week[]
}

export interface Achievement {
  id: string
  name: string
  desc: string
  icon: string
  /** Returns true when unlocked, given the live store snapshot. */
  check: (s: AchievementContext) => boolean
  secret?: boolean
}

export interface AchievementContext {
  doneTopics: number
  totalTopics: number
  completedChapters: number
  xp: number
  level: number
  streak: number
  bestStreak: number
  pomodoros: number
  focusMinutes: number
  flashcardsReviewed: number
  quizzesPassed: number
  perfectQuizzes: number
  domainsCompleted: number
  studiedEarly: boolean
  studiedLate: boolean
  weekendStudied: boolean
}
