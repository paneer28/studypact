export default function MatchQueue({ onCancel }) {
  return (
    <div className="card text-center">
      <div className="mx-auto w-16 h-16 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      <h3 className="mt-4 text-xl font-semibold">Finding your partner…</h3>
      <p className="text-slate-500 mt-1">We'll match you with another student who's ready to lock in.</p>
      <button onClick={onCancel} className="btn-secondary mt-5">Cancel</button>
    </div>
  )
}
