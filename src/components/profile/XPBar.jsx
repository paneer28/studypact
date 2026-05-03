import { levelThresholds, progressInLevel } from '../../lib/xp.js'

export default function XPBar({ xp = 0, level = 1 }) {
  const { current, needed, pct } = progressInLevel(xp, level)
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-600">Level</span>
          <span className="font-display font-bold text-white text-xl leading-none">{level}</span>
        </div>
        <span className="font-mono text-xs text-slate-600">
          <span className="text-slate-400">{current}</span> / {needed} XP
        </span>
      </div>
      <div className="h-1 bg-surface-900 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #06b6d4, #22d3ee)',
            boxShadow: '0 0 10px rgba(34,211,238,0.4)',
          }}
        />
      </div>
    </div>
  )
}

export { levelThresholds }
