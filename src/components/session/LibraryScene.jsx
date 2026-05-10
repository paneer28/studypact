import { useState } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────
const VW = 1200, VH = 820
const TW = 178, TH = 108   // table width / height
const CS = 30               // chair size

const BOOK_COLORS = [
  '#C0392B','#E74C3C','#2980B9','#3498DB','#27AE60','#2ECC71',
  '#E67E22','#F39C12','#8E44AD','#9B59B6','#16A085','#1ABC9C',
  '#D35400','#7F8C8D','#2C3E50','#BDC3C7','#6C3483','#117A65',
]

// 9 table slots; index 4 = user's table (center)
const TABLE_SLOTS = [
  { id: 0, cx: 208,  cy: 128 },
  { id: 1, cx: 600,  cy: 128 },
  { id: 2, cx: 992,  cy: 128 },
  { id: 3, cx: 208,  cy: 418 },
  { id: 4, cx: 600,  cy: 418 },   // ← user's seat
  { id: 5, cx: 992,  cy: 418 },
  { id: 6, cx: 208,  cy: 708 },
  { id: 7, cx: 600,  cy: 708 },
  { id: 8, cx: 992,  cy: 708 },
]

// Lamp pendants hang between table rows
const LAMPS = [
  { cx: 80,   cy: 272 }, { cx: 404,  cy: 272 }, { cx: 796,  cy: 272 }, { cx: 1120, cy: 272 },
  { cx: 80,   cy: 562 }, { cx: 404,  cy: 562 }, { cx: 796,  cy: 562 }, { cx: 1120, cy: 562 },
]

// Wall + floor bookshelves
const SHELVES = [
  { x: 14,   y: 300, w: 76, h: 95  },
  { x: 14,   y: 408, w: 76, h: 95  },
  { x: 14,   y: 516, w: 76, h: 95  },
  { x: 1110, y: 300, w: 76, h: 95  },
  { x: 1110, y: 408, w: 76, h: 95  },
  { x: 1110, y: 516, w: 76, h: 95  },
  { x: 488,  y: 552, w: 76, h: 95  },
  { x: 488,  y: 660, w: 76, h: 95  },
  { x: 636,  y: 552, w: 76, h: 95  },
  { x: 636,  y: 660, w: 76, h: 95  },
]

// 4 chair positions relative to table center
const SEAT_OFFSETS = [
  { dx: -52, dy: -(TH / 2 + 20), id: 0 },
  { dx:  52, dy: -(TH / 2 + 20), id: 1 },
  { dx: -52, dy:  (TH / 2 + 20), id: 2 },
  { dx:  52, dy:  (TH / 2 + 20), id: 3 },
]

// ─── Seeded helpers ───────────────────────────────────────────────────────────
function srand(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}
function pick(arr, seed) { return arr[Math.floor(srand(seed) * arr.length)] }

// ─── Sub-components ───────────────────────────────────────────────────────────

function LampGlow({ cx, cy, id }) {
  const gid = `lg${id}`
  return (
    <g>
      <defs>
        <radialGradient id={gid} cx="50%" cy="55%" r="50%">
          <stop offset="0%"   stopColor="#E8841A" stopOpacity="0.52" />
          <stop offset="40%"  stopColor="#C05510" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#6B1212" stopOpacity="0"   />
        </radialGradient>
      </defs>
      {/* light pool on carpet */}
      <ellipse cx={cx} cy={cy + 30} rx={92} ry={118} fill={`url(#${gid})`} />
      {/* pendant shadow dart */}
      <path
        d={`M${cx} ${cy - 110} Q${cx + 9},${cy - 75} ${cx},${cy - 52} Q${cx - 9},${cy - 75} ${cx},${cy - 110}`}
        fill="#1E0606" opacity={0.65}
      />
      {/* pendant disc */}
      <ellipse cx={cx} cy={cy - 52} rx={10} ry={5} fill="#2A0A0A" />
    </g>
  )
}

function Bookshelf({ x, y, w, h, seed }) {
  const books = []
  let bx = x + 4
  let s = seed * 100
  while (bx < x + w - 12) {
    const bw = 8 + Math.floor(srand(s) * 10)
    books.push({ x: bx, w: bw, color: pick(BOOK_COLORS, s + 1) })
    bx += bw + 2
    s++
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill="#2B1006" stroke="#180803" strokeWidth={1} />
      {/* shelf dividers */}
      {[0.33, 0.66].map((f, i) => (
        <rect key={i} x={x} y={y + h * f} width={w} height={3} fill="#180803" />
      ))}
      {books.map((b, i) => (
        <rect key={i} x={b.x} y={y + 4} width={b.w} height={h - 8} rx={1} fill={b.color} opacity={0.88} />
      ))}
    </g>
  )
}

