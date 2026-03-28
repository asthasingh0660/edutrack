import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function useCountUp(target, duration = 1) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration,
      ease: 'power1.out',
      onUpdate() {
        if (ref.current) ref.current.textContent = Math.round(obj.val)
      },
    })
  }, [target, duration])

  return ref
}