import { levelThresholds, progressInLevel } from '../../lib/xp.js'

export default function XPBar({ xp = 0, level = 1 }) {
  const { current, needed, pct } = progressInLevel(xp, level)
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-stone-600">Level</span>
          <span className="font-display font-bold text-stone-100 text-xl leading-none">{level}</span>
        </div>
        <span className="font-mono text-xs text-stone-600">
          <span className="text-stone-400">{current}</span> / {needed} XP
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(180,130,60,0.12)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #C8871E, #E8A820)',
            boxShadow: '0 0 10px rgba(200,135,30,0.5)',
          }}
        />
      </div>
    </div>
  )
}

export { levelThresholds }
