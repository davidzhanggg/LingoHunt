import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Award, Check, Flame } from 'lucide-react'
import { cta } from '@/components/cta'
import { ProgressBar } from '@/components/progress-bar'
import { ScreenBody, ScreenFooter, ScreenHeader } from '@/components/screen'
import type { Mission } from '@/lib/data'
import { getLevelInfo } from '@/lib/journey'
import type { ActivityResult } from '@/lib/progress'
import { cn } from '@/lib/utils'

const CONFETTI_COLORS = ['bg-primary', 'bg-real', 'bg-xp']

const CONFETTI = Array.from({ length: 30 }, (_, index) => ({
  left: (index * 37 + 11) % 100,
  delay: (index % 6) * 0.08,
  duration: 1.7 + (index % 5) * 0.25,
  drift: ((index % 9) - 4) * 16,
  spin: 360 + (index % 4) * 180,
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
}))

function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {CONFETTI.map((piece, index) => (
        <span
          key={index}
          className={cn('confetti-piece', piece.color)}
          style={
            {
              left: `${piece.left}%`,
              '--delay': `${piece.delay}s`,
              '--dur': `${piece.duration}s`,
              '--drift': `${piece.drift}px`,
              '--spin': `${piece.spin}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function Celebration({ mission, outcome }: { mission: Mission; outcome: ActivityResult }) {
  const before = getLevelInfo(outcome.xpBefore)
  const after = getLevelInfo(outcome.xpAfter)
  const leveledUp = after.current.id > before.current.id

  return (
    <>
      <Confetti />
      <ScreenHeader title="Mission complete" subtitle={mission.title} />

      <ScreenBody className="space-y-4">
        <div role="status" className="flex flex-col items-center pt-2 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary duration-500 animate-in zoom-in-50">
            <Check className="size-8" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-[28px] font-bold leading-tight tracking-tight">You did it.</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mission.title} is done, out in the real world.
          </p>
        </div>

        <div className="rounded-3xl bg-xp-soft p-6 text-center duration-500 animate-in fade-in zoom-in-95">
          <p className="text-5xl font-bold tracking-tight text-xp">+{outcome.xpGained}</p>
          <p className="mt-1 text-sm font-semibold text-xp">XP earned</p>
        </div>

        <section aria-label="Level progress" className="rounded-3xl border border-border/70 bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">
              Level {after.current.id} · {after.current.name}
            </p>
            <p className="text-sm font-semibold text-xp">{outcome.xpAfter} XP</p>
          </div>
          <ProgressBar
            value={after.percent}
            from={leveledUp ? 0 : before.percent}
            label="Level progress"
            className="mt-3"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {after.next
              ? `${after.toNext} XP to Level ${after.next.id} · ${after.next.name}`
              : 'Top level reached'}
          </p>
        </section>

        {leveledUp && (
          <section className="flex items-center gap-3 rounded-3xl bg-secondary p-4 duration-500 animate-in fade-in slide-in-from-bottom-2">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Award className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Level up! Level {after.current.id} unlocked</p>
              <p className="text-xs text-secondary-foreground">
                New badge: {after.current.badge}
              </p>
            </div>
          </section>
        )}

        <div className="flex items-center gap-3 rounded-3xl bg-real-soft p-4">
          <Flame className="size-5 shrink-0 text-real" aria-hidden="true" />
          <p className="text-sm font-semibold text-real-ink">
            {outcome.streak}-day streak{outcome.streakIncreased ? ' · extended today' : ''}
          </p>
        </div>
      </ScreenBody>

      <ScreenFooter>
        <Link href="/roadmap" className={cta('primary')}>
          See Updated Roadmap
        </Link>
        <Link href="/" className={cta('outline')}>
          Back to Home
        </Link>
      </ScreenFooter>
    </>
  )
}
