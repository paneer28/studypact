import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SessionProvider, useSession } from '../context/SessionContext.jsx'
import { useLibraryData } from '../hooks/useLibraryData.js'
import LibraryScene from '../components/session/LibraryScene.jsx'
import CommitForm from '../components/session/CommitForm.jsx'
import ChatPanel from '../components/session/ChatPanel.jsx'
import CalloutButton from '../components/session/CalloutButton.jsx'
import DoneButton from '../components/session/DoneButton.jsx'
import ApprovalPrompt from '../components/session/ApprovalPrompt.jsx'
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
  const { session, partner, profile, loading, error, bothCommitted, myTask, partnerTask } = useSession()
  const { tables } = useLibraryData(profile, session?.id)
  const [chatOpen, setChatOpen] = useState(false)

  if (loading) return <LibraryLoading />
  if (error)   return <StatusOverlay icon="⚠️" title="Error" body={error} />
  if (!session) return <StatusOverlay icon="🔍" title="Session not found" body="" />

  if (session.status === 'completed') {
    return (
      <LibraryOverlay>
        <div className="text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-white">Session complete!</h2>
          <p className="text-slate-400 mt-1 text-sm">XP added to your profile.</p>
          <Link to="/dashboard" className="btn-primary mt-5 inline-block px-6">Back to library</Link>
        </div>
      </LibraryOverlay>
    )
  }

  if (session.status === 'disputed') {
    return (
      <LibraryOverlay>
        <div className="text-center">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-white">Session disputed</h2>
          <p className="text-slate-400 mt-1 text-sm">No XP awarded. We'll review it.</p>
          <Link to="/dashboard" className="btn-primary mt-5 inline-block px-6">Leave</Link>
        </div>
      </LibraryOverlay>
    )
  }

  const myUserId = profile?.id
  const partnerId = partner?.id

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 56px)' }}>
      {/* ── Library background ── */}
      <div className="absolute inset-0">
        <LibraryScene tables={tables} myUserId={myUserId} partnerId={partnerId} />
      </div>

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 z-20"
           style={{ background: 'linear-gradient(to bottom, rgba(13,13,20,0.92), transparent)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-400">
            {partner ? `Studying with @${partner.username}` : 'Finding your seat…'}
          </span>
        </div>
        <Link
          to="/dashboard"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono"
        >
          Leave library ↗
        </Link>
      </div>

      {/* ── Left panel: commit / task + timer + actions ── */}
      <div className="absolute top-12 left-3 bottom-3 w-72 flex flex-col gap-2.5 z-20 overflow-y-auto">
        {!bothCommitted ? (
          <GlassPanel>
            <CommitForm />
          </GlassPanel>
        ) : (
          <>
            <GlassPanel>
              <TaskBlock who="You" task={myTask} done={session[`user_${session.user_a === myUserId ? 'a' : 'b'}_done`]} />
              <div className="border-t border-white/[0.06] my-3" />
              <TaskBlock who={partner?.username ?? 'Partner'} task={partnerTask} done={session[`user_${session.user_a === partnerId ? 'a' : 'b'}_done`]} />
            </GlassPanel>
            <GlassPanel>
              <Timer />
            </GlassPanel>
            <GlassPanel noPad>
              <div className="flex gap-2 p-3">
                <DoneButton />
                <CalloutButton />
              </div>
              <ApprovalPrompt />
            </GlassPanel>
          </>
        )}
      </div>

      {/* ── Right panel: chat ── */}
      <div className="absolute top-12 right-3 bottom-3 w-72 z-20 flex flex-col">
        <button
          onClick={() => setChatOpen((v) => !v)}
          className="mb-2 self-end flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors glass-pill px-3 py-1.5 rounded-full border border-white/[0.07]"
          style={{ background: 'rgba(13,13,20,0.75)', backdropFilter: 'blur(12px)' }}
        >
          💬 {chatOpen ? 'Hide chat' : 'Open chat'}
        </button>
        {chatOpen && (
          <GlassPanel className="flex-1 min-h-0">
            <ChatPanel />
          </GlassPanel>
        )}
      </div>

      {/* ── School label ── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">
          {profile?.school ?? 'The Library'}
        </span>
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function GlassPanel({ children, noPad = false, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] ${noPad ? '' : 'p-4'} ${className}`}
      style={{ background: 'rgba(13,13,20,0.82)', backdropFilter: 'blur(16px)' }}
    >
      {children}
    </div>
  )
}

function TaskBlock({ who, task, done }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-widest text-slate-600 font-mono">{who}</span>
        {done && <span className="text-[10px] text-emerald-400 font-mono">✓ done</span>}
      </div>
      <p className="text-sm text-slate-200 leading-snug">{task ?? '…'}</p>
    </div>
  )
}

function LibraryLoading() {
  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="absolute inset-0" style={{ background: '#5C1212' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">📚</div>
          <p className="text-amber-500/70 font-mono text-sm tracking-wider">Finding your seat…</p>
        </div>
      </div>
    </div>
  )
}

function LibraryOverlay({ children }) {
  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="absolute inset-0" style={{ background: '#5C1212', opacity: 0.6 }} />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="rounded-2xl p-8 border border-white/[0.08] max-w-sm w-full text-center"
             style={{ background: 'rgba(13,13,20,0.9)', backdropFilter: 'blur(20px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function StatusOverlay({ icon, title, body }) {
  return (
    <LibraryOverlay>
      <div className="text-4xl mb-3">{icon}</div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {body && <p className="text-slate-400 mt-1 text-sm">{body}</p>}
      <Link to="/dashboard" className="btn-primary mt-5 inline-block px-6">Go back</Link>
    </LibraryOverlay>
  )
}
