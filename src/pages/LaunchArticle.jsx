import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'

export default function LaunchArticle() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Meta */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <span>May 2025</span>
            <span>·</span>
            <span>5 min read</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            Introducing StudyPact — accountability for students who actually want to get things done
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            We built the study tool we always wished existed. Here's why.
          </p>
          <div className="border-t border-white/[0.06]" />
        </div>

        {/* Body */}
        <div className="prose prose-sm max-w-none space-y-6 text-slate-400 leading-relaxed">
          <p>
            Every student knows the feeling: you open your laptop, swear you'll study for two hours, and somehow end up on YouTube forty minutes later wondering what happened. It's not a motivation problem. It's a structure problem.
          </p>

          <p>
            Libraries used to solve this. Sitting in a room full of people studying created a kind of low-grade social pressure — you couldn't just pull out your phone without feeling like everyone noticed. Remote learning and hybrid schedules broke that structure for a lot of people, and it never fully came back.
          </p>

          <h2 className="font-display text-xl font-bold text-white mt-8 mb-2">The idea</h2>
          <p>
            StudyPact is simple: you get matched with a random student, you both commit to a specific task, and then you work in parallel. When you're done, your partner verifies it. If you drift — if you start watching a video or scrolling Twitter — your partner can call you out.
          </p>

          <p>
            We prioritize matching students at the same university when possible. There's something about knowing the person on the other side is in the same place, maybe studying for the same exam, that makes the accountability feel more real.
          </p>

          <h2 className="font-display text-xl font-bold text-white mt-8 mb-2">What we built</h2>
          <p>
            The core loop is: join queue → get matched → commit to a task → work → get approved. That's it. We deliberately kept it narrow.
          </p>

          <p>
            On top of that we layered XP, streaks, and a leaderboard — not because we think gamification fixes everything, but because showing up consistently is genuinely hard, and a streak you've maintained for 14 days is a small thing that makes you think twice before skipping.
          </p>

          <p>
            Screen sharing is optional and peer-to-peer. Nothing is recorded. Your screen goes to one person — your study partner — and nowhere else.
          </p>

          <h2 className="font-display text-xl font-bold text-white mt-8 mb-2">Who it's for</h2>
          <p>
            Students who already know what they need to do, but struggle to actually start or stay on task. People who've tried Pomodoro timers, focus apps, and lo-fi playlists, and found them all too easy to ignore. StudyPact works because another person is watching.
          </p>

          <h2 className="font-display text-xl font-bold text-white mt-8 mb-2">What's next</h2>
          <p>
            We're launching with the core session loop. Coming soon: recurring study schedules with the same partner, subject-based matching, and longer-form accountability challenges. For now, try it. Your partner is probably already waiting.
          </p>
        </div>

        {/* CTA */}
        <div className="card text-center py-10 border-brand-500/10 mt-10" style={{ background: 'linear-gradient(135deg, #13131e 0%, #0f1520 100%)' }}>
          <h3 className="font-display text-xl font-bold text-white mb-2">Try it for free</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">30 seconds to sign up. No credit card.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/login?mode=signup">
              <Button className="gap-2">
                Get started <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/how-it-works" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              How it works →
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  )
}
