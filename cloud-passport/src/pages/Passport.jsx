// src/pages/Passport.jsx
import { useState, useEffect, useRef } from 'react'
import { getProfile, getUserAttendance, getTierProgress, updateProfile, uploadAvatar, supabase } from '../lib/supabase'
import html2canvas from 'html2canvas'

export default function Passport({ user }) {
  const [profile, setProfile]   = useState(null)
  const [attendance, setAttendance] = useState([])
  const [editing, setEditing]   = useState(false)
  const [newName, setNewName]   = useState('')
  const [newSlug, setNewSlug]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [sharing, setSharing]   = useState(false)
  const [loadErr, setLoadErr]   = useState(false)
  const shareRef = useRef()

  useEffect(() => {
    async function loadProfile() {
      // try fetching existing profile
      let { data, error } = await getProfile(user.id)

      // no profile yet — create one on the spot
      if (!data || error) {
        const slug = user.email.split('@')[0]
        const name = user.user_metadata?.full_name
                  || user.email.split('@')[0]

        const { error: insertErr } = await supabase.from('profiles').insert({
          id: user.id,
          full_name: name,
          public_slug: slug,
        })

        if (insertErr) {
          // slug might clash — use uuid fallback
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: name,
            public_slug: user.id,
          })
        }

        // fetch again
        const retry = await getProfile(user.id)
        data = retry.data
      }

      if (data) {
        setProfile(data)
        setNewName(data.full_name || '')
        setNewSlug(data.public_slug || '')
      } else {
        setLoadErr(true)
      }
    }

    loadProfile()
    getUserAttendance(user.id).then(({ data }) => setAttendance(data || []))
  }, [user.id])

  async function saveProfile() {
    setSaving(true)
    await updateProfile(user.id, { full_name: newName, public_slug: newSlug })
    setProfile(p => ({ ...p, full_name: newName, public_slug: newSlug }))
    setEditing(false)
    setSaving(false)
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = await uploadAvatar(user.id, file)
    setProfile(p => ({ ...p, avatar_url: url }))
  }

  async function shareCard() {
    setSharing(true)
    const canvas = await html2canvas(shareRef.current, { backgroundColor: '#0D1321', scale: 2 })
    const link = document.createElement('a')
    link.download = `${profile.full_name.replace(' ', '-')}-passport.png`
    link.href = canvas.toDataURL()
    link.click()
    setSharing(false)
  }

  if (loadErr) return (
    <div className="page-wrap">
      <div className="muted">could not load profile. try refreshing.</div>
    </div>
  )

  if (!profile) return <div className="loading">loading passport...</div>

  const tp = getTierProgress(profile.xp)
  const streak = attendance.length
  const publicUrl = `${window.location.origin}/passport/${profile.public_slug}`

  return (
    <div className="page-wrap">
      {/* passport cover card */}
      <div className="passport-cover">
        <div className="passport-header">
          <div className="passport-logo">☁️</div>
          <div>
            <div className="passport-club">AWS Cloud Club</div>
            <div className="passport-type">E-PASSPORT</div>
          </div>
          <div className="tier-badge" style={{ background: tp.color + '22', color: tp.color, border: `1px solid ${tp.color}55` }}>
            {tp.icon} {profile.tier}
          </div>
        </div>

        <div className="passport-body">
          <div className="avatar-wrap">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name}`}
              alt="avatar"
              className="avatar"
            />
            <label className="avatar-edit" title="change photo">
              ✏️
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="passport-info">
            {editing ? (
              <div className="edit-form">
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="full name" />
                <input
                  value={newSlug}
                  onChange={e => setNewSlug(e.target.value.toLowerCase().replace(/\s/g, '-'))}
                  placeholder="public url slug"
                />
                <div className="edit-actions">
                  <button onClick={saveProfile} disabled={saving} className="btn-primary">
                    {saving ? '...' : 'save'}
                  </button>
                  <button onClick={() => setEditing(false)}>cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="passport-name">{profile.full_name}</div>
                <div className="passport-id">{profile.member_id}</div>
                <button className="btn-link" onClick={() => setEditing(true)}>edit profile</button>
              </>
            )}
          </div>
        </div>

        {/* xp progress bar */}
        <div className="xp-section">
          <div className="xp-row">
            <span className="xp-label">{profile.xp} XP</span>
            <span className="xp-label muted">
              {tp.nextXP
                ? `${tp.nextXP - profile.xp} XP to next tier`
                : 'max tier reached'}
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${tp.pct}%`, background: tp.color }} />
          </div>
        </div>

        {/* stats row */}
        <div className="stats-row">
          <div className="stat">
            <div className="stat-val">{attendance.length}</div>
            <div className="stat-lbl">events</div>
          </div>
          <div className="stat">
            <div className="stat-val">{profile.xp}</div>
            <div className="stat-lbl">XP</div>
          </div>
          <div className="stat">
            <div className="stat-val">{streak >= 3 ? `${streak} 🔥` : streak}</div>
            <div className="stat-lbl">streak</div>
          </div>
        </div>

        {/* public link */}
        <div className="public-link">
          <span className="muted">public link: </span>
          <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a>
        </div>
      </div>

      {/* hidden share card for html2canvas */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={shareRef} style={{
          width: 400, padding: 28,
          background: 'linear-gradient(145deg, #0D1321, #1C2A3E)',
          fontFamily: 'monospace', color: '#fff',
          borderRadius: 16, border: '1px solid rgba(255,153,0,0.2)'
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,153,0,0.5)', letterSpacing: '0.2em', marginBottom: 16 }}>
            AWS CLOUD CLUB · E-PASSPORT
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{profile.full_name}</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 11, padding: '3px 12px', borderRadius: 20, background: 'rgba(255,153,0,0.15)', border: '1px solid rgba(255,153,0,0.3)', color: '#FF9900' }}>
              {tp.icon} {profile.tier}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,153,0,0.1)', borderBottom: '1px solid rgba(255,153,0,0.1)', padding: '14px 0', marginBottom: 16 }}>
            {[['events', attendance.length], ['XP', profile.xp], ['streak', streak]].map(([l, v]) => (
              <div key={l} style={{ flex: 1, textAlign: 'center', borderRight: '1px solid rgba(255,153,0,0.1)' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#FF9900' }}>{v}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,153,0,0.4)' }}>{publicUrl}</div>
        </div>
      </div>

      <button className="btn-share" onClick={shareCard} disabled={sharing}>
        {sharing ? 'generating...' : '📤 download share card'}
      </button>
    </div>
  )
}
