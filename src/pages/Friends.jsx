import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useFriendsCtx } from '../context/FriendsContext.jsx'

function Avatar({ username, size = 9, color = '#C8871E' }) {
  const initials = (username ?? '??').slice(0, 2).toUpperCase()
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-sm font-bold shrink-0`}
      style={{ background: `${color}22`, color, border: `1px solid ${color}44`, minWidth: `${size * 4}px`, minHeight: `${size * 4}px` }}
    >
      {initials}
    </div>
  )
}

function UserRow({ user, action }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors">
      <Avatar username={user.username} />
      <div className="flex-1 min-w-0">
        <p className="text-stone-200 text-sm font-medium truncate">@{user.username}</p>
        {user.school && <p className="text-stone-600 text-xs truncate">{user.school}</p>}
      </div>
      {action}
    </div>
  )
}

// Search bar + results
function FriendSearch({ searchUsers, friends, outgoing, onRequest }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [busy,    setBusy]    = useState(false)

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const t = setTimeout(async () => {
      const data = await searchUsers(query)
      setResults(data)
    }, 280)
    return () => clearTimeout(t)
  }, [query, searchUsers])

  const friendIds  = new Set(friends.map((f) => f.user?.id))
  const outIds     = new Set(outgoing.map((f) => f.user?.id))

  const request = async (userId) => {
    setBusy(true)
    await onRequest(userId)
    setBusy(false)
    setQuery('')
    setResults([])
  }

  return (
    <div className="space-y-2">
      <input
        className="input"
        placeholder="Search by username…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(180,130,60,0.14)', background: '#1C1610' }}>
          {results.map((u) => {
            const alreadyFriend  = friendIds.has(u.id)
            const alreadySent    = outIds.has(u.id)
            return (
              <UserRow
                key={u.id}
                user={u}
                action={
                  alreadyFriend ? (
                    <span className="text-xs text-stone-600 font-mono">friends</span>
                  ) : alreadySent ? (
                    <span className="text-xs text-stone-600 font-mono">sent</span>
                  ) : (
                    <button
                      onClick={() => request(u.id)}
                      disabled={busy}
                      className="btn-primary text-xs py-1 px-3"
                    >
                      Add
                    </button>
                  )
                }
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Friends() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { friends, incoming, outgoing, loading, sendRequest, accept, decline, remove, searchUsers, sendInvite, pendingSent, cancelInvite } = useFriendsCtx()
  const [toast, setToast] = useState('')

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleRequest = async (userId) => {
    const { error } = await sendRequest(userId)
    if (error) flash('Could not send request: ' + error.message)
    else flash('Friend request sent!')
  }

  const handleAccept = async (friendshipId) => {
    await accept(friendshipId)
    flash('Friend added!')
  }

  const handleInvite = async (userId) => {
    const { error } = await sendInvite(userId)
    if (error) flash('Could not send invite: ' + error.message)
    else flash('Study invite sent! They\'ll see it on their dashboard.')
  }

  const sentInviteUserIds = new Set(pendingSent.map((i) => i.to_user?.id))

  if (loading) {
    return (
      <div className="animate-fade-up space-y-4">
        <div className="card h-40 flex items-center justify-center text-stone-600 text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up space-y-5 max-w-2xl mx-auto">

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl"
             style={{ background: '#272014', border: '1px solid rgba(200,135,30,0.3)', color: '#D4940A' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-stone-100">Study friends</h1>
        <p className="text-stone-500 text-sm mt-1">Add friends and invite them to your library table instead of going random.</p>
      </div>

      {/* Search */}
      <section className="card space-y-3">
        <h2 className="font-display text-lg font-semibold text-stone-200">Find someone</h2>
        <FriendSearch
          searchUsers={searchUsers}
          friends={friends}
          outgoing={outgoing}
          onRequest={handleRequest}
        />
      </section>

      {/* Incoming requests */}
      {incoming.length > 0 && (
        <section className="card space-y-1">
          <h2 className="font-display text-lg font-semibold text-stone-200 mb-2">
            Pending requests
            <span className="ml-2 badge">{incoming.length}</span>
          </h2>
          {incoming.map(({ friendshipId, user }) => (
            <UserRow
              key={friendshipId}
              user={user}
              action={
                <div className="flex gap-1.5">
                  <button onClick={() => handleAccept(friendshipId)} className="btn-primary text-xs py-1 px-3">Accept</button>
                  <button onClick={() => decline(friendshipId)}      className="btn-secondary text-xs py-1 px-2">✕</button>
                </div>
              }
            />
          ))}
        </section>
      )}

      {/* Outgoing requests */}
      {outgoing.length > 0 && (
        <section className="card space-y-1">
          <h2 className="font-display text-lg font-semibold text-stone-200 mb-2 text-stone-400">Sent requests</h2>
          {outgoing.map(({ friendshipId, user }) => (
            <UserRow
              key={friendshipId}
              user={user}
              action={
                <button onClick={() => decline(friendshipId)} className="text-xs text-stone-600 hover:text-stone-400 font-mono transition-colors">Cancel</button>
              }
            />
          ))}
        </section>
      )}

      {/* Friends list */}
      <section className="card space-y-1">
        <h2 className="font-display text-lg font-semibold text-stone-200 mb-2">
          Friends {friends.length > 0 && <span className="text-stone-600 font-sans font-normal text-sm">({friends.length})</span>}
        </h2>
        {friends.length === 0 ? (
          <p className="text-stone-600 text-sm py-2">No friends yet — search for someone above.</p>
        ) : (
          friends.map(({ friendshipId, user }) => {
            const inviteSent = sentInviteUserIds.has(user?.id)
            return (
              <UserRow
                key={friendshipId}
                user={user}
                action={
                  <div className="flex items-center gap-1.5">
                    {inviteSent ? (
                      <span className="text-xs font-mono text-stone-600 italic">invite sent…</span>
                    ) : (
                      <button
                        onClick={() => handleInvite(user.id)}
                        className="btn-primary text-xs py-1 px-3"
                      >
                        Invite to study
                      </button>
                    )}
                    <button
                      onClick={() => remove(friendshipId)}
                      className="text-xs text-stone-700 hover:text-stone-500 font-mono transition-colors ml-1"
                      title="Remove friend"
                    >
                      ✕
                    </button>
                  </div>
                }
              />
            )
          })
        )}
      </section>

    </div>
  )
}
