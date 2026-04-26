import { useState, useEffect } from 'react'
import { getUserAttendance, getEvents } from '../lib/supabase'

const TRACK_COLORS = {
  Compute:    { bg: 'rgba(255,153,0,0.1)',  border: 'rgba(255,153,0,0.4)',  text: '#C87000' },
  Networking: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.4)', text: '#2563EB' },
  Security:   { bg: 'rgba(29,158,117,0.1)', border: 'rgba(29,158,117,0.4)', text: '#0F6E56' },
  'AI/ML':    { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.4)', text: '#7C3AED' },
  General:    { bg: 'rgba(136,135,128,0.1)',border: 'rgba(136,135,128,0.4)',text: '#5F5E5A' },
}

export default function Stamps({ user }) {
  const [attended, setAttended] = useState([])
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getUserAttendance(user.id).then(({ data }) => {
      setAttended((data || []).map(a => a.event_id))
    })
    getEvents().then(({ data }) => setEvents(data || []))
  }, [user.id])

  const earnedCount = events.filter(e => attended.includes(e.id)).length

  return (
    <div className="page-wrap" style={{ color: '#0f172a' }}>
      <div className="page-header">
        {/* FIXED: Dark Title */}
        <h2 style={{ color: '#0f172a', fontWeight: '900' }}>Visa Stamps</h2>
        <span className="muted">{earnedCount} / {events.length} Earned</span>
      </div>

      <div className="stamps-grid">
        {events.map(event => {
          const earned = attended.includes(event.id)
          const colors = TRACK_COLORS[event.track] || TRACK_COLORS.General
          return (
            <div
              key={event.id}
              className={`stamp ${earned ? 'earned' : 'locked'}`}
              style={earned ? { background: colors.bg, border: `2px solid ${colors.border}` } : { border: '1px dashed #cbd5e1' }}
              onClick={() => setSelected(event)}
            >
              <div className="stamp-icon" style={!earned ? { opacity: 0.2 } : {}}>{event.emoji}</div>
              <div className="stamp-name" style={{ color: earned ? colors.text : '#94a3b8' }}>{event.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}