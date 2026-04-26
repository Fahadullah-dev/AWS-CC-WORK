// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ── AUTH ──

export async function signUp(email, password, fullName) {
  return supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } }
  })
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── PROFILE ──

export async function getProfile(userId) {
  return supabase.from('profiles').select('*').eq('id', userId).single()
}

export async function getPublicProfile(slug) {
  return supabase.from('profiles').select('*').eq('public_slug', slug).single()
}

export async function updateProfile(userId, updates) {
  return supabase.from('profiles').update(updates).eq('id', userId)
}

export async function uploadAvatar(userId, file) {
  const ext = file.name.split('.').pop()
  const path = `avatars/${userId}.${ext}`
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  await updateProfile(userId, { avatar_url: data.publicUrl })
  return data.publicUrl
}

// ── EVENTS ──

export async function getEvents() {
  return supabase.from('events').select('*').order('event_date', { ascending: false })
}

export async function createEvent(event) {
  return supabase.from('events').insert(event)
}

// ── ATTENDANCE ──

export async function getUserAttendance(userId) {
  return supabase
    .from('attendance')
    .select('*, events(*)')
    .eq('user_id', userId)
    .order('checked_in_at', { ascending: false })
}

export async function getLeaderboard() {
  return supabase
    .from('profiles')
    .select('full_name, xp, tier, public_slug, avatar_url')
    .order('xp', { ascending: false })
    .limit(20)
}

// ── QR / CHECK-IN ──

export async function generateQR(eventId) {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-qr`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ event_id: eventId }),
    }
  )
  return res.json()
}

export async function validateCheckin(token) {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-checkin`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ token }),
    }
  )
  return res.json()
}

// ── TIER HELPERS ──

export const TIERS = {
  Explorer:  { min: 0,    color: '#888', icon: '🌱', next: 'Builder',   nextXP: 500  },
  Builder:   { min: 500,  color: '#FF9900', icon: '⚡', next: 'Architect', nextXP: 1200 },
  Architect: { min: 1200, color: '#3B82F6', icon: '🏗️', next: 'Pioneer',  nextXP: 2000 },
  Pioneer:   { min: 2000, color: '#A855F7', icon: '🚀', next: null,       nextXP: null },
}

export function getTierProgress(xp) {
  const tier = xp >= 2000 ? 'Pioneer' : xp >= 1200 ? 'Architect' : xp >= 500 ? 'Builder' : 'Explorer'
  const info = TIERS[tier]
  const prevXP = info.min
  const nextXP = info.nextXP ?? info.min
  const pct = info.nextXP ? Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100) : 100
  return { tier, pct: Math.min(pct, 100), nextXP: info.nextXP, icon: info.icon, color: info.color }
}
