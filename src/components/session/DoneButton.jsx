import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useSession } from '../../context/SessionContext.jsx'

export default function DoneButton() {
  const { session, iAm, myDone } = useSession()
  const [busy, setBusy] = useState(false)

  if (myDone) {
    return (
      <button className="btn-secondary" disabled>Waiting for approval…</button>
    )
  }

  const markDone = async () => {
    setBusy(true)
    await supabase
      .from('sessions')
      .update({ [`user_${iAm}_done`]: true })
      .eq('id', session.id)
    setBusy(false)
  }

  return (
    <button onClick={markDone} className="btn-primary" disabled={busy}>
      {busy ? 'Marking…' : "I'm done"}
    </button>
  )
}
