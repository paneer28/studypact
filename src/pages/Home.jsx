import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MoveRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { Hero as AnimatedHero } from '../components/ui/animated-hero.jsx'
import HoverBrandLogo from '../components/ui/hover-brand-logo.jsx'
import { Button } from '../components/ui/button.jsx'

const features = [
  { label: 'Random partner matching', icon: '🎲' },
  { label: 'Peer-to-peer screen sharing', icon: '🖥️' },
  { label: 'Callout if they drift', icon: '⚡' },
  { label: 'XP, streaks & leaderboards', icon: '🏆' },
]

export default function Home() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true })
  }, [user, loading, navigate])

  return (
    <div className="space-y-6">
      {/* Animated Hero */}
      <AnimatedHero />

      {/* Brand logo strip */}
      <div className="border-y border-white/[0.06]">
        <HoverBrandLogo />
      </div>

      {/* Feature + CTA section */}
      <div className="grid md:grid-cols-2 gap-10 items-center py-10">
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
            {features.map((f, i) => (
              <motion.li
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-2.5 rounded-xl bg-surface-800 border border-white/[0.06] px-4 py-3 text-sm text-slate-400"
              >
                <span className="text-base">{f.icon}</span>
                {f.label}
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link to="/login?mode=signup">
              <Button className="gap-2">
                Get started <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link
              to="/login"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Sign in →
            </Link>
          </div>
        </motion.div>

        {/* Right: visual / social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4"
        >
          {/* Stats cards */}
          {[
            { stat: '2,400+', label: 'Study sessions completed' },
            { stat: '94%', label: 'Users report better focus' },
            { stat: '18 min', label: 'Average session length' },
          ].map((item, i) => (
            <motion.div
              key={item.stat}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
              className="card flex items-center gap-5"
            >
              <div className="text-3xl font-display font-bold text-brand-400">{item.stat}</div>
              <div className="text-sm text-slate-500">{item.label}</div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="card border-brand-500/20"
          >
            <p className="text-slate-400 text-sm leading-relaxed italic mb-3">
              "Finally an app that makes me actually sit down and study. My partner calls me out every time I open Twitter."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">A</div>
              <span className="text-xs text-slate-600">@anika_cs · Stanford CS '26</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom CTA strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="card text-center py-12 border-brand-500/10"
        style={{ background: 'linear-gradient(135deg, #13131e 0%, #0f1520 100%)' }}
      >
        <h3 className="font-display text-2xl font-bold text-white mb-3">
          Ready to actually get stuff done?
        </h3>
        <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
          It's free. Takes 30 seconds. Your study partner is waiting.
        </p>
        <Link to="/login?mode=signup">
          <Button className="gap-2 px-6">
            Create free account <MoveRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
