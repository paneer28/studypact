export default function MatchQueue({ onCancel }) {
  return (
    <div className="card text-center py-10 space-y-4">
      <div
        className="mx-auto w-14 h-14 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: 'rgba(200,135,30,0.25)', borderTopColor: '#C8871E' }}
      />
      <div>
        <h3 className="font-display text-xl text-stone-100">Finding your partner…</h3>
        <p className="text-stone-500 text-sm mt-1.5 max-w-xs mx-auto">
          We'll seat you with another student who's ready to lock in.
        </p>
      </div>
      <button onClick={onCancel} className="btn-secondary">Leave queue</button>
    </div>
  )
}
