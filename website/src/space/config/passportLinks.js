// Passport URL config
// Update REACT_APP_PASSPORT_URL in .env for production

const BASE = import.meta.env.VITE_PASSPORT_URL || 'http://localhost:3001'

export const PASSPORT_LINKS = {
  initialize: `${BASE}/register`,
  terminal:   `${BASE}/login`,
  create:     `${BASE}/register`,
  profile:    `${BASE}/profile`,
  dashboard:  `${BASE}/dashboard`,
}
