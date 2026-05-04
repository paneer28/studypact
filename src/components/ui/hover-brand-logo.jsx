import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Simplified university shield/crest SVGs styled after each school's official mark
function HarvardLogo({ faded }) {
  return (
    <svg viewBox="0 0 40 46" fill="none" className="w-9 h-9 sm:w-8 sm:h-8">
      <path d="M4 3h32v26c0 10-14 17-16 17S4 39 4 29V3z" fill={faded ? '#ffffff18' : '#A51C30'} />
      <rect x="8"  y="9"  width="8" height="10" rx="1" fill={faded ? '#ffffff30' : 'white'} />
      <rect x="22" y="9"  width="8" height="10" rx="1" fill={faded ? '#ffffff30' : 'white'} />
      <rect x="15" y="21" width="8" height="10" rx="1" fill={faded ? '#ffffff30' : 'white'} />
      <text x="20" y="10" textAnchor="middle" fill={faded ? '#ffffff30' : '#A51C30'} fontSize="5.5" fontFamily="serif" fontWeight="bold">VE</text>
      <text x="26" y="22" textAnchor="middle" fill={faded ? '#ffffff30' : '#A51C30'} fontSize="5.5" fontFamily="serif" fontWeight="bold">RI</text>
      <text x="19" y="33" textAnchor="middle" fill={faded ? '#ffffff30' : '#A51C30'} fontSize="5.5" fontFamily="serif" fontWeight="bold">TAS</text>
    </svg>
  )
}

function YaleLogo({ faded }) {
  return (
    <svg viewBox="0 0 40 46" fill="none" className="w-9 h-9 sm:w-8 sm:h-8">
      <path d="M4 3h32v26c0 10-14 17-16 17S4 39 4 29V3z" fill={faded ? '#ffffff18' : '#00356B'} />
      {/* Open book */}
      <path d="M10 16 Q20 12 20 16 Q20 12 30 16 L30 28 Q20 24 20 28 Q20 24 10 28Z"
            fill={faded ? '#ffffff30' : 'white'} opacity={faded ? 0.4 : 0.9} />
      <line x1="20" y1="16" x2="20" y2="28" stroke={faded ? '#ffffff20' : '#00356B'} strokeWidth="1" />
      <text x="20" y="37" textAnchor="middle" fill={faded ? '#ffffff30' : 'white'} fontSize="5" fontFamily="serif" letterSpacing="1">YALE</text>
    </svg>
  )
}

function StanfordLogo({ faded }) {
  // Stanford cardinal tree (simplified)
  const color = faded ? '#ffffff18' : '#8C1515'
  const fg = faded ? '#ffffff30' : 'white'
  return (
    <svg viewBox="0 0 40 46" fill="none" className="w-9 h-9 sm:w-8 sm:h-8">
      <path d="M4 3h32v26c0 10-14 17-16 17S4 39 4 29V3z" fill={color} />
      {/* Tree trunk */}
      <rect x="18.5" y="28" width="3" height="8" fill={fg} />
      {/* Tree layers */}
      <polygon points="20,8 28,22 12,22" fill={fg} />
      <polygon points="20,14 27,26 13,26" fill={fg} />
    </svg>
  )
}

function UPennLogo({ faded }) {
  return (
    <svg viewBox="0 0 40 46" fill="none" className="w-9 h-9 sm:w-8 sm:h-8">
      {/* Quartered shield */}
      <path d="M4 3h32v26c0 10-14 17-16 17S4 39 4 29V3z" fill={faded ? '#ffffff10' : '#011F5B'} />
      <path d="M20 3h16v26c0 5-5 11-10 15V3z" fill={faded ? '#ffffff08' : '#990000'} />
      <path d="M4 25h16v4c0 10-14 17-16 17z" fill={faded ? '#ffffff08' : '#990000'} />
      {/* Penn P */}
      <text x="20" y="26" textAnchor="middle" fill={faded ? '#ffffff30' : 'white'} fontSize="18" fontFamily="serif" fontWeight="bold">P</text>
    </svg>
  )
}

function DukeLogo({ faded }) {
  return (
    <svg viewBox="0 0 40 46" fill="none" className="w-9 h-9 sm:w-8 sm:h-8">
      <path d="M4 3h32v26c0 10-14 17-16 17S4 39 4 29V3z" fill={faded ? '#ffffff18' : '#003087'} />
      {/* Gothic arch */}
      <path d="M12 32V14 Q12 8 20 8 Q28 8 28 14 V32Z" fill={faded ? '#ffffff30' : 'white'} opacity={faded ? 0.4 : 0.15} />
      <text x="20" y="28" textAnchor="middle" fill={faded ? '#ffffff30' : 'white'} fontSize="14" fontFamily="serif" fontWeight="bold">D</text>
    </svg>
  )
}

function PrincetonLogo({ faded }) {
  return (
    <svg viewBox="0 0 40 46" fill="none" className="w-9 h-9 sm:w-8 sm:h-8">
      <path d="M4 3h32v26c0 10-14 17-16 17S4 39 4 29V3z" fill={faded ? '#ffffff18' : '#E77500'} />
      {/* Tiger stripe accents */}
      <path d="M4 14h32" stroke={faded ? '#ffffff15' : '#000'} strokeWidth="1.5" opacity={faded ? 0.3 : 0.25} />
      <path d="M4 22h32" stroke={faded ? '#ffffff15' : '#000'} strokeWidth="1.5" opacity={faded ? 0.3 : 0.25} />
      <text x="20" y="28" textAnchor="middle" fill={faded ? '#ffffff30' : 'white'} fontSize="14" fontFamily="serif" fontWeight="bold">P</text>
    </svg>
  )
}

function UCLALogo({ faded }) {
  return (
    <svg viewBox="0 0 40 46" fill="none" className="w-9 h-9 sm:w-8 sm:h-8">
      <path d="M4 3h32v26c0 10-14 17-16 17S4 39 4 29V3z" fill={faded ? '#ffffff18' : '#2774AE'} />
      {/* Gold bar */}
      <rect x="4" y="17" width="32" height="9" fill={faded ? '#ffffff10' : '#FFD100'} />
      <text x="20" y="24" textAnchor="middle" fill={faded ? '#ffffff40' : '#003B5C'} fontSize="8.5" fontFamily="sans-serif" fontWeight="800" letterSpacing="0.5">UCLA</text>
    </svg>
  )
}

const universities = [
  { id: 'harvard',  name: 'Harvard',   Logo: HarvardLogo },
  { id: 'yale',     name: 'Yale',      Logo: YaleLogo },
  { id: 'stanford', name: 'Stanford',  Logo: StanfordLogo },
  { id: 'upenn',    name: 'UPenn',     Logo: UPennLogo },
  { id: 'duke',     name: 'Duke',      Logo: DukeLogo },
  { id: 'princeton',name: 'Princeton', Logo: PrincetonLogo },
  { id: 'ucla',     name: 'UCLA',      Logo: UCLALogo },
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
        {universities.map(({ id, name, Logo }) => {
          const isActive = hoveredId === id
          const isDimmed = hoveredId !== null && !isActive
          return (
            <button
              key={id}
              aria-label={name}
              className={[
                'flex items-center justify-center p-1.5 sm:p-2 rounded-lg border transition-all duration-200',
                isActive ? 'border-foreground/20 bg-foreground/5' : 'border-transparent',
              ].join(' ')}
              style={{ opacity: isDimmed ? 0.35 : 1 }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Logo faded={isDimmed} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
