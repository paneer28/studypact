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
  // DB trigger sync_user_xp handles updating users.xp and users.level
  await supabase.from('xp_events').insert({ user_id: userId, amount, reason, session_id: sessionId })
}

export async function bumpStreak(userId) {
  // SECURITY DEFINER RPC handles streak, last_session_date, sessions_completed, and streak_bonus XP
  await supabase.rpc('bump_streak', { p_user_id: userId })
}
