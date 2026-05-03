import { useEffect, useRef } from 'react'
import { useSession } from '../../context/SessionContext.jsx'
import { useScreenShare } from '../../hooks/useScreenShare.js'

export default function ScreenSharePanel() {
  const { session, profile, partner } = useSession()
  const partnerId = session ? (session.user_a === profile.id ? session.user_b : session.user_a) : null

  const { localStream, remoteStream, sharing, error, start, stop, supported } = useScreenShare({
    sessionId: session?.id,
    profileId: profile?.id,
    partnerId,
  })

  const localRef = useRef(null)
  const remoteRef = useRef(null)

  useEffect(() => { if (localRef.current) localRef.current.srcObject = localStream }, [localStream])
  useEffect(() => { if (remoteRef.current) remoteRef.current.srcObject = remoteStream }, [remoteStream])

  if (!supported) {
    return (
      <div className="card text-sm text-slate-600">
        Screen sharing requires a desktop browser.
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Screen share</h3>
        {sharing ? (
          <button onClick={stop} className="btn-danger text-sm">Stop sharing</button>
        ) : (
          <button onClick={start} className="btn-primary text-sm">Share my screen</button>
        )}
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <div className="grid grid-cols-2 gap-3 mt-3">
        <Tile label="You" stream={localStream} videoRef={localRef} />
        <Tile label={partner?.username ?? 'Partner'} stream={remoteStream} videoRef={remoteRef} />
      </div>
    </div>
  )
}

function Tile({ label, stream, videoRef }) {
  return (
    <div className="rounded-xl bg-slate-900 aspect-video overflow-hidden relative">
      {stream ? (
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
          not sharing
        </div>
      )}
      <div className="absolute left-2 bottom-2 text-xs bg-black/50 text-white rounded px-2 py-0.5">{label}</div>
    </div>
  )
}
