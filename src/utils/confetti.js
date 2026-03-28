import confetti from 'canvas-confetti'

export function fireConfetti(origin = { x: 0.5, y: 0.6 }) {
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  confetti({
    particleCount: 80,
    spread: 60,
    origin,
    colors: ['#52B788', '#E9C46A', '#2D6A4F', '#F5F2EA'],
    scalar: 0.9,
    gravity: 1.1,
  })
}