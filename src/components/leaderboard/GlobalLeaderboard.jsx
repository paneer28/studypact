import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

export default function GlobalLeaderboard() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Weekly XP = sum of xp_events for the last 7 days.
    const since = new Date(Date.now() - 7 * 86400000).toISOString()
    supabase
      .from('xp_events')
      .select('amount, user_id, users!inner(id, username, school, xp)')
      .gte('created_at', since)
      .then(({ data, error }) => {
        if (error) { setLoading(false); return }
        const agg = new Map()
        for (const ev of data ?? []) {
          const prev = agg.get(ev.user_id) ?? { user: ev.users, weekly: 0 }
          prev.weekly += ev.amount
          agg.set(ev.user_id, prev)
        }
        const list = [...agg.values()].sort((a, b) => b.weekly - a.weekly).slice(0, 25)
        setRows(list)
        setLoading(false)
      })
  }, [])

  return <LeaderboardTable title="Global — this week" rows={rows} loading={loading} />
}

export function LeaderboardTable({ title, rows, loading }) {
  return (
    <section className="card">
      <h3 className="font-semibold mb-3">{title}</h3>
      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-slate-500 text-sm">No XP events this week yet.</p>
      ) : (
        <ol className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <li key={r.user.id} className="py-2 flex items-center justify-between">
              <span className="flex items-center gap-3">
                <span className="w-6 text-right text-sm text-slate-500">{i + 1}</span>
                <span className="font-medium">{r.user.username}</span>
                {r.user.school && <span className="text-xs text-slate-500">· {r.user.school}</span>}
              </span>
              <span className="text-sm font-semibold text-brand-600">{r.weekly} XP</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
