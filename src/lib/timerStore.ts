import { create } from 'zustand'
import { useStore } from '../store'
import { sfx } from './sound'

export type TimerMode = 'focus' | 'break'

interface TimerState {
  mode: TimerMode
  running: boolean
  remaining: number // seconds
  focusLen: number // minutes
  breakLen: number // minutes
  finishedFocusSessions: number

  start: () => void
  pause: () => void
  toggle: () => void
  reset: () => void
  setPreset: (focus: number, brk: number) => void
  switchMode: (mode: TimerMode) => void
  tick: () => void
}

export const useTimer = create<TimerState>((set, get) => ({
  mode: 'focus',
  running: false,
  remaining: 25 * 60,
  focusLen: 25,
  breakLen: 5,
  finishedFocusSessions: 0,

  start: () => set({ running: true }),
  pause: () => set({ running: false }),
  toggle: () => set((s) => ({ running: !s.running })),
  reset: () =>
    set((s) => ({ running: false, remaining: (s.mode === 'focus' ? s.focusLen : s.breakLen) * 60 })),

  setPreset: (focus, brk) =>
    set((s) => ({
      focusLen: focus,
      breakLen: brk,
      remaining: (s.mode === 'focus' ? focus : brk) * 60,
      running: false,
    })),

  switchMode: (mode) =>
    set((s) => ({ mode, remaining: (mode === 'focus' ? s.focusLen : s.breakLen) * 60, running: false })),

  tick: () => {
    const s = get()
    if (!s.running) return
    if (s.remaining > 1) {
      set({ remaining: s.remaining - 1 })
      return
    }
    // session boundary
    const soundOn = useStore.getState().settings.sound
    if (s.mode === 'focus') {
      useStore.getState().completePomodoro(s.focusLen)
      if (soundOn) sfx.done()
      set({
        mode: 'break',
        remaining: s.breakLen * 60,
        running: false,
        finishedFocusSessions: s.finishedFocusSessions + 1,
      })
    } else {
      if (soundOn) sfx.start()
      set({ mode: 'focus', remaining: s.focusLen * 60, running: false })
    }
  },
}))
