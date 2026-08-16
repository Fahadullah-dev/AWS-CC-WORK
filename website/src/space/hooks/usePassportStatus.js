// Hook to check passport status from URL or storage
// Placeholder — expand when passport app is ready

import { useState, useEffect } from 'react'

export function usePassportStatus() {
  const [hasPassport, setHasPassport] = useState(false)
  const [passportData, setPassportData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('passport_token')
    const user  = params.get('passport_user')

    if (token && user) {
      setHasPassport(true)
      setPassportData({ token, username: user })
    }
    setLoading(false)
  }, [])

  return { hasPassport, passportData, loading }
}
