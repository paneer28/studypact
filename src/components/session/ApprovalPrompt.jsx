import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useSession } from '../../context/SessionContext.jsx'
import { awardXp, bumpStreak } from '../../lib/xp.js'

export default function ApprovalPrompt() {
  const { session, profile, partner, iAm, partnerSide, partnerTask, partnerDone, myDone } = useSession()
  const [busy, setBusy] = useState(false)
  const [disputing, setDisputing] = useState(false)
  const [reason, setReason] = useState('')

  if (!partnerDone) return null

  const partnerApprovedMe = session[`user_${partnerSide}_approved`]
  const iApprovedPartner = session[`user_${iAm}_approved`]

  const approve = async () => {
    setBusy(true)
    const partnerId = session[`user_${partnerSide}`]
    await supabase
      .from('sessions')
      .update({ [`user_${iAm}_approved`]: true })
      .eq('id', session.id)

    // Approver awards
    await awardXp(profile.id, 'gave_approval', session.id)
    await supabase.from('users').update({
      approvals_given: (profile.approvals_given ?? 0) + 1,
    }).eq('id', profile.id)

    // Partner: approval reward
    await awardXp(partnerId, 'approved_partner', session.id)

    // If both mutual: complete
    const otherApproved = partnerApprovedMe
    if (otherApproved && myDone) {
      await completeSession(session, [profile.id, partnerId])
    }
    setBusy(false)
  }

  const dispute = async () => {
    if (!reason.trim()) return
    setBusy(true)
    await supabase.from('messages').insert({
      session_id: session.id,
      sender_id: profile.id,
      content: `Disputed: ${reason.trim()}`,
      type: 'system',
    })
    await supabase.from('sessions').update({ status: 'disputed' }).eq('id', session.id)
    setBusy(false)
  }

  if (iApprovedPartner) {
    return (
      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-300">
        You approved {partner?.username ?? 'your partner'}. Nice.
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4">
      <p className="text-sm text-slate-300">
        <b>{partner?.username ?? 'Your partner'}</b> says they're done with:
      </p>
      <p className="mt-1 text-slate-200">"{partnerTask}"</p>
      {!disputing ? (
        <div className="mt-3 flex gap-2">
          <button onClick={approve} disabled={busy} className="btn-primary">✅ Approve</button>
          <button onClick={() => setDisputing(true)} disabled={busy} className="btn-danger">❌ Dispute</button>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <textarea
            className="input"
            rows={2}
            placeholder="What went wrong?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={dispute} disabled={busy || !reason.trim()} className="btn-danger">Submit dispute</button>
            <button onClick={() => setDisputing(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

async function completeSession(session, userIds) {
  const { data: fresh } = await supabase.from('sessions').select('*').eq('id', session.id).single()
  if (!fresh) return
  if (!(fresh.user_a_done && fresh.user_b_done && fresh.user_a_approved && fresh.user_b_approved)) return
  if (fresh.status === 'completed') return
  // Conditional update: only the first client to flip status wins and awards XP.
  const { data: updated } = await supabase
    .from('sessions')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', session.id)
    .eq('status', 'active')
    .select()
  if (!updated || updated.length === 0) return
  for (const uid of userIds) {
    await awardXp(uid, 'session_complete', session.id)
    await bumpStreak(uid)
  }
}
