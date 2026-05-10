import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

const MEDALS = ['🥇', '🥈', '🥉']

export default function GlobalLeaderboard() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        setRows([...agg.values()].sort((a, b) => b.weekly - a.weekly).slice(0, 25))
        setLoading(false)
      })
  }, [])

  return <LeaderboardTable title="Global — this week" rows={rows} loading={loading} />
}

export function LeaderboardTable({ title, rows, loading }) {
  return (
    <section className="card space-y-4">
      <h3 className="font-display text-xl font-semibold text-stone-100">{title}</h3>
      {loading ? (
        <p className="text-stone-600 text-sm">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-stone-600 text-sm">No XP events this week yet.</p>
      ) : (
        <ol className="space-y-1">
          {rows.map((r, i) => (
            <li
              key={r.user.id}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
              style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(180,130,60,0.08)' : 'none' }}
            >
              <span className="flex items-center gap-3">
                <span className="w-6 text-center text-sm">
                  {i < 3 ? MEDALS[i] : <span className="text-stone-600 font-mono">{i + 1}</span>}
                </span>
                <span className="font-medium text-stone-200">{r.user.username}</span>
                {r.user.school && (
                  <span className="text-xs text-stone-600 hidden sm:inline">· {r.user.school}</span>
                )}
              </span>
              <span className="text-sm font-mono font-semibold text-brand-500">{r.weekly} XP</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
