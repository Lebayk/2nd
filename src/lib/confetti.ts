import confetti from 'canvas-confetti'

const GOLD = ['#d8b06a', '#e9c98a', '#fff7e6', '#f6e3b4']
const FESTIVE = ['#d8b06a', '#e9c98a', '#6ee7b7', '#7dd3fc', '#c4b5fd', '#f9a8c4']

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Small celebratory pop, e.g. on completing a topic. */
export function pop(x = 0.5, y = 0.5) {
  if (prefersReducedMotion()) return
  confetti({
    particleCount: 60,
    spread: 65,
    startVelocity: 32,
    scalar: 0.85,
    origin: { x, y },
    colors: GOLD,
    disableForReducedMotion: true,
  })
}

/** Pop confetti centered on a DOM element. */
export function popAt(el: Element | null) {
  if (!el) return pop()
  const r = el.getBoundingClientRect()
  pop((r.left + r.width / 2) / window.innerWidth, (r.top + r.height / 2) / window.innerHeight)
}

/** Bigger celebration for level-up / achievement / chapter complete. */
export function celebrate() {
  if (prefersReducedMotion()) return
  const end = Date.now() + 900
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: FESTIVE, disableForReducedMotion: true })
    confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: FESTIVE, disableForReducedMotion: true })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

/** Grand finale — whole programme complete. */
export function fireworks() {
  if (prefersReducedMotion()) return
  const duration = 2400
  const end = Date.now() + duration
  const frame = () => {
    confetti({
      particleCount: 7,
      spread: 360,
      startVelocity: 36,
      ticks: 90,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      colors: FESTIVE,
      disableForReducedMotion: true,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
