import XPBar from './XPBar.jsx'
import StreakDisplay from './StreakDisplay.jsx'

function initials(name) {
  if (!name) return '??'
  return name.split(/\s|_|-/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || name.slice(0, 2).toUpperCase()
}

export default function ProfileCard({ profile }) {
  if (!profile) return null
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
          style={{
            background: 'linear-gradient(135deg, #C8871E, #A06A10)',
            color: '#0C0904',
            boxShadow: '0 0 16px rgba(200,135,30,0.3)',
          }}
        >
          {initials(profile.username)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-xl font-semibold text-stone-100 truncate">{profile.username}</div>
          <div className="text-sm text-stone-500 truncate">
            {profile.school
              ? <>{profile.school}{profile.school_verified && <span className="text-brand-500 ml-1">✓</span>}</>
              : 'No school linked'}
          </div>
        </div>
        <StreakDisplay streak={profile.streak} />
      </div>
      <div className="mt-5"><XPBar xp={profile.xp} level={profile.level} /></div>
    </div>
  )
}
