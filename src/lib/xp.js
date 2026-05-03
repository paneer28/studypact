import { supabase } from './supabase.js'

export const XP_AWARDS = {
  session_complete: 50,
  approved_partner: 20,
  gave_approval: 10,
  streak_bonus: 25,
  callout_penalty: -10,
}

// Cumulative XP required to *reach* the start of each level. Level 1 starts at 0.
export const levelThresholds = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000]

export function levelForXp(xp) {
  let level = 1
  for (let i = 0; i < levelThresholds.length; i++) {
    if (xp >= levelThresholds[i]) level = i + 1
  }
  return level
}

export function progressInLevel(xp, level) {
  const idx = Math.max(0, level - 1)
  const floor = levelThresholds[idx] ?? 0
  const ceil = levelThresholds[idx + 1] ?? floor + 1000
  const current = xp - floor
  const needed = ceil - floor
  const pct = Math.min(100, Math.max(0, Math.round((current / needed) * 100)))
  return { current, needed, pct }
}

export async function awardXp(userId, reason, sessionId = null, amountOverride = null) {
  const amount = amountOverride ?? XP_AWARDS[reason] ?? 0
  if (amount === 0) return
  await supabase.from('xp_events').insert({ user_id: userId, amount, reason, session_id: sessionId })
  const { data: u } = await supabase.from('users').select('xp').eq('id', userId).single()
  const newXp = Math.max(0, (u?.xp ?? 0) + amount)
  await supabase.from('users').update({ xp: newXp, level: levelForXp(newXp) }).eq('id', userId)
}

export async function bumpStreak(userId) {
  const today = new Date().toISOString().slice(0, 10)
  const { data: u } = await supabase
    .from('users')
    .select('streak,last_session_date,sessions_completed')
    .eq('id', userId)
    .single()
  if (!u) return
  const last = u.last_session_date
  let streak = u.streak ?? 0
  if (last === today) {
    // same day — streak unchanged
  } else {
    const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    streak = last === yest ? streak + 1 : 1
  }
  await supabase.from('users').update({
    streak,
    last_session_date: today,
    sessions_completed: (u.sessions_completed ?? 0) + 1,
  }).eq('id', userId)
  if (streak > 0 && streak % 3 === 0) {
    await awardXp(userId, 'streak_bonus')
  }
}
