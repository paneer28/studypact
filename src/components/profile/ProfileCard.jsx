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
        <div className="w-14 h-14 rounded-full bg-brand-500 text-white grid place-items-center text-lg font-bold">
          {initials(profile.username)}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-lg">{profile.username}</div>
          <div className="text-sm text-slate-500">
            {profile.school ? `${profile.school}${profile.school_verified ? ' ✓' : ''}` : 'No school'}
          </div>
        </div>
        <StreakDisplay streak={profile.streak} />
      </div>
      <div className="mt-4"><XPBar xp={profile.xp} level={profile.level} /></div>
    </div>
  )
}
