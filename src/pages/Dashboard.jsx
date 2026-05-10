import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useMatchmaking } from '../hooks/useMatchmaking.js'
import { useLibraryData } from '../hooks/useLibraryData.js'
import MatchQueue from '../components/matchmaking/MatchQueue.jsx'
import MatchFound from '../components/matchmaking/MatchFound.jsx'
import XPBar from '../components/profile/XPBar.jsx'
import StreakDisplay from '../components/profile/StreakDisplay.jsx'

export default function Dashboard() {
  const { profile, refreshProfile } = useAuth()
  const { status, matchedSessionId, error, join, leave } = useMatchmaking(profile)
  const { studyingCount } = useLibraryData(profile, null)

  useEffect(() => { refreshProfile() }, []) // eslint-disable-line

  if (!profile) {
    return (
      <div className="card flex items-center gap-3 text-slate-500 animate-fade-up">
        <svg className="w-4 h-4 animate-spin text-brand-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Setting up your profile…
      </div>
    )
  }

  return (
    <div className="space-y-4 py-2 animate-fade-up">

      {/* Profile hero */}
      <section className="relative rounded-2xl border border-white/[0.07] bg-surface-800 p-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600 mb-1">Welcome back</p>
            <h2 className="font-display text-3xl font-bold text-white leading-none">{profile.username}</h2>
            {profile.school && (
              <p className="text-slate-500 text-sm mt-2 flex items-center gap-1.5">
                {profile.school}
                {profile.school_verified && (
                  <span className="inline-flex items-center gap-1 text-brand-400 text-xs">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </p>
            )}
          </div>
          <StreakDisplay streak={profile.streak} />
        </div>

        <div className="relative mt-6">
          <XPBar xp={profile.xp} level={profile.level} />
        </div>

        <div className="relative mt-4 grid grid-cols-3 gap-2.5">
          <Stat label="Sessions" value={profile.sessions_completed ?? 0} />
          <Stat label="Approvals" value={profile.approvals_given ?? 0} />
          <Stat label="Total XP" value={profile.xp ?? 0} />
        </div>
      </section>

      {/* Library presence bar */}
      {studyingCount > 0 && (
        <section className="rounded-2xl border border-amber-500/20 px-5 py-3 flex items-center gap-3"
                 style={{ background: 'rgba(120,50,10,0.18)' }}>
          <span className="flex gap-0.5">
            {Array.from({ length: Math.min(studyingCount, 12) }).map((_, i) => (
              <span key={i} className="w-1.5 h-4 rounded-full bg-amber-500/60" style={{ height: `${12 + Math.sin(i * 1.7) * 6}px` }} />
            ))}
          </span>
          <div>
            <p className="text-sm font-medium text-amber-300">
              <span className="font-mono font-bold">{studyingCount}</span> students in the library right now
            </p>
            {profile?.school && (
              <p className="text-xs text-amber-500/60 mt-0.5">
                The {profile.school} library is open
              </p>
            )}
          </div>
        </section>
      )}

      {/* Matchmaking */}
      {status === 'idle' && (
        <section className="card text-center py-10">
          <div className="w-11 h-11 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-bold text-white">Ready to lock in?</h3>
          <p className="text-slate-500 mt-1.5 text-sm max-w-xs mx-auto">
            Get matched with a partner who's serious about getting work done.
          </p>
          <button onClick={join} className="btn-primary mt-5 text-sm px-8 py-2.5 rounded-xl">
            Find a partner
          </button>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </section>
      )}
      {status === 'waiting' && <MatchQueue onCancel={leave} />}
      {status === 'matched' && matchedSessionId && <MatchFound sessionId={matchedSessionId} />}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-900 border border-white/[0.05] py-3 text-center">
      <div className="font-mono text-xl font-medium text-white tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-slate-600 mt-0.5">{label}</div>
    </div>
  )
}
