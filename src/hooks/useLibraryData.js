import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

// Deterministic seeded random — same seed → same value every render
function srand(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const FAKE_NAMES = [
  'alex_m', 'sarah_k', 'james_t', 'priya_s', 'noah_c',
  'emma_l', 'marcus_r', 'lily_h', 'david_w', 'maya_p',
  'ethan_b', 'zoe_c', 'ryan_d', 'ava_f', 'chris_n',
]
const FAKE_TASKS = [
  'CS 101 problem set', 'Econ midterm prep', 'History essay',
  'Organic chemistry', 'Calculus homework', 'Senior thesis chapter 3',
  'Physics lab report', 'Literature review', 'Data structures HW',
  'Biochem flashcards', 'Linear algebra pset', 'Policy memo draft',
]

function makeFakeSessions(school, count, startIdx = 0) {
  return Array.from({ length: count }, (_, i) => {
    const idx = startIdx + i
    return {
      sessionId: `fake-${school}-${idx}`,
      isMySession: false,
      fake: true,
      users: [
        {
          id: `fakeA-${idx}`,
          username: FAKE_NAMES[Math.floor(srand(idx * 2) * FAKE_NAMES.length)],
          school,
          task: FAKE_TASKS[Math.floor(srand(idx * 3) * FAKE_TASKS.length)],
          fake: true,
        },
        {
          id: `fakeB-${idx}`,
          username: FAKE_NAMES[Math.floor(srand(idx * 2 + 1) * FAKE_NAMES.length)],
          school,
          task: FAKE_TASKS[Math.floor(srand(idx * 3 + 2) * FAKE_TASKS.length)],
          fake: true,
        },
      ],
    }
  })
}

// Returns table data for the library scene: real sessions from same school + fake fill-ins
// Also returns a live studyingCount for the dashboard presence bar
export function useLibraryData(profile, currentSessionId) {
  const [tables, setTables] = useState([])
  const [studyingCount, setStudyingCount] = useState(0)

  useEffect(() => {
    if (!profile) return
    let active = true

    const load = async () => {
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('status', 'active')

      if (!active || !sessions) return

      setStudyingCount(sessions.length * 2)

      // Collect all user IDs and fetch profiles
      const ids = [...new Set(sessions.flatMap((s) => [s.user_a, s.user_b].filter(Boolean)))]
      const { data: users } = ids.length
        ? await supabase.from('users').select('id,username,school').in('id', ids)
        : { data: [] }
      if (!active) return

      const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]))

      // Keep sessions from same school (or all if user has no school)
      const school = profile.school
      const schoolSessions = sessions.filter((s) => {
        if (!school) return true
        return (
          userMap[s.user_a]?.school === school ||
          userMap[s.user_b]?.school === school
        )
      })

      const real = schoolSessions.map((s) => ({
        sessionId: s.id,
        isMySession: s.id === currentSessionId,
        fake: false,
        users: [
          userMap[s.user_a] ? { ...userMap[s.user_a], task: s.task_a } : null,
          userMap[s.user_b] ? { ...userMap[s.user_b], task: s.task_b } : null,
        ].filter(Boolean),
      }))

      // Fill remaining tables with fakes so the library never looks empty
      const MIN_TABLES = 6
      const fakeNeeded = Math.max(0, MIN_TABLES - real.length)
      const fake = makeFakeSessions(school ?? 'university', fakeNeeded)

      setTables([...real, ...fake])
    }

    load()
    const iv = setInterval(load, 15000)
    return () => { active = false; clearInterval(iv) }
  }, [profile, currentSessionId])

  return { tables, studyingCount }
}
