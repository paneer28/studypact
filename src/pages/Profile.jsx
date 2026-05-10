import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import ProfileCard from '../components/profile/ProfileCard.jsx'

const BADGES = [
  { key: 'on_fire',  label: '🔥 On Fire',   desc: '7-day streak',          test: (p) => (p.streak ?? 0) >= 7 },
  { key: 'scholar',  label: '📚 Scholar',    desc: '10 sessions completed', test: (p) => (p.sessions_completed ?? 0) >= 10 },
  { key: 'trusted',  label: '✅ Trusted',    desc: '50 approvals given',    test: (p) => (p.approvals_given ?? 0) >= 50 },
  { key: 'bookworm', label: '🦉 Bookworm',   desc: '25 sessions completed', test: (p) => (p.sessions_completed ?? 0) >= 25 },
  { key: 'streak5',  label: '⚡ Consistent', desc: '5-day streak',          test: (p) => (p.streak ?? 0) >= 5 },
  { key: 'approver', label: '🤝 Good Peer',  desc: '10 approvals given',    test: (p) => (p.approvals_given ?? 0) >= 10 },
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

  if (!profile) return <div className="card text-stone-500">Loading…</div>

  const earned = BADGES.filter((b) => b.test(profile))
  const locked = BADGES.filter((b) => !b.test(profile))

  return (
    <div className="space-y-5 animate-fade-up">
      <ProfileCard profile={profile} />

      {/* Badges */}
      <section className="card space-y-4">
        <h3 className="font-display text-xl font-semibold text-stone-100">Badges</h3>
        {earned.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {earned.map((b) => (
              <div
                key={b.key}
                className="rounded-xl p-3 border"
                style={{ background: 'rgba(200,135,30,0.1)', borderColor: 'rgba(200,135,30,0.25)' }}
              >
                <div className="font-medium text-stone-200 text-sm">{b.label}</div>
                <div className="text-xs text-stone-500 mt-0.5">{b.desc}</div>
              </div>
            ))}
          </div>
        )}
        {locked.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {locked.map((b) => (
              <div key={b.key} className="rounded-xl p-3 border opacity-35"
                   style={{ background: 'rgba(60,40,20,0.4)', borderColor: 'rgba(180,130,60,0.1)' }}>
                <div className="font-medium text-stone-400 text-sm">{b.label}</div>
                <div className="text-xs text-stone-600 mt-0.5">{b.desc}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent sessions */}
      <section className="card space-y-3">
        <h3 className="font-display text-xl font-semibold text-stone-100">Recent sessions</h3>
        {recent.length === 0 ? (
          <p className="text-stone-500 text-sm">No sessions yet. Go find a study partner!</p>
        ) : (
          <ul className="space-y-1">
            {recent.map((s, i) => {
              const task = s.user_a === profile.id ? s.task_a : s.task_b
              const date = s.started_at ? new Date(s.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm"
                  style={{
                    background: 'rgba(39,32,20,0.5)',
                    borderBottom: i < recent.length - 1 ? '1px solid rgba(180,130,60,0.07)' : 'none',
                  }}
                >
                  <span className="text-stone-300 truncate mr-3">{task ?? <em className="text-stone-600">no task</em>}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-stone-600 font-mono">{date}</span>
                    <span className={`text-xs font-mono uppercase tracking-wide px-2 py-0.5 rounded-md ${
                      s.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400'
                      : s.status === 'disputed' ? 'bg-red-500/15 text-red-400'
                      : 'text-stone-600'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
