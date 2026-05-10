import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MoveRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { Hero as AnimatedHero } from '../components/ui/animated-hero.jsx'
import HoverBrandLogo from '../components/ui/hover-brand-logo.jsx'
import { Button } from '../components/ui/button.jsx'

const features = [
  { label: 'Random partner matching', icon: '🎲' },
  { label: 'Peer-to-peer screen sharing', icon: '🖥️' },
  { label: 'Call out if they drift', icon: '⚡' },
  { label: 'XP, streaks & leaderboards', icon: '🏆' },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function Home() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true })
  }, [user, loading, navigate])

  return (
    <div className="space-y-0">

      {/* Hero */}
      <AnimatedHero />

      {/* University strip */}
      <div className="border-y" style={{ borderColor: 'rgba(180,130,60,0.1)' }}>
        <HoverBrandLogo />
      </div>

      {/* Features + social proof */}
      <div className="py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <motion.div {...fade(0)}>
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-6"
               style={{ background: 'rgba(200,135,30,0.1)', border: '1px solid rgba(200,135,30,0.25)', color: '#D4940A' }}>
            ✦ Built for serious students
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] text-stone-100 mb-5">
            Stop studying<br />
            <span className="italic text-brand-500">alone.</span>
          </h2>

          <p className="text-stone-500 text-base leading-relaxed max-w-md mb-8">
            Random partner matching. Real-time screen sharing. Accountability checks. Earn XP and build streaks for showing up.
          </p>

          <ul className="grid grid-cols-2 gap-2 mb-8">
            {features.map((f, i) => (
              <motion.li
                key={f.label}
                {...fade(i * 0.07)}
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-stone-400"
                style={{ background: '#1C1610', border: '1px solid rgba(180,130,60,0.1)' }}
              >
                <span className="text-base">{f.icon}</span>
                {f.label}
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link to="/login?mode=signup">
              <Button className="gap-2">Get started <MoveRight className="w-4 h-4" /></Button>
            </Link>
            <Link to="/login" className="text-sm text-stone-500 hover:text-stone-300 transition-colors">
              Sign in →
            </Link>
          </div>
        </motion.div>

        {/* Right — stats + testimonial */}
        <motion.div {...fade(0.1)} className="flex flex-col gap-3">
          {[
            { stat: '2,400+', label: 'Study sessions completed' },
            { stat: '94%',    label: 'Users report better focus' },
            { stat: '18 min', label: 'Average session length' },
          ].map((item, i) => (
            <motion.div
              key={item.stat}
              {...fade(i * 0.1 + 0.15)}
              className="card flex items-center gap-5"
            >
              <div className="font-display text-3xl font-bold text-brand-500">{item.stat}</div>
              <div className="text-sm text-stone-500">{item.label}</div>
            </motion.div>
          ))}

          <motion.div {...fade(0.45)} className="card" style={{ borderColor: 'rgba(200,135,30,0.15)' }}>
            <p className="text-stone-400 text-sm leading-relaxed italic mb-3">
              "Finally an app that makes me actually sit down and study. My partner calls me out every time I open Twitter."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                   style={{ background: 'rgba(200,135,30,0.2)', color: '#D4940A' }}>A</div>
              <span className="text-xs text-stone-600">@anika_cs · Stanford CS '26</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* How the library works — preview */}
      <motion.div
        {...fade(0)}
        className="card py-12 text-center overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #1C1610 0%, #120E08 100%)',
          borderColor: 'rgba(200,135,30,0.12)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(200,135,30,0.08), transparent 70%)' }} />
        <div className="relative">
          <div className="text-4xl mb-3">📖</div>
          <h3 className="font-display text-3xl font-bold text-stone-100 mb-2">Enter the library</h3>
          <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            When you start a session you literally walk into a library. See who's at the other tables. Find your seat. Get to work.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/login?mode=signup">
              <Button className="gap-2 px-6">Create free account <MoveRight className="w-4 h-4" /></Button>
            </Link>
            <Link to="/how-it-works" className="text-sm text-stone-500 hover:text-stone-300 transition-colors">
              How it works →
            </Link>
          </div>
        </div>
      </motion.div>

    </div>
  )
}
