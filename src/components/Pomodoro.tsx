import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react'
import { useTimer, type TimerMode } from '../lib/timerStore'
import { useStore } from '../store'
import { Ring } from './ui/Ring'
import { sfx } from '../lib/sound'
import { cn, formatMinutes } from '../lib/utils'

const PRESETS = [
  { label: '25 / 5', focus: 25, brk: 5 },
  { label: '50 / 10', focus: 50, brk: 10 },
  { label: '15 / 3', focus: 15, brk: 3 },
]

function fmt(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function Pomodoro() {
  const { mode, running, remaining, focusLen, breakLen, finishedFocusSessions } = useTimer()
  const toggle = useTimer((s) => s.toggle)
  const reset = useTimer((s) => s.reset)
  const setPreset = useTimer((s) => s.setPreset)
  const switchMode = useTimer((s) => s.switchMode)
  const soundOn = useStore((s) => s.settings.sound)
  const totalFocus = useStore((s) => s.focusMinutes)

  const totalSec = (mode === 'focus' ? focusLen : breakLen) * 60
  const progress = 1 - remaining / totalSec
  const isFocus = mode === 'focus'

  function onToggle() {
    if (!running && soundOn) sfx.start()
    toggle()
  }
  function onMode(m: TimerMode) {
    if (m !== mode) switchMode(m)
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="text-gold-2">⏱</span> Focus
        </h3>
        <div className="flex rounded-lg border border-white/10 p-0.5">
          <button
            onClick={() => onMode('focus')}
            className={cn('flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[0.7rem] transition', isFocus ? 'bg-gold-soft text-gold-2' : 'text-faint hover:text-dim')}
            style={isFocus ? { background: 'rgba(216,176,106,.14)' } : undefined}
          >
            <Brain size={12} /> Travail
          </button>
          <button
            onClick={() => onMode('break')}
            className={cn('flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[0.7rem] transition', !isFocus ? 'text-emerald-200' : 'text-faint hover:text-dim')}
            style={!isFocus ? { background: 'rgba(110,231,183,.12)' } : undefined}
          >
            <Coffee size={12} /> Pause
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <Ring
          progress={progress}
          size={172}
          stroke={11}
          color={isFocus ? 'var(--color-gold)' : 'var(--color-algebre)'}
        >
          <div>
            <div className="font-display text-4xl font-semibold tabular-nums tracking-tight">{fmt(remaining)}</div>
            <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-faint">
              {isFocus ? 'Concentration' : 'Récupération'}
            </div>
          </div>
        </Ring>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={reset}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-dim transition hover:border-white/25 hover:text-txt"
            title="Réinitialiser"
          >
            <RotateCcw size={17} />
          </button>
          <button
            onClick={onToggle}
            className="grid h-14 w-14 place-items-center rounded-full text-ink shadow-lg transition active:scale-95"
            style={{ background: isFocus ? 'linear-gradient(180deg,var(--color-gold-2),var(--color-gold))' : 'linear-gradient(180deg,#9ff0cf,var(--color-algebre))' }}
            title={running ? 'Pause' : 'Démarrer'}
          >
            {running ? <Pause size={22} className="fill-ink" /> : <Play size={22} className="translate-x-0.5 fill-ink" />}
          </button>
          <div className="grid h-11 w-11 place-items-center rounded-full border border-white/10 font-mono text-xs text-dim" title="Sessions terminées aujourd'hui">
            ×{finishedFocusSessions}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-1.5">
          {PRESETS.map((p) => {
            const active = focusLen === p.focus && breakLen === p.brk
            return (
              <button
                key={p.label}
                onClick={() => setPreset(p.focus, p.brk)}
                className={cn('rounded-full border px-3 py-1 font-mono text-[0.7rem] transition', active ? 'border-gold/40 text-gold-2' : 'border-white/10 text-faint hover:text-dim')}
                style={active ? { background: 'rgba(216,176,106,.1)' } : undefined}
              >
                {p.label}
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-center font-mono text-[0.7rem] text-faint">
          Total concentré : <b className="text-dim">{formatMinutes(totalFocus)}</b>
        </p>
      </div>
    </div>
  )
}
