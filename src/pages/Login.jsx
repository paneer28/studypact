import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import LoginForm from '../components/auth/LoginForm.jsx'
import SignupForm from '../components/auth/SignupForm.jsx'

export default function Login() {
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  const [mode, setMode] = useState(initialMode)
  const { user, loading, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [googleErr, setGoogleErr] = useState('')
  const [googleBusy, setGoogleBusy] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true })
  }, [user, loading, navigate])

  const handleGoogle = async () => {
    setGoogleErr('')
    setGoogleBusy(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      setGoogleErr(e.message ?? 'Google sign-in failed')
      setGoogleBusy(false)
    }
  }

  if (loading) return null

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4">
            <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            {mode === 'signup' ? 'Join StudyPact' : 'Welcome back'}
          </h1>
          <p className="text-slate-500 text-sm">
            {mode === 'signup'
              ? 'Start studying with accountability partners'
              : 'Sign in to your account'}
          </p>
        </div>

        <div className="card space-y-5">
          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl bg-surface-900 border border-white/[0.05]">
            {['signup', 'login'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  mode === m
                    ? 'bg-brand-500 text-surface-950 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={googleBusy}
            className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: '#1c1c2a',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onMouseEnter={e => { if (!googleBusy) e.currentTarget.style.background = '#252535' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1c1c2a' }}
          >
            {googleBusy ? (
              <svg className="w-4 h-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {googleErr && (
            <p className="text-red-400 text-xs flex items-center gap-1.5 -mt-2">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {googleErr}
            </p>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.07]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-slate-600" style={{ background: '#13131e' }}>
                or continue with email
              </span>
            </div>
          </div>

          {/* Email/password form */}
          {mode === 'signup' ? <SignupForm /> : <LoginForm />}
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-slate-600 mt-5">
          {mode === 'signup' ? (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
                Sign in
              </button>
            </>
          ) : (
            <>Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
                Create one
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  )
}
