import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageLoader() {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return loading
}
