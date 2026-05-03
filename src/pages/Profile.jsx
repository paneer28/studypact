import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import ProfileCard from '../components/profile/ProfileCard.jsx'

const BADGES = [
  { key: 'on_fire', label: '🔥 On Fire', desc: '7-day streak', test: (p) => (p.streak ?? 0) >= 7 },
  { key: 'scholar', label: '📚 Scholar', desc: '10 sessions completed', test: (p) => (p.sessions_completed ?? 0) >= 10 },
  { key: 'trusted', label: '✅ Trusted', desc: '50 approvals given', test: (p) => (p.approvals_given ?? 0) >= 50 },
]

export default function Profile() {
  const { profile, refreshProfile } = useAuth()
  const [recent, setRecent] = useState([])

  useEffect(() => {
    refreshProfile()
    if (!profile?.id) return
    supabase
      .from('sessions')
      .select('id, task_a, task_b, status, user_a, user_b, completed_at, started_at')
      .or(`user_a.eq.${profile.id},user_b.eq.${profile.id}`)
      .order('started_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setRecent(data ?? []))
  }, [profile?.id]) // eslint-disable-line

  if (!profile) return <div className="card">Loading…</div>

  return (
    <div className="space-y-6">
      <ProfileCard profile={profile} />

      <section className="card">
        <h3 className="font-semibold mb-3">Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {BADGES.map((b) => {
            const earned = b.test(profile)
            return (
              <div key={b.key} className={`rounded-xl border p-3 ${earned ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
                <div className="font-medium">{b.label}</div>
                <div className="text-xs text-slate-500">{b.desc}</div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="card">
        <h3 className="font-semibold mb-3">Recent sessions</h3>
        {recent.length === 0 ? (
          <p className="text-slate-500 text-sm">No sessions yet. Go match with someone!</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((s) => {
              const task = s.user_a === profile.id ? s.task_a : s.task_b
              return (
                <li key={s.id} className="py-2 flex items-center justify-between text-sm">
                  <span>{task ?? <em className="text-slate-400">no task recorded</em>}</span>
                  <span className={`text-xs uppercase tracking-wide ${s.status === 'completed' ? 'text-emerald-600' : s.status === 'disputed' ? 'text-red-600' : 'text-slate-500'}`}>
                    {s.status}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
