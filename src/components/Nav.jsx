import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useFriends } from '../hooks/useFriends.js'

export default function Nav() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const { incoming } = useFriends(profile)
  const pendingCount = incoming.length

  const tab = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm transition-all duration-150 font-medium ${
      isActive
        ? 'text-brand-400 bg-brand-500/10'
        : 'text-stone-500 hover:text-stone-200 hover:bg-white/[0.04]'
    }`

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(18,14,8,0.88)',
        backdropFilter: 'blur(14px)',
        borderColor: 'rgba(180,130,60,0.12)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
          <span className="text-brand-500 text-lg">📚</span>
          <span className="font-display font-bold text-lg text-stone-100 tracking-wide leading-none group-hover:text-brand-400 transition-colors">
            Study<span className="text-brand-500">Pact</span>
          </span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-0.5">
            <NavLink to="/dashboard"   className={tab}>Dashboard</NavLink>
            <NavLink to="/friends"     className={tab}>
              <span className="relative">
                Friends
                {pendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-surface-900" />
                )}
              </span>
            </NavLink>
            <NavLink to="/leaderboard" className={tab}>Leaderboard</NavLink>
            <NavLink to="/profile"     className={tab}>Profile</NavLink>

            <div className="w-px h-4 mx-2 hidden sm:block" style={{ background: 'rgba(180,130,60,0.18)' }} />

            <span className="text-xs text-stone-600 font-mono hidden sm:inline mr-2">
              {profile?.username ?? ''}
            </span>
            <button
              onClick={async () => { await signOut(); navigate('/') }}
              className="btn-secondary py-1.5 text-xs"
            >
              Sign out
            </button>
          </nav>
        ) : null}
      </div>
    </header>
  )
}
