import { useEffect, useRef } from 'react'
import anime from '../utils/anime'

export function useScrollAnime(animFn, deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animFn(el)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

export function useMountAnime(animFn) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) animFn(ref.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}
