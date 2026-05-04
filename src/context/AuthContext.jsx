import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (authId) => {
    if (!authId) return setProfile(null)
    const { data } = await supabase.from('users').select('*').eq('auth_id', authId).maybeSingle()
    setProfile(data ?? null)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      loadProfile(data.session?.user?.id).finally(() => setLoading(false))
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      loadProfile(s?.user?.id)
    })
    return () => sub.subscription.unsubscribe()
  }, [loadProfile])

  // Email/password signup — profile row is created by the DB trigger (handle_new_auth_user).
  // Username from options.data is read by the trigger from raw_user_meta_data.
  const signUp = async ({ email, password, username }) => {
    const school = email.match(/@([^.]+\.edu)$/i)?.[1] ?? null
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, school, school_verified: !!school } },
    })
    if (error) throw error
  }

  const signIn = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  const refreshProfile = () => loadProfile(session?.user?.id)

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, profile, loading, signUp, signIn, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
