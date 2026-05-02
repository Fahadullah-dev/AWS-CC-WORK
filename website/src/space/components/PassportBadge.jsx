// Passport status badge — shows in navbar when
// user has an active passport session
// Placeholder component — style later

import { COLORS, FONTS, WEIGHT } from '../../styles/tokens'

export function PassportBadge({ username }) {
  if (!username) return null
  return (
    <div style={{
      background: COLORS.purple,
      color: COLORS.white,
      fontFamily: FONTS.mono,
      fontSize: '12px',
      fontWeight: WEIGHT.bold,
      padding: '4px 10px',
      border: `1px solid ${COLORS.border}`,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }}>
      ▸ {username}
    </div>
  )
}

export default PassportBadge
