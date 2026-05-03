import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useSession } from '../../context/SessionContext.jsx'
import { awardXp } from '../../lib/xp.js'

const COOLDOWN_MS = 5 * 60 * 1000

export default function CalloutButton() {
  const { session, profile, partner } = useSession()
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const remaining = Math.max(0, cooldownUntil - now)
  const disabled = remaining > 0 || !partner

  const onCallout = async () => {
    if (disabled) return
    const targetId = session.user_a === profile.id ? session.user_b : session.user_a
    await supabase.from('callouts').insert({
      session_id: session.id,
      caller_id: profile.id,
      target_id: targetId,
    })
    await supabase.from('messages').insert({
      session_id: session.id,
      sender_id: profile.id,
      content: 'Get back on track!',
      type: 'callout',
    })
    // Penalty: if partner has 3+ callouts in this session, dock 10 XP.
    const { data: calls } = await supabase
      .from('callouts')
      .select('id')
      .eq('session_id', session.id)
      .eq('target_id', targetId)
    if ((calls?.length ?? 0) >= 3) {
      await awardXp(targetId, 'callout_penalty', session.id)
    }
    setCooldownUntil(Date.now() + COOLDOWN_MS)
  }

  const label = remaining > 0
    ? `Wait ${Math.ceil(remaining / 1000)}s`
    : '👀 Call out partner'

  return (
    <button
      onClick={onCallout}
      disabled={disabled}
      className={`btn ${disabled ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
      title="Pings your partner if they look distracted"
    >
      {label}
    </button>
  )
}
