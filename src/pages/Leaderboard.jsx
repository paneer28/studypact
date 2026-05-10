import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import GlobalLeaderboard from '../components/leaderboard/GlobalLeaderboard.jsx'
import SchoolLeaderboard from '../components/leaderboard/SchoolLeaderboard.jsx'

export default function Leaderboard() {
  const { profile } = useAuth()
  const [tab, setTab] = useState('global')

  return (
    <div className="space-y-4 animate-fade-up max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold text-stone-100">Leaderboard</h1>
        <p className="text-stone-500 text-sm mt-1">See who's putting in the most library hours.</p>
      </div>
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: '#120E08', border: '1px solid rgba(180,130,60,0.1)' }}>
        <button
          onClick={() => setTab('global')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'global' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-300'
          }`}
          style={tab === 'global' ? { background: 'linear-gradient(135deg, #C8871E, #D4940A)' } : {}}
        >
          🌍 Global
        </button>
        <button
          onClick={() => setTab('school')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'school' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-300'
          }`}
          style={tab === 'school' ? { background: 'linear-gradient(135deg, #C8871E, #D4940A)' } : {}}
        >
          🏫 My school
        </button>
      </div>
      {tab === 'global'
        ? <GlobalLeaderboard />
        : <SchoolLeaderboard school={profile?.school} />}
    </div>
  )
}
