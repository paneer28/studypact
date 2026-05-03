import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MatchFound({ sessionId }) {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate(`/session/${sessionId}`), 800)
    return () => clearTimeout(t)
  }, [sessionId, navigate])

  return (
    <div className="card text-center">
      <div className="text-4xl">🎉</div>
      <h3 className="mt-2 text-xl font-semibold">Matched!</h3>
      <p className="text-slate-500 mt-1">Taking you to your session…</p>
    </div>
  )
}
