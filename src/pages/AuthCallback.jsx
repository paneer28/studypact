import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe()
        navigate('/dashboard', { replace: true })
      }
    })

    // Also check if session already exists (e.g. code already exchanged)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        subscription.unsubscribe()
        navigate('/dashboard', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="text-center space-y-3">
        <svg className="w-8 h-8 animate-spin text-brand-400 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-slate-500 text-sm">Signing you in…</p>
      </div>
    </div>
  )
}
