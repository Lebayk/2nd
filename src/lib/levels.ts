/** XP awarded for each kind of action. */
export const XP = {
  topic: 15,
  chapterBonus: 60,
  pomodoro: 25,
  flashcard: 4,
  quizPass: 30,
  quizPerfect: 55,
  dailyGoal: 20,
} as const

/** Cumulative XP needed to *reach* each level (index 0 = level 1). */
const THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000, 5000]

const TITLES = [
  'Débutant',
  'Curieux',
  'Apprenti',
  'Initié',
  'Calculateur',
  'Algébriste',
  'Analyste',
  'Géomètre',
  'Probabiliste',
  'Stratège',
  'Virtuose',
  'Maître des maths',
]

/** XP gap added per level once past the explicit table. */
const OVERFLOW_STEP = 1200

function thresholdFor(level: number): number {
  if (level <= THRESHOLDS.length) return THRESHOLDS[level - 1]
  const extra = level - THRESHOLDS.length
  return THRESHOLDS[THRESHOLDS.length - 1] + extra * OVERFLOW_STEP
}

function titleFor(level: number): string {
  if (level <= TITLES.length) return TITLES[level - 1]
  return `Légende ${level - TITLES.length + 1}`
}

export interface LevelInfo {
  level: number
  title: string
  nextTitle: string
  totalXp: number
  /** XP accumulated within the current level. */
  xpInto: number
  /** XP span of the current level. */
  xpForLevel: number
  /** XP remaining to next level. */
  xpToNext: number
  /** 0..1 progress within current level. */
  progress: number
}

export function levelFromXp(totalXp: number): LevelInfo {
  let level = 1
  while (thresholdFor(level + 1) <= totalXp) level++

  const base = thresholdFor(level)
  const next = thresholdFor(level + 1)
  const xpForLevel = next - base
  const xpInto = totalXp - base

  return {
    level,
    title: titleFor(level),
    nextTitle: titleFor(level + 1),
    totalXp,
    xpInto,
    xpForLevel,
    xpToNext: next - totalXp,
    progress: xpForLevel > 0 ? Math.min(1, xpInto / xpForLevel) : 1,
  }
}
