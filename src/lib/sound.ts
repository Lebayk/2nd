// Tiny WebAudio synth — no asset files. Sounds are short and subtle.

let ctx: AudioContext | null = null

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.06) {
  const c = ac()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t0 = c.currentTime + start
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export const sfx = {
  tick: () => tone(880, 0, 0.12, 'triangle', 0.05),
  check: () => {
    tone(660, 0, 0.1, 'triangle', 0.05)
    tone(990, 0.06, 0.14, 'triangle', 0.045)
  },
  correct: () => {
    tone(659, 0, 0.12, 'sine', 0.06)
    tone(988, 0.1, 0.18, 'sine', 0.055)
  },
  wrong: () => {
    tone(220, 0, 0.18, 'sawtooth', 0.04)
    tone(180, 0.08, 0.22, 'sawtooth', 0.035)
  },
  flip: () => tone(520, 0, 0.09, 'sine', 0.035),
  levelup: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle', 0.05))
  },
  achievement: () => {
    ;[784, 988, 1319].forEach((f, i) => tone(f, i * 0.08, 0.25, 'sine', 0.05))
  },
  start: () => tone(587, 0, 0.14, 'sine', 0.05),
  done: () => {
    tone(784, 0, 0.16, 'sine', 0.055)
    tone(1047, 0.12, 0.24, 'sine', 0.05)
  },
}

export type SfxName = keyof typeof sfx
