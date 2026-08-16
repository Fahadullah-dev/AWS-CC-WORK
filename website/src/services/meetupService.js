const MEETUP_GROUP = 'aws-cloud-club-murdoch-university-dubai'
const MEETUP_BASE  = `https://api.meetup.com/${MEETUP_GROUP}`

export const MEETUP_GROUP_URL = `https://www.meetup.com/aws-cloud-club-at-murdoch-university-dubai/`

export const PAST_EVENTS = []

export async function getUpcomingEvents() {
  try {
    const res = await fetch(
      `${MEETUP_BASE}/events?status=upcoming&page=10&only=name,local_date,local_time,venue,description,link,yes_rsvp_count`,
      { headers: { Accept: 'application/json' } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
