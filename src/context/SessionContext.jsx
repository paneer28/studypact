import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'

const SessionContext = createContext(null)

export function SessionProvider({ sessionId, children }) {
  const { profile } = useAuth()
  const [session, setSession] = useState(null)
  const [partner, setPartner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Initial load + realtime updates
  useEffect(() => {
    let active = true
    const load = async () => {
      const { data, error: err } = await supabase.from('sessions').select('*').eq('id', sessionId).single()
      if (!active) return
      if (err) { setError(err.message); setLoading(false); return }
      setSession(data)
      setLoading(false)
    }
    load()

    const ch = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` }, (payload) => {
        setSession(payload.new)
      })
      .subscribe()

    return () => { active = false; supabase.removeChannel(ch) }
  }, [sessionId])

  // Resolve partner profile
  useEffect(() => {
    if (!session || !profile) return
    const partnerId = session.user_a === profile.id ? session.user_b : session.user_a
    if (!partnerId || partner?.id === partnerId) return
    supabase.from('users').select('*').eq('id', partnerId).single().then(({ data }) => setPartner(data))
  }, [session, profile, partner?.id])

  const iAm = session && profile ? (session.user_a === profile.id ? 'a' : 'b') : null
  const myTask = session && iAm ? session[`task_${iAm}`] : null
  const myDuration = session && iAm ? session[`duration_${iAm}`] : null
  const myDone = session && iAm ? session[`user_${iAm}_done`] : false
  const partnerSide = iAm === 'a' ? 'b' : 'a'
  const partnerTask = session && partnerSide ? session[`task_${partnerSide}`] : null
  const partnerDone = session && partnerSide ? session[`user_${partnerSide}_done`] : false
  const bothCommitted = !!(session?.task_a && session?.task_b)

  return (
    <SessionContext.Provider value={{
      session, partner, loading, error,
      iAm, partnerSide, myTask, myDuration, myDone, partnerTask, partnerDone, bothCommitted,
      profile,
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
