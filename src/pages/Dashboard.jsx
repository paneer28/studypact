import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useMatchmaking } from '../hooks/useMatchmaking.js'
import { useLibraryData } from '../hooks/useLibraryData.js'
import { useFriends } from '../hooks/useFriends.js'
import { useStudyInvites } from '../hooks/useStudyInvites.js'
import MatchQueue from '../components/matchmaking/MatchQueue.jsx'
import MatchFound from '../components/matchmaking/MatchFound.jsx'
import XPBar from '../components/profile/XPBar.jsx'
import StreakDisplay from '../components/profile/StreakDisplay.jsx'

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()
  const { status, matchedSessionId, error, join, leave } = useMatchmaking(profile)
  const { studyingCount } = useLibraryData(profile, null)
  const { friends } = useFriends(profile)
  const { pendingReceived, pendingSent, sendInvite, acceptInvite, declineInvite } = useStudyInvites(profile)
  const [mode, setMode] = useState('random') // 'random' | 'friends'
  const [inviteBusy, setInviteBusy] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => { refreshProfile() }, []) // eslint-disable-line

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3200) }

  const handleInvite = async (userId) => {
    setInviteBusy(userId)
    const { error: err } = await sendInvite(userId)
    setInviteBusy(null)
    if (err) flash('Could not send invite.')
    else flash('Invite sent! They\'ll see it on their dashboard.')
  }

  const handleAcceptInvite = async (invite) => {
    setInviteBusy(invite.id)
    const sessionId = await acceptInvite(invite.id)
    setInviteBusy(null)
    if (sessionId) navigate(`/session/${sessionId}`)
    else flash('Could not accept invite — try again.')
  }

  const handleDeclineInvite = async (invite) => {
    await declineInvite(invite.id)
  }

  const sentInviteUserIds = new Set(pendingSent.map((i) => i.to_user?.id))

  if (!profile) {
    return (
      <div className="card flex items-center gap-3 text-stone-500 animate-fade-up">
        <svg className="w-4 h-4 animate-spin" style={{ color: '#C8871E' }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Setting up your profile…
      </div>
    )
  }

  return (
    <div className="space-y-4 py-2 animate-fade-up max-w-2xl mx-auto">

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl"
             style={{ background: '#272014', border: '1px solid rgba(200,135,30,0.3)', color: '#D4940A' }}>
          {toast}
        </div>
      )}

      {/* Incoming study invites banner */}
      {pendingReceived.length > 0 && (
        <section className="rounded-2xl border px-5 py-4 space-y-3"
                 style={{ background: 'rgba(120,50,10,0.22)', borderColor: 'rgba(200,135,30,0.35)' }}>
          <p className="text-sm font-semibold" style={{ color: '#D4940A' }}>
            📬 {pendingReceived.length === 1 ? 'Someone wants to study with you!' : `${pendingReceived.length} people want to study with you!`}
          </p>
          {pendingReceived.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="text-stone-200 text-sm font-medium">@{invite.from_user?.username}</span>
                {invite.from_user?.school && (
                  <span className="text-stone-600 text-xs ml-2">{invite.from_user.school}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAcceptInvite(invite)}
                  disabled={inviteBusy === invite.id}
                  className="btn-primary text-xs py-1.5 px-4"
                >
                  {inviteBusy === invite.id ? 'Joining…' : 'Join them →'}
                </button>
                <button
                  onClick={() => handleDeclineInvite(invite)}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Profile hero */}
      <section className="relative rounded-2xl border overflow-hidden p-6"
               style={{ background: '#1C1610', borderColor: 'rgba(180,130,60,0.15)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 80% -20%, rgba(200,135,30,0.07), transparent 60%)' }} />

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone-600 mb-1">Welcome back</p>
            <h2 className="font-display text-3xl font-bold text-stone-100 leading-none">{profile.username}</h2>
            {profile.school && (
              <p className="text-stone-500 text-sm mt-2 flex items-center gap-1.5">
                {profile.school}
                {profile.school_verified && (
                  <span className="inline-flex items-center gap-1 text-xs" style={{ color: '#D4940A' }}>
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
        <section className="rounded-2xl border px-5 py-3 flex items-center gap-3"
                 style={{ background: 'rgba(120,50,10,0.15)', borderColor: 'rgba(200,135,30,0.2)' }}>
          <span className="flex gap-0.5 items-end">
            {Array.from({ length: Math.min(studyingCount, 12) }).map((_, i) => (
              <span key={i} className="w-1.5 rounded-full"
                    style={{ height: `${10 + Math.sin(i * 1.7) * 5}px`, background: 'rgba(200,135,30,0.55)' }} />
            ))}
          </span>
          <div>
            <p className="text-sm font-medium" style={{ color: '#D4940A' }}>
              <span className="font-mono font-bold">{studyingCount}</span> students in the library right now
            </p>
            {profile?.school && (
              <p className="text-xs text-stone-600 mt-0.5">The {profile.school} library is open</p>
            )}
          </div>
        </section>
      )}

      {/* Matchmaking */}
      {status === 'idle' && (
        <section className="card space-y-5">
          <div>
            <h3 className="font-display text-xl font-bold text-stone-100">Ready to study?</h3>
            <p className="text-stone-500 text-sm mt-1">Choose how you want to find a partner.</p>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: '#120E08', border: '1px solid rgba(180,130,60,0.1)' }}>
            <button
              onClick={() => setMode('random')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'random'
                  ? 'text-stone-900 font-semibold'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
              style={mode === 'random' ? { background: 'linear-gradient(135deg, #C8871E, #D4940A)' } : {}}
            >
              🎲 Random partner
            </button>
            <button
              onClick={() => setMode('friends')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all relative ${
                mode === 'friends'
                  ? 'text-stone-900 font-semibold'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
              style={mode === 'friends' ? { background: 'linear-gradient(135deg, #C8871E, #D4940A)' } : {}}
            >
              👥 Study with a friend
              {friends.length > 0 && mode !== 'friends' && (
                <span className="absolute -top-1 -right-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                      style={{ background: '#C8871E', color: '#120E08' }}>
                  {friends.length}
                </span>
              )}
            </button>
          </div>

          {/* Random mode */}
          {mode === 'random' && (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                   style={{ background: 'rgba(200,135,30,0.1)', border: '1px solid rgba(200,135,30,0.2)' }}>
                <svg className="w-5 h-5" style={{ color: '#C8871E' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <p className="text-stone-500 text-sm max-w-xs mx-auto mb-5">
                Get matched with a serious student. You'll both commit to tasks and hold each other accountable.
              </p>
              <button onClick={join} className="btn-primary px-8 py-2.5 text-sm">
                Find a partner
              </button>
              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            </div>
          )}

          {/* Friends mode */}
          {mode === 'friends' && (
            <div>
              {friends.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-stone-500 text-sm mb-3">You haven't added any friends yet.</p>
                  <a href="/friends" className="btn-primary text-sm px-5 py-2">
                    Find friends →
                  </a>
                </div>
              ) : (
                <div className="space-y-1">
                  {friends.map(({ friendshipId, user }) => {
                    const invited = sentInviteUserIds.has(user?.id)
                    return (
                      <div key={friendshipId}
                           className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                        <FriendAvatar username={user?.username} />
                        <div className="flex-1 min-w-0">
                          <p className="text-stone-200 text-sm font-medium truncate">@{user?.username}</p>
                          {user?.school && <p className="text-stone-600 text-xs truncate">{user.school}</p>}
                        </div>
                        {invited ? (
                          <span className="text-xs font-mono text-stone-600 italic">invite sent…</span>
                        ) : (
                          <button
                            onClick={() => handleInvite(user.id)}
                            disabled={inviteBusy === user.id}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            {inviteBusy === user.id ? 'Sending…' : 'Invite'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {status === 'waiting' && <MatchQueue onCancel={leave} />}
      {status === 'matched' && matchedSessionId && <MatchFound sessionId={matchedSessionId} />}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl py-3 text-center" style={{ background: '#120E08', border: '1px solid rgba(180,130,60,0.08)' }}>
      <div className="font-mono text-xl font-medium text-stone-100 tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-stone-600 mt-0.5">{label}</div>
    </div>
  )
}

function FriendAvatar({ username }) {
  const initials = (username ?? '??').slice(0, 2).toUpperCase()
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
         style={{ background: 'rgba(200,135,30,0.15)', color: '#C8871E', border: '1px solid rgba(200,135,30,0.25)', minWidth: '36px' }}>
      {initials}
    </div>
  )
}
