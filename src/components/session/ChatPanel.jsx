import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useSession } from '../../context/SessionContext.jsx'

export default function ChatPanel() {
  const { session, profile, partner } = useSession()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!session?.id) return
    let active = true
    supabase
      .from('messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => { if (active) setMessages(data ?? []) })

    const ch = supabase
      .channel(`messages:${session.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `session_id=eq.${session.id}`,
      }, (payload) => setMessages((prev) => [...prev, payload.new]))
      .subscribe()

    return () => { active = false; supabase.removeChannel(ch) }
  }, [session?.id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async (e) => {
    e.preventDefault()
    const content = text.trim()
    if (!content) return
    setText('')
    await supabase.from('messages').insert({
      session_id: session.id,
      sender_id: profile.id,
      content,
      type: 'text',
    })
  }

  const nameFor = (id) => id === profile.id ? 'You' : (partner?.username ?? 'Partner')

  return (
    <div className="card flex flex-col h-96">
      <h3 className="font-semibold mb-2">Chat</h3>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 pr-1">
        {messages.length === 0 && (
          <p className="text-slate-400 text-sm text-center mt-8">Say hi 👋</p>
        )}
        {messages.map((m) => (
          <Message key={m.id} m={m} from={nameFor(m.sender_id)} isMe={m.sender_id === profile.id} />
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2 mt-2">
        <input className="input" placeholder="Type a message…" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn-primary">Send</button>
      </form>
    </div>
  )
}

function Message({ m, from, isMe }) {
  if (m.type === 'callout') {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 px-3 py-2 text-sm">
        👀 <b>{from}</b> called you out: {m.content}
      </div>
    )
  }
  if (m.type === 'system') {
    return <div className="text-xs text-slate-400 text-center">{m.content}</div>
  }
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-sm ${isMe ? 'bg-brand-500 text-white' : 'bg-surface-700 text-slate-200'}`}>
        <div className={`text-[10px] uppercase tracking-wide ${isMe ? 'text-white/70' : 'text-slate-400'}`}>{from}</div>
        {m.content}
      </div>
    </div>
  )
}
