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
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-slate-600 font-mono">Time left</span>
        <span className="font-mono text-xl text-white tabular-nums">{mm}:{ss}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
        <div className="h-full bg-brand-500 transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
