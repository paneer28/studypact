import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import GlobalLeaderboard from '../components/leaderboard/GlobalLeaderboard.jsx'
import SchoolLeaderboard from '../components/leaderboard/SchoolLeaderboard.jsx'

export default function Leaderboard() {
  const { profile } = useAuth()
  const [tab, setTab] = useState('global')

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setTab('global')}
          className={`btn ${tab === 'global' ? 'btn-primary' : 'btn-secondary'}`}
        >Global</button>
        <button
          onClick={() => setTab('school')}
          className={`btn ${tab === 'school' ? 'btn-primary' : 'btn-secondary'}`}
        >My school</button>
      </div>
      {tab === 'global'
        ? <GlobalLeaderboard />
        : <SchoolLeaderboard school={profile?.school} />}
    </div>
  )
}
