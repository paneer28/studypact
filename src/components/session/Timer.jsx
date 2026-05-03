import { useEffect, useState } from 'react'
import { useSession } from '../../context/SessionContext.jsx'

export default function Timer() {
  const { session, bothCommitted, myDuration, partnerSide } = useSession()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  if (!bothCommitted) return null

  const partnerDuration = session[`duration_${partnerSide}`]
  const totalMinutes = Math.max(myDuration ?? 0, partnerDuration ?? 0)
  const startedAt = new Date(session.started_at).getTime()
  const elapsedMs = Math.max(0, now - startedAt)
  const totalMs = totalMinutes * 60 * 1000
  const remaining = Math.max(0, totalMs - elapsedMs)
  const mm = Math.floor(remaining / 60000)
  const ss = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0')
  const pct = totalMs > 0 ? Math.min(100, (elapsedMs / totalMs) * 100) : 0

  return (
    <div className="card">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold">Time left</h3>
        <div className="font-mono text-2xl">{mm}:{ss}</div>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden mt-2">
        <div className="h-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
