import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Session from './pages/Session.jsx'
import Profile from './pages/Profile.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import LaunchArticle from './pages/LaunchArticle.jsx'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8 text-center text-slate-600 font-mono text-sm">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function MainLayout({ children }) {
  const { pathname } = useLocation()
  const isSession = pathname.startsWith('/session/')
  if (isSession) return <>{children}</>
  return <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
}

export default function App() {
  return (
    <div className="min-h-dvh font-body">
      <Nav />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/launch" element={<LaunchArticle />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/session/:id" element={<Protected><Session /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/leaderboard" element={<Protected><Leaderboard /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </div>
  )
}
