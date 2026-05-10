import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function useFriends(profile) {
  const [friends,  setFriends]  = useState([]) // accepted
  const [incoming, setIncoming] = useState([]) // pending — I'm the addressee
  const [outgoing, setOutgoing] = useState([]) // pending — I'm the requester
  const [loading,  setLoading]  = useState(false)

  const load = useCallback(async () => {
    if (!profile?.id) return
    setLoading(true)

    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id, status, created_at,
        requester:users!friendships_requester_id_fkey(id, username, school),
        addressee:users!friendships_addressee_id_fkey(id, username, school)
      `)
      .or(`requester_id.eq.${profile.id},addressee_id.eq.${profile.id}`)

    if (error || !data) { setLoading(false); return }

    const f = [], inc = [], out = []
    for (const row of data) {
      const iAmRequester = row.requester?.id === profile.id
      const other = iAmRequester ? row.addressee : row.requester
      const entry = { friendshipId: row.id, user: other, status: row.status }
      if (row.status === 'accepted') f.push(entry)
      else if (row.status === 'pending' && !iAmRequester) inc.push(entry)
      else if (row.status === 'pending' &&  iAmRequester) out.push(entry)
    }
    setFriends(f)
    setIncoming(inc)
    setOutgoing(out)
    setLoading(false)
  }, [profile?.id])

  useEffect(() => {
    load()
  }, [load])

  // Realtime — refresh on any change to friendships involving this user
  useEffect(() => {
    if (!profile?.id) return
    const ch = supabase
      .channel(`friendships:${profile.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friendships' }, load)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [profile?.id, load])

  // ── Mutations ─────────────────────────────────────────

  const sendRequest = useCallback(async (addresseeId) => {
    if (!profile?.id) return { error: 'Not logged in' }
    const { error } = await supabase
      .from('friendships')
      .insert({ requester_id: profile.id, addressee_id: addresseeId })
    await load()
    return { error }
  }, [profile?.id, load])

  const accept = useCallback(async (friendshipId) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId)
    await load()
    return { error }
  }, [load])

  const decline = useCallback(async (friendshipId) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'declined' })
      .eq('id', friendshipId)
    await load()
    return { error }
  }, [load])

  const remove = useCallback(async (friendshipId) => {
    await supabase.from('friendships').delete().eq('id', friendshipId)
    await load()
  }, [load])

  const searchUsers = useCallback(async (query) => {
    if (!query || query.length < 2) return []
    const { data } = await supabase
      .from('users')
      .select('id, username, school')
      .ilike('username', `%${query}%`)
      .neq('id', profile?.id ?? '')
      .limit(8)
    return data ?? []
  }, [profile?.id])

  return {
    friends, incoming, outgoing, loading,
    sendRequest, accept, decline, remove, searchUsers,
    reload: load,
  }
}
