// Utility functions for passport data handling

// Get passport data from URL params
export function getPassportFromURL() {
  const params = new URLSearchParams(window.location.search)
  return {
    token:    params.get('passport_token'),
    username: params.get('passport_user'),
    xp:       params.get('passport_xp'),
    tier:     params.get('passport_tier'),
  }
}

// Format XP number nicely
export function formatXP(xp) {
  if (!xp) return '0 XP'
  return `${Number(xp).toLocaleString()} XP`
}

// Get tier label from tier number
export function getTierLabel(tier) {
  const tiers = {
    1: 'NOVICE BUILDER',
    2: 'CLOUD EXPLORER',
    3: 'AWS PRACTITIONER',
    4: 'CLOUD ARCHITECT',
    5: 'MASTER BUILDER',
  }
  return tiers[tier] || 'NOVICE BUILDER'
}

// Check if passport token is present
export function hasActivePassport() {
  const params = new URLSearchParams(window.location.search)
  return !!params.get('passport_token')
}
