import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function useStudyInvites(profile) {
  const [pendingReceived, setPendingReceived] = useState([]) // invites sent TO me
  const [pendingSent,     setPendingSent]     = useState([]) // invites sent BY me

  const load = useCallback(async () => {
    if (!profile?.id) return

    const [{ data: recv }, { data: sent }] = await Promise.all([
      supabase
        .from('study_invites')
        .select(`*, from_user:users!study_invites_from_user_id_fkey(id,username,school)`)
        .eq('to_user_id', profile.id)
        .eq('status', 'pending'),
      supabase
        .from('study_invites')
        .select(`*, to_user:users!study_invites_to_user_id_fkey(id,username,school)`)
        .eq('from_user_id', profile.id)
        .eq('status', 'pending'),
    ])
    setPendingReceived(recv ?? [])
    setPendingSent(sent ?? [])
  }, [profile?.id])

  useEffect(() => { load() }, [load])

  // Realtime — any change to invites involving this user
  useEffect(() => {
    if (!profile?.id) return
    const ch = supabase
      .channel(`invites:${profile.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'study_invites',
      }, load)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [profile?.id, load])

  const sendInvite = useCallback(async (toUserId) => {
    if (!profile?.id) return { error: 'Not logged in' }
    // Cancel any existing pending invite to the same person first
    await supabase
      .from('study_invites')
      .update({ status: 'expired' })
      .eq('from_user_id', profile.id)
      .eq('to_user_id', toUserId)
      .eq('status', 'pending')

    const { error } = await supabase.from('study_invites').insert({
      from_user_id: profile.id,
      to_user_id:   toUserId,
    })
    await load()
    return { error }
  }, [profile?.id, load])

  // Returns the new session_id on success, or null on failure
  const acceptInvite = useCallback(async (inviteId) => {
    const { data, error } = await supabase.rpc('accept_study_invite', { p_invite_id: inviteId })
    await load()
    if (error || !data) return null
    return data // uuid of the new session
  }, [load])

  const declineInvite = useCallback(async (inviteId) => {
    await supabase.from('study_invites').update({ status: 'declined' }).eq('id', inviteId)
    await load()
  }, [load])

  const cancelInvite = useCallback(async (inviteId) => {
    await supabase.from('study_invites').update({ status: 'expired' }).eq('id', inviteId)
    await load()
  }, [load])

  return {
    pendingReceived,
    pendingSent,
    sendInvite,
    acceptInvite,
    declineInvite,
    cancelInvite,
    reload: load,
  }
}
