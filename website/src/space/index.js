// Space Module — passport integration layer
// connects website/ to cloud-passport/ via URL only
// never imports from cloud-passport/ directly

export { PASSPORT_LINKS } from './config/passportLinks'
export { usePassportStatus } from './hooks/usePassportStatus'
export { PassportBadge } from './components/PassportBadge'
export { getPassportFromURL } from './utils/passportHelpers'
