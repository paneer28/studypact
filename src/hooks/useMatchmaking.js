import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'

// Poll the queue every 3s. If another user is waiting, the earlier-joined user
// creates a session (to avoid double-creation races), removes both from the
// queue, and both clients pick up the new session on their next poll.
export function useMatchmaking(profile) {
  const [status, setStatus] = useState('idle') // idle | waiting | matched
  const [matchedSessionId, setMatchedSessionId] = useState(null)
  const [error, setError] = useState('')
  const pollRef = useRef(null)

  const findMatch = useCallback(async () => {
    if (!profile) return

    // 1. Check for an already-existing active session for this user (in case we
    //    missed the transition). Also clean up our queue entry if found.
    const { data: existing } = await supabase
      .from('sessions')
      .select('id,status')
      .or(`user_a.eq.${profile.id},user_b.eq.${profile.id}`)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
    if (existing && existing.length > 0) {
      // Clean up our own queue entry (partner's was already cleaned by creator,
      // or creator's was cleaned when they matched us).
      await supabase.from('queue').delete().eq('user_id', profile.id)
      setMatchedSessionId(existing[0].id)
      setStatus('matched')
      return
    }

    // 2. Look for anyone else in the queue.
    const { data: others, error: qErr } = await supabase
      .from('queue')
      .select('*')
      .neq('user_id', profile.id)
      .order('joined_at', { ascending: true })
      .limit(10)
    if (qErr) return setError(qErr.message)

    // Prefer same school; fall back to any.
    const sameSchool = others?.find((o) => o.school && o.school === profile.school)
    const partner = sameSchool ?? others?.[0]

    if (partner) {
      // Deterministically pick creator: lowest user_id creates the session.
      const iAmCreator = profile.id < partner.user_id
      if (iAmCreator) {
        const { data: sess, error: sErr } = await supabase
          .from('sessions')
          .insert({ user_a: profile.id, user_b: partner.user_id, status: 'active' })
          .select()
          .single()
        if (sErr) return setError(sErr.message)
        // Only delete our own row — RLS won't allow deleting partner's row.
        // Partner cleans up their own entry when they detect the session in step 1.
        await supabase.from('queue').delete().eq('user_id', profile.id)
        setMatchedSessionId(sess.id)
        setStatus('matched')
      }
      // If I'm not the creator, the other user will insert the session.
      // On the next poll, step 1 above will find it and clean up my queue entry.
    }
  }, [profile])

  const join = useCallback(async () => {
    if (!profile) return
    setError('')
    // Use ignoreDuplicates instead of upsert — avoids triggering an UPDATE
    // which would fail RLS (there is no UPDATE policy on queue).
    const { error: insErr } = await supabase
      .from('queue')
      .insert({ user_id: profile.id, school: profile.school })
      .select()
    // Ignore unique-violation (already in queue)
    if (insErr && !insErr.message?.includes('duplicate') && !insErr.code?.includes('23505')) {
      return setError(insErr.message)
    }
    setStatus('waiting')
  }, [profile])

  const leave = useCallback(async () => {
    if (!profile) return
    await supabase.from('queue').delete().eq('user_id', profile.id)
    setStatus('idle')
  }, [profile])

  useEffect(() => {
    if (status !== 'waiting') return
    findMatch()
    pollRef.current = setInterval(findMatch, 3000)
    return () => clearInterval(pollRef.current)
  }, [status, findMatch])

  return { status, matchedSessionId, error, join, leave }
}
