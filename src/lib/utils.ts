import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Local YYYY-MM-DD key for a date (defaults to now). */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(key: string, delta: number): string {
  const d = new Date(key + 'T12:00:00')
  d.setDate(d.getDate() + delta)
  return dayKey(d)
}

/** Whole days between two day-keys (b - a). */
export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T12:00:00').getTime()
  const db = new Date(b + 'T12:00:00').getTime()
  return Math.round((db - da) / 86_400_000)
}

export function isWeekend(d: Date = new Date()): boolean {
  const day = d.getDay()
  return day === 0 || day === 6
}

/** Clamp helper. */
export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

/** Format a number of minutes as "Xh YY" or "YY min". */
export function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`
}

/** "il y a 3 jours", "aujourd'hui", "dans 5 jours" relative to today. */
export function relativeDays(targetKey: string, todayKey: string): string {
  const d = daysBetween(todayKey, targetKey)
  if (d === 0) return "aujourd'hui"
  if (d === 1) return 'demain'
  if (d === -1) return 'hier'
  if (d > 0) return `dans ${d} jours`
  return `il y a ${-d} jours`
}

const FR_MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

export function formatDayKey(key: string): string {
  const d = new Date(key + 'T12:00:00')
  return `${d.getDate()} ${FR_MONTHS[d.getMonth()]}`
}

/** Shuffle a copy of an array (Fisher–Yates). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