function TableItems({ cx, cy, seed }) {
  // Random study items scattered on the table
  const items = []
  const n = 1 + Math.floor(srand(seed) * 3)
  for (let i = 0; i < n; i++) {
    const ox = (srand(seed + i * 3) - 0.5) * (TW - 50)
    const oy = (srand(seed + i * 3 + 1) - 0.5) * (TH - 28)
    const type = Math.floor(srand(seed + i * 3 + 2) * 3)
    const rot = (srand(seed + i * 7) - 0.5) * 30

    if (type === 0) {
      // Laptop (gray rectangle with darker screen)
      items.push(
        <g key={i} transform={`translate(${cx + ox},${cy + oy}) rotate(${rot})`}>
          <rect x={-22} y={-14} width={44} height={28} rx={2} fill="#4A5568" stroke="#2D3748" strokeWidth={1} />
          <rect x={-18} y={-11} width={36} height={18} rx={1} fill="#1A202C" />
          <rect x={-16} y={-9}  width={32} height={14} rx={1} fill="#2A4A7A" opacity={0.7} />
        </g>
      )
    } else if (type === 1) {
      // Stack of books
      const bc = pick(BOOK_COLORS, seed + i * 13)
      const bc2 = pick(BOOK_COLORS, seed + i * 13 + 4)
      items.push(
        <g key={i} transform={`translate(${cx + ox},${cy + oy}) rotate(${rot})`}>
          <rect x={-14} y={-10} width={28} height={20} rx={1} fill={bc2} stroke="#1A0A02" strokeWidth={0.5} />
          <rect x={-13} y={-12} width={26} height={20} rx={1} fill={bc}  stroke="#1A0A02" strokeWidth={0.5} />
        </g>
      )
    } else {
      // Notebook + pen
      items.push(
        <g key={i} transform={`translate(${cx + ox},${cy + oy}) rotate(${rot})`}>
          <rect x={-12} y={-16} width={24} height={32} rx={1} fill="#F8F4E8" stroke="#D4C9A0" strokeWidth={0.5} />
          <line x1={-7} y1={-10} x2={7} y2={-10} stroke="#C0B070" strokeWidth={1} opacity={0.5} />
          <line x1={-7} y1={-5}  x2={7} y2={-5}  stroke="#C0B070" strokeWidth={1} opacity={0.5} />
          <line x1={-7} y1={0}   x2={7} y2={0}   stroke="#C0B070" strokeWidth={1} opacity={0.5} />
          <rect x={8} y={-8} width={3} height={18} rx={1} fill="#E74C3C" />
        </g>
      )
    }
  }
  return <>{items}</>
}

function Chair({ cx, cy }) {
  return (
    <g>
      <rect x={cx - CS / 2 + 1} y={cy - CS / 2 + 1} width={CS} height={CS} rx={3} fill="#1A0808" opacity={0.35} />
      <rect x={cx - CS / 2} y={cy - CS / 2} width={CS} height={CS} rx={3} fill="#6B4215" stroke="#4A2A0A" strokeWidth={1.5} />
      <rect x={cx - CS / 2 + 4} y={cy - CS / 2 + 4} width={CS - 8} height={8} rx={2} fill="#7D5225" />
    </g>
  )
}

function OccupantAvatar({ cx, cy, user, isMe, isPartner }) {
  const initials = (user.username ?? '??').slice(0, 2).toUpperCase()
  const color = isMe ? '#06B6D4' : isPartner ? '#A78BFA' : user.fake ? '#475569' : '#6EE7B7'
  return (
    <g>
      {(isMe || isPartner) && (
        <circle cx={cx} cy={cy} r={17} fill={color} opacity={0.2} />
      )}
      <circle cx={cx} cy={cy} r={13} fill={color} stroke="#0D0D14" strokeWidth={1.5} opacity={user.fake ? 0.55 : 1} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize={8} fontWeight="700" fontFamily="monospace" opacity={user.fake ? 0.7 : 1}>
        {initials}
      </text>
      {!user.fake && (
        <text x={cx} y={cy + 26} textAnchor="middle" fill="white" fontSize={6.5} opacity={0.65} fontFamily="sans-serif">
          @{user.username}
        </text>
      )}
    </g>
  )
}

