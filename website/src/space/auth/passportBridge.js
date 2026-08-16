// Bridge between website and cloud-passport app
// Communication via URL params and window.postMessage
// Never imports from cloud-passport/ directly

const PASSPORT_ORIGIN =
  import.meta.env.VITE_PASSPORT_URL
  || 'http://localhost:3001'

// Send user to passport app
export function goToPassport(route = '/register') {
  window.location.href = `${PASSPORT_ORIGIN}${route}`
}

// Listen for messages from passport app
export function onPassportMessage(callback) {
  const handler = (event) => {
    if (event.origin !== PASSPORT_ORIGIN) return
    callback(event.data)
  }
  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}

// Send message to passport app (if in iframe future)
export function postToPassport(message) {
  const passport = document.getElementById('passport-frame')
  if (passport) {
    passport.contentWindow.postMessage(message, PASSPORT_ORIGIN)
  }
}
