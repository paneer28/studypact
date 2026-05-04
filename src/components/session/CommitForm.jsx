import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useSession } from '../../context/SessionContext.jsx'

const DURATIONS = [15, 30, 45, 60, 90]

export default function CommitForm() {
  const { session, iAm, partner } = useSession()
  const [task, setTask] = useState('')
  const [duration, setDuration] = useState(30)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const mine = session?.[`task_${iAm}`]
  const theirs = session?.[`task_${iAm === 'a' ? 'b' : 'a'}`]

  const submit = async (e) => {
    e.preventDefault()
    if (!task.trim()) return
    setBusy(true)
    setErr('')
    const { error } = await supabase
      .from('sessions')
      .update({ [`task_${iAm}`]: task.trim(), [`duration_${iAm}`]: duration })
      .eq('id', session.id)
    if (error) setErr(error.message)
    setBusy(false)
  }

  if (mine) {
    return (
      <div className="card">
        <h3 className="font-semibold text-lg">You committed to:</h3>
        <p className="mt-1 text-slate-300">{mine}</p>
        <p className="text-sm text-slate-400">for {session[`duration_${iAm}`]} min</p>
        {!theirs && (
          <p className="mt-3 text-slate-400 text-sm">
            Waiting for {partner?.username ?? 'your partner'} to commit…
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h3 className="text-lg font-semibold">What are you studying?</h3>
      <input
        className="input"
        placeholder="e.g. Finish calculus problem set"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        required
      />
      <div>
        <label className="text-sm text-slate-400">How long will it take?</label>
        <select
          className="input mt-1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          {DURATIONS.map((d) => <option key={d} value={d}>{d} minutes</option>)}
        </select>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Locking in…' : 'Lock in'}</button>
    </form>
  )
}
