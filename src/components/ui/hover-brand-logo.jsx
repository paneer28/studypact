import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const universities = [
  {
    id: 'harvard',
    name: 'Harvard',
    abbr: 'H',
    color: '#A51C30',
  },
  {
    id: 'yale',
    name: 'Yale',
    abbr: 'Y',
    color: '#00356B',
  },
  {
    id: 'stanford',
    name: 'Stanford',
    abbr: 'S',
    color: '#8C1515',
  },
  {
    id: 'upenn',
    name: 'UPenn',
    abbr: 'P',
    color: '#011F5B',
  },
  {
    id: 'duke',
    name: 'Duke',
    abbr: 'D',
    color: '#003087',
  },
  {
    id: 'princeton',
    name: 'Princeton',
    abbr: 'P',
    color: '#E77500',
  },
  {
    id: 'ucla',
    name: 'UCLA',
    abbr: 'U',
    color: '#2774AE',
  },
]

export default function HoverBrandLogo() {
  const [hoveredId, setHoveredId] = useState(null)
  const activeUniv = universities.find((u) => u.id === hoveredId)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex-shrink-0 w-full sm:w-auto text-center sm:text-left">
        <p className="text-sm sm:text-base text-muted-foreground font-medium mb-0 tracking-tight">
          Used by students at
        </p>
        <div className="relative">
          <p
            aria-hidden
            className="text-3xl lg:text-3xl font-bold tracking-tight whitespace-nowrap opacity-0 pointer-events-none select-none leading-none sm:leading-tight"
          >
            leading universities
          </p>
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={hoveredId ?? 'default'}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-none sm:leading-tight tracking-tight whitespace-nowrap"
              >
                {activeUniv?.name ?? 'leading universities'}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center justify-center sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto md:mt-6 sm:mt-0">
        {universities.map(({ id, name, abbr, color }) => {
          const isActive = hoveredId === id
          const isDimmed = hoveredId !== null && !isActive
          return (
            <button
              key={id}
              aria-label={name}
              className={[
                'flex items-center justify-center p-2.5 sm:p-3 lg:p-3.5 rounded-lg border transition-all duration-200',
                isActive
                  ? 'border-foreground/30 bg-foreground/5'
                  : 'border-transparent',
                isDimmed ? 'opacity-40' : '',
              ].join(' ')}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span
                className="w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center font-serif font-bold text-lg leading-none transition-colors duration-200"
                style={{ color: isActive ? color : 'rgba(255,255,255,0.3)' }}
              >
                {abbr}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
