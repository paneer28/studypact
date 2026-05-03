import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MoveRight, Sparkles } from 'lucide-react'
import LoginForm from '../components/auth/LoginForm.jsx'
import SignupForm from '../components/auth/SignupForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Hero as AnimatedHero } from '../components/ui/animated-hero.jsx'
import HoverBrandLogo from '../components/ui/hover-brand-logo.jsx'
import { Button } from '../components/ui/button.jsx'

export default function Home() {
  const [mode, setMode] = useState('signup')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  return (
    <div className="space-y-6">
      {/* Animated Hero with rotating words */}
      <AnimatedHero />

      {/* Hover brand logo strip */}
      <div className="border-y border-white/[0.06]">
        <HoverBrandLogo />
      </div>

      {/* Auth + feature card section */}
      <div className="grid md:grid-cols-2 gap-10 items-start py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/8 px-3 py-1 text-xs font-medium text-brand-400 mb-6">
            <Sparkles className="w-3 h-3" />
            Built for serious students
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-white mb-5">
            Stop studying<br />
            <span className="text-brand-400">alone.</span>
          </h2>

          <p className="text-slate-500 text-base leading-relaxed max-w-md mb-8">
            Random partner matching. Real-time screen sharing. Accountability checks. Earn XP and build streaks for showing up.
          </p>

          <ul className="grid grid-cols-2 gap-2.5 mb-8">
            {[
              'Random partner matching',
              'Peer-to-peer screen sharing',
              'Callout if they drift',
              'XP, streaks & leaderboards',
            ].map((label, i) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-2.5 rounded-xl bg-surface-800 border border-white/[0.06] px-4 py-3 text-sm text-slate-400"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                {label}
              </motion.li>
            ))}
          </ul>

          <Button onClick={() => setMode('signup')} className="gap-2">
            Create your account <MoveRight className="w-4 h-4" />
          </Button>
        </motion.div>

        <motion.div
          id="auth"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="card"
        >
          <div className="flex gap-1 mb-6 p-1 rounded-xl bg-surface-900 border border-white/[0.05]">
            {['signup', 'login'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  mode === m
                    ? 'bg-brand-500 text-surface-950 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            ))}
          </div>
          {mode === 'signup' ? <SignupForm /> : <LoginForm />}
        </motion.div>
      </div>
    </div>
  )
}
