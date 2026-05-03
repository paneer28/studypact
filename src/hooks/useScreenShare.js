import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { createPeer, getDisplayStream, isScreenShareSupported } from '../lib/webrtc.js'

// Signaling via Supabase Realtime broadcast channel.
// Each client posts { from, payload } messages; peers consume them.
export function useScreenShare({ sessionId, profileId, partnerId }) {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [sharing, setSharing] = useState(false)
  const [error, setError] = useState('')
  const peerRef = useRef(null)
  const channelRef = useRef(null)

  // Attach to the signaling channel
  useEffect(() => {
    if (!sessionId || !profileId) return
    const ch = supabase.channel(`rtc:${sessionId}`, {
      config: { broadcast: { self: false } },
    })
    ch.on('broadcast', { event: 'signal' }, ({ payload }) => {
      if (!peerRef.current) return
      if (payload.to !== profileId) return
      try { peerRef.current.signal(payload.data) } catch (e) { setError(e.message) }
    })
    ch.subscribe()
    channelRef.current = ch
    return () => { supabase.removeChannel(ch); channelRef.current = null }
  }, [sessionId, profileId])

  const sendSignal = useCallback((data) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'signal',
      payload: { from: profileId, to: partnerId, data },
    })
  }, [profileId, partnerId])

  const buildPeer = useCallback((initiator, stream) => {
    const peer = createPeer({
      initiator,
      stream,
      onSignal: sendSignal,
      onStream: (s) => setRemoteStream(s),
      onClose: () => {
        setRemoteStream(null)
        peerRef.current = null
      },
      onError: (e) => setError(e.message),
    })
    peerRef.current = peer
    return peer
  }, [sendSignal])

  const start = useCallback(async () => {
    if (!isScreenShareSupported()) return setError('Screen share not supported on this device')
    if (!partnerId) return setError('No partner yet')
    setError('')
    try {
      const stream = await getDisplayStream()
      setLocalStream(stream)
      setSharing(true)
      stream.getVideoTracks()[0].addEventListener('ended', stop)
      // Lower user_id initiates to deterministically pick one offerer.
      const initiator = profileId < partnerId
      buildPeer(initiator, stream)
    } catch (e) {
      setError(e.message)
    }
  }, [partnerId, profileId, buildPeer]) // eslint-disable-line

  const stop = useCallback(() => {
    peerRef.current?.destroy()
    peerRef.current = null
    localStream?.getTracks().forEach((t) => t.stop())
    setLocalStream(null)
    setSharing(false)
    setRemoteStream(null)
  }, [localStream])

  // If a signal arrives before we've hit "start", create a receive-only peer
  // so we can still view the partner's screen.
  useEffect(() => {
    if (!channelRef.current || !partnerId) return
    const ch = channelRef.current
    const handler = ({ payload }) => {
      if (peerRef.current) return
      if (payload.to !== profileId) return
      const peer = buildPeer(false, null)
      try { peer.signal(payload.data) } catch (e) { setError(e.message) }
    }
    ch.on('broadcast', { event: 'signal' }, handler)
    // No off() API for a single listener in supabase-js v2; the channel is
    // torn down when the effect above unmounts.
  }, [partnerId, profileId, buildPeer])

  useEffect(() => () => stop(), []) // eslint-disable-line

  return { localStream, remoteStream, sharing, error, start, stop, supported: isScreenShareSupported() }
}
