export default function StreakDisplay({ streak = 0 }) {
  const isHot = streak >= 3

  return (
    <div className={`inline-flex items-center gap-3 rounded-xl px-4 py-2.5 border transition-colors ${
      isHot
        ? 'bg-amber-500/10 border-amber-500/25'
        : 'bg-surface-700 border-white/[0.06]'
    }`}>
      {isHot ? (
        <svg className="w-5 h-5 text-amber-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )}
      <div>
        <div className={`font-mono font-medium text-lg leading-none ${isHot ? 'text-amber-300' : 'text-slate-400'}`}>
          {streak}
        </div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-slate-600 mt-0.5">day streak</div>
      </div>
    </div>
  )
}
