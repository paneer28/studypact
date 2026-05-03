import { useParams, Link } from 'react-router-dom'
import { SessionProvider, useSession } from '../context/SessionContext.jsx'
import CommitForm from '../components/session/CommitForm.jsx'
import ChatPanel from '../components/session/ChatPanel.jsx'
import CalloutButton from '../components/session/CalloutButton.jsx'
import DoneButton from '../components/session/DoneButton.jsx'
import ApprovalPrompt from '../components/session/ApprovalPrompt.jsx'
import ScreenSharePanel from '../components/session/ScreenSharePanel.jsx'
import Timer from '../components/session/Timer.jsx'

export default function Session() {
  const { id } = useParams()
  return (
    <SessionProvider sessionId={id}>
      <SessionView />
    </SessionProvider>
  )
}

function SessionView() {
  const { session, partner, loading, error, bothCommitted, myTask, partnerTask } = useSession()

  if (loading) return <div className="card">Loading session…</div>
  if (error) return <div className="card text-red-600">Error: {error}</div>
  if (!session) return <div className="card">Session not found.</div>

  if (session.status === 'completed') {
    return (
      <div className="card text-center">
        <div className="text-4xl">🎉</div>
        <h2 className="text-2xl font-bold mt-2">Session complete</h2>
        <p className="text-slate-500 mt-1">Nice work. XP has been added to your profile.</p>
        <Link to="/dashboard" className="btn-primary mt-4">Back to dashboard</Link>
      </div>
    )
  }

  if (session.status === 'disputed') {
    return (
      <div className="card text-center">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-bold mt-2">Session disputed</h2>
        <p className="text-slate-500 mt-1">No XP awarded. We'll look at this.</p>
        <Link to="/dashboard" className="btn-primary mt-4">Back to dashboard</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Session with <span className="text-brand-600">{partner?.username ?? '…'}</span>
        </h2>
        <Link to="/dashboard" className="text-sm text-slate-500 hover:underline">Leave</Link>
      </div>

      {!bothCommitted ? (
        <CommitForm />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <TaskCard who="You" task={myTask} />
            <TaskCard who={partner?.username ?? 'Partner'} task={partnerTask} />
          </div>
          <Timer />
          <ScreenSharePanel />

          <div className="flex flex-wrap gap-2">
            <DoneButton />
            <CalloutButton />
          </div>

          <ApprovalPrompt />

          <ChatPanel />
        </>
      )}
    </div>
  )
}

function TaskCard({ who, task }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-slate-500">{who} is working on</div>
      <div className="mt-1 text-slate-800">{task}</div>
    </div>
  )
}
