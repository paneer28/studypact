import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const universities = [
  {
    id: 'harvard',
    name: 'Harvard',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Harvard_University_coat_of_arms.svg',
  },
  {
    id: 'yale',
    name: 'Yale',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Yale_University_Shield_1.svg',
  },
  {
    id: 'stanford',
    name: 'Stanford',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Seal_of_Leland_Stanford_Junior_University.svg',
  },
  {
    id: 'upenn',
    name: 'UPenn',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/UPenn_shield_with_banner.svg',
  },
  {
    id: 'duke',
    name: 'Duke',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Duke_University_logo.svg',
  },
  {
    id: 'princeton',
    name: 'Princeton',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Princeton_seal.svg',
  },
  {
    id: 'ucla',
    name: 'UCLA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/The_University_of_California_UCLA.svg',
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

      <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto md:mt-6 sm:mt-0">
        {universities.map(({ id, name, logo }) => {
          const isActive = hoveredId === id
          const isDimmed = hoveredId !== null && !isActive
          return (
            <button
              key={id}
              aria-label={name}
              className={[
                'flex items-center justify-center p-2 rounded-xl border transition-all duration-200',
                isActive ? 'border-white/20 bg-white/5' : 'border-transparent',
              ].join(' ')}
              style={{ opacity: isDimmed ? 0.25 : 1 }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={logo}
                alt={name}
                className="w-10 h-10 sm:w-9 sm:h-9 object-contain"
                style={{ filter: isActive ? 'none' : 'grayscale(0.3) brightness(0.85)' }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
