import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Nav() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const tab = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'text-brand-400 bg-brand-500/10'
        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
    }`

  return (
    <header className="border-b border-white/[0.06] bg-surface-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-1.5">
          <svg className="w-5 h-5 text-brand-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          <span className="font-display font-bold text-base tracking-wide text-white">
            Study<span className="text-brand-400">Pact</span>
          </span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-0.5">
            <NavLink to="/dashboard" className={tab}>Dashboard</NavLink>
            <NavLink to="/leaderboard" className={tab}>Leaderboard</NavLink>
            <NavLink to="/profile" className={tab}>Profile</NavLink>
            <div className="w-px h-4 bg-white/10 mx-2 hidden sm:block" />
            <span className="text-sm text-slate-600 font-mono hidden sm:inline mr-2">
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