function StudyTable({ slot, tableData, myUserId, partnerId, onHover, isHovered }) {
  const { cx, cy } = slot
  const isMyTable = tableData?.isMySession
  const occupants = tableData?.users ?? []
  const seed = slot.id * 37 + 13

  return (
    <g
      onMouseEnter={() => onHover(slot.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: tableData && !tableData.fake ? 'pointer' : 'default' }}
    >
      {/* Drop shadow */}
      <rect
        x={cx - TW / 2 + 6} y={cy - TH / 2 + 8}
        width={TW} height={TH} rx={5}
        fill="#150404" opacity={0.5}
      />

      {/* Chairs (behind table) */}
      {SEAT_OFFSETS.slice(0, 2).map((s) => (
        <Chair key={s.id} cx={cx + s.dx} cy={cy + s.dy} />
      ))}

      {/* Table surface */}
      <rect
        x={cx - TW / 2} y={cy - TH / 2}
        width={TW} height={TH} rx={5}
        fill="#8B5E2B" stroke="#5C3A18" strokeWidth={2}
      />
      {/* Wood grain */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f}
          x1={cx - TW / 2 + 4} y1={cy - TH / 2 + TH * f}
          x2={cx + TW / 2 - 4} y2={cy - TH / 2 + TH * f}
          stroke="#6B4215" strokeWidth={0.8} opacity={0.4}
        />
      ))}

      {/* My-table highlight */}
      {isMyTable && (
        <rect
          x={cx - TW / 2 - 4} y={cy - TH / 2 - 4}
          width={TW + 8} height={TH + 8} rx={8}
          fill="none" stroke="#06B6D4" strokeWidth={2.5} opacity={0.7}
          strokeDasharray="6 3"
        />
      )}

      {/* Items on table */}
      {occupants.length > 0 && <TableItems cx={cx} cy={cy} seed={seed} />}

      {/* Front chairs */}
      {SEAT_OFFSETS.slice(2).map((s) => (
        <Chair key={s.id} cx={cx + s.dx} cy={cy + s.dy} />
      ))}

      {/* Occupant avatars */}
      {SEAT_OFFSETS.map((s, i) => {
        const user = occupants[i]
        if (!user) return null
        return (
          <OccupantAvatar
            key={i}
            cx={cx + s.dx}
            cy={cy + s.dy}
            user={user}
            isMe={user.id === myUserId}
            isPartner={user.id === partnerId}
          />
        )
      })}

      {/* Hover tooltip */}
      {isHovered && tableData && !tableData.fake && (
        <g>
          <rect x={cx - 80} y={cy - TH / 2 - 68} width={160} height={58} rx={6} fill="#0D0D20" stroke="#2D2D50" strokeWidth={1} />
          {occupants.slice(0, 2).map((u, i) => (
            <text key={i} x={cx} y={cy - TH / 2 - 48 + i * 18} textAnchor="middle" fill="#CBD5E1" fontSize={9} fontFamily="sans-serif">
              @{u.username}{u.task ? ` — ${u.task.slice(0, 22)}…` : ''}
            </text>
          ))}
        </g>
      )}
    </g>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function LibraryScene({ tables = [], myUserId, partnerId }) {
  const [hoveredSlot, setHoveredSlot] = useState(null)

  // Map real table data onto the fixed slots; my session always goes to slot 4
  const slotMap = {}
  let realIdx = 0
  for (const t of tables) {
    if (t.isMySession) {
      slotMap[4] = t
    } else {
      // Fill slots 0-8, skipping 4 for the user
      while (realIdx === 4) realIdx++
      if (realIdx < 9) slotMap[realIdx++] = t
    }
  }

  return (
    <div className="w-full h-full select-none" style={{ background: '#4A0E0E' }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        {/* Carpet */}
        <rect width={VW} height={VH} fill="#5C1212" />
        {/* Subtle carpet texture bands */}
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={i} x={0} y={i * 42} width={VW} height={21} fill="#581010" opacity={0.18} />
        ))}

        {/* Lamp glows (behind everything) */}
        {LAMPS.map((l, i) => (
          <LampGlow key={i} cx={l.cx} cy={l.cy} id={i} />
        ))}

        {/* Bookshelves */}
        {SHELVES.map((s, i) => (
          <Bookshelf key={i} {...s} seed={i * 17 + 3} />
        ))}
        {/* Bottom strip bookshelf */}
        <Bookshelf x={0} y={790} w={VW} h={30} seed={999} />

        {/* Tables — render top rows first (painter's algorithm) */}
        {TABLE_SLOTS.map((slot) => (
          <StudyTable
            key={slot.id}
            slot={slot}
            tableData={slotMap[slot.id] ?? null}
            myUserId={myUserId}
            partnerId={partnerId}
            onHover={setHoveredSlot}
            isHovered={hoveredSlot === slot.id}
          />
        ))}

        {/* "You are here" label on user's table */}
        {slotMap[4] && (
          <text
            x={TABLE_SLOTS[4].cx}
            y={TABLE_SLOTS[4].cy - TH / 2 - 36}
            textAnchor="middle"
            fill="#06B6D4"
            fontSize={10}
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="1"
            opacity={0.85}
          >
            YOUR TABLE
          </text>
        )}
      </svg>
    </div>
  )
}
