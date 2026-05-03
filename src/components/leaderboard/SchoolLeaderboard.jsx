import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { LeaderboardTable } from './GlobalLeaderboard.jsx'

export default function SchoolLeaderboard({ school }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!school) { setLoading(false); return }
    const since = new Date(Date.now() - 7 * 86400000).toISOString()
    supabase
      .from('xp_events')
      .select('amount, user_id, users!inner(id, username, school, xp)')
      .eq('users.school', school)
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
  }, [school])

  if (!school) {
    return (
      <section className="card">
        <h3 className="font-semibold">School leaderboard</h3>
        <p className="text-slate-500 text-sm mt-1">Set a school on your profile to see this.</p>
      </section>
    )
  }
  return <LeaderboardTable title={`${school} — this week`} rows={rows} loading={loading} />
}
