import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'

const steps = [
  {
    number: '01',
    title: 'Join the queue',
    description:
      'Press "Find a partner" and StudyPact matches you with another student — prioritizing your university if you signed up with a .edu email, or anyone worldwide.',
    icon: '🎲',
  },
  {
    number: '02',
    title: 'Commit to your task',
    description:
      "Both partners type what they're working on and how long it'll take. No vague \"studying\" — a real commitment, visible to your partner.",
    icon: '📝',
  },
  {
    number: '03',
    title: 'Study with accountability',
    description:
      'Share your screen (optional), chat, and focus. If your partner looks distracted, call them out. A 5-minute cooldown keeps it fair.',
    icon: '🖥️',
  },
  {
    number: '04',
    title: 'Get approved, earn XP',
    description:
      'When done, mark yourself complete. Your partner reviews and approves (or disputes). Mutual approval earns you both XP, builds your streak, and climbs the leaderboard.',
    icon: '🏆',
  },
]

const faqs = [
  {
    q: 'What if my partner goes offline?',
    a: 'The session stays open. You can still complete your task and mark done — your partner can approve later, or a moderator review can be requested.',
  },
  {
    q: 'Is screen sharing required?',
    a: 'No. It\'s optional and peer-to-peer (WebRTC) — nothing is recorded or stored.',
  },
  {
    q: 'How does matching work?',
    a: 'StudyPact first tries to match you with someone at your university (detected from your .edu email). If no one is available, it matches with any student in the queue.',
  },
  {
    q: 'What is XP used for?',
    a: 'XP determines your level and rank on the leaderboard. You earn XP for completing sessions, approving partners, and maintaining streaks.',
  },
]

export default function HowItWorks() {
  return (
    <div className="max-w-3xl mx-auto space-y-16 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
          How StudyPact works
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          Four steps from "I should study" to actually getting it done.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="card flex gap-6 items-start"
          >
            <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xl">
              {step.icon}
            </div>
            <div>
              <div className="text-xs font-mono text-brand-400 mb-1">{step.number}</div>
              <h3 className="font-semibold text-white text-lg mb-1">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="space-y-4"
      >
        <h2 className="font-display text-2xl font-bold text-white">Common questions</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.q} className="card space-y-1">
              <p className="font-medium text-white text-sm">{faq.q}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="card text-center py-10 border-brand-500/10"
        style={{ background: 'linear-gradient(135deg, #13131e 0%, #0f1520 100%)' }}
      >
        <h3 className="font-display text-2xl font-bold text-white mb-2">Ready to try it?</h3>
        <p className="text-slate-500 text-sm mb-6">Takes 30 seconds to sign up. Your partner is waiting.</p>
        <Link to="/login?mode=signup">
          <Button className="gap-2 px-6">
            Create free account <MoveRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
