// src/pages/Admin.jsx
import { useState, useEffect, useRef } from 'react'
import { getEvents, createEvent, generateQR } from '../lib/supabase'
import QRCode from 'qrcode'

const CAPTAIN_EMAILS = [
  '34675845@student.murdoch.edu.au', // ← replace with real captain email
  '35044384@student.murdoch.edu.au'
]

export default function Admin({ user }) {
  const [events, setEvents]     = useState([])
  const [form, setForm]         = useState({ name: '', description: '', event_type: 'workshop', track: 'General', xp_reward: 150, event_date: '', emoji: '☁️' })
  const [creating, setCreating] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [qrEvent, setQrEvent]   = useState(null)
  const [genning, setGenning]   = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)

  const rotateRef  = useRef(null)
  const countRef   = useRef(null)
  const isCaptain  = CAPTAIN_EMAILS.includes(user.email)

  // ── auto-rotate QR every 15 seconds while modal open ──
  useEffect(() => {
    if (!qrEvent) return

    // generate immediately on open
    doGenerate(qrEvent)

    // then every 15s generate fresh one
    rotateRef.current = setInterval(() => {
      doGenerate(qrEvent)
      setTimeLeft(15)
    }, 15000)

    // countdown ticker
    countRef.current = setInterval(() => {
      setTimeLeft(t => (t <= 1 ? 15 : t - 1))
    }, 1000)

    return () => {
      clearInterval(rotateRef.current)
      clearInterval(countRef.current)
    }
  }, [qrEvent?.id])

  async function doGenerate(event) {
    const { token, error } = await generateQR(event.id)
    if (error) { alert('error: ' + error); return }
    const dataUrl = await QRCode.toDataURL(token, {
      width: 300, margin: 2,
      color: { dark: '#0D1321', light: '#FFFFFF' }
    })
    setQrDataUrl(dataUrl)
  }

  function openQR(event) {
    setQrEvent(event)   // triggers the useEffect above
    setTimeLeft(15)
  }

  function closeQR() {
    clearInterval(rotateRef.current)
    clearInterval(countRef.current)
    setQrEvent(null)
    setQrDataUrl('')
  }

  useEffect(() => {
    getEvents().then(({ data }) => setEvents(data || []))
  }, [])

  if (!isCaptain) return (
    <div className="page-wrap">
      <div className="page-header"><h2>admin</h2></div>
      <div className="muted">only captains can access this. ask captain to add your email.</div>
    </div>
  )

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    const { error } = await createEvent({ ...form, created_by: user.id })
    if (!error) {
      const { data } = await getEvents()
      setEvents(data || [])
      setForm({ name: '', description: '', event_type: 'workshop', track: 'General', xp_reward: 150, event_date: '', emoji: '☁️' })
    }
    setCreating(false)
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h2>admin panel</h2>
        <span className="badge-captain">captain</span>
      </div>

      {/* create event form */}
      <div className="admin-section">
        <h3>create event</h3>
        <form onSubmit={handleCreate} className="event-form">
          <div className="form-row">
            <input
              placeholder="event name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              placeholder="emoji (☁️)"
              value={form.emoji}
              onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
              style={{ width: 80 }}
            />
          </div>
          <textarea
            placeholder="description (optional)"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={2}
          />
          <div className="form-row">
            <select value={form.track} onChange={e => setForm(f => ({ ...f, track: e.target.value }))}>
              {['General', 'Compute', 'Networking', 'Security', 'AI/ML'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={form.event_type} onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))}>
              {['workshop', 'talk', 'hackathon', 'lab'].map(t => <option key={t}>{t}</option>)}
            </select>
            <input
              type="number"
              placeholder="XP reward"
              value={form.xp_reward}
              onChange={e => setForm(f => ({ ...f, xp_reward: Number(e.target.value) }))}
              style={{ width: 100 }}
            />
            <input
              type="date"
              value={form.event_date}
              onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={creating}>
            {creating ? '...' : 'create event'}
          </button>
        </form>
      </div>

      {/* events list */}
      <div className="admin-section">
        <h3>events ({events.length})</h3>
        {events.map(event => (
          <div key={event.id} className="event-row">
            <span className="event-emoji">{event.emoji}</span>
            <div className="event-info">
              <div className="event-name">{event.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{event.track} · {event.xp_reward} XP · {event.event_date}</div>
            </div>
            <button className="btn-qr" onClick={() => openQR(event)}>
              📷 show QR
            </button>
          </div>
        ))}
      </div>

      {/* rotating QR modal */}
      {qrEvent && (
        <div className="qr-modal-overlay" onClick={closeQR}>
          <div className="qr-modal" onClick={e => e.stopPropagation()}>
            <div className="qr-modal-title">{qrEvent.emoji} {qrEvent.name}</div>
            <div className="qr-modal-sub muted">rotating every 15s · screenshot useless</div>

            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR code" className="qr-image" />
              : <div className="qr-loading">generating...</div>
            }

            {/* countdown bar */}
            <div className="qr-countdown">
              refreshes in {timeLeft}s
              <div className="countdown-bar">
                <div className="countdown-fill" style={{ width: `${(timeLeft / 15) * 100}%` }} />
              </div>
            </div>

            <div className="qr-modal-sub muted">attendees scan in check in tab</div>
            <button onClick={closeQR}>close</button>
          </div>
        </div>
      )}
    </div>
  )
}
