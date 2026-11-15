import { Flame } from 'lucide-react'
import { ProgressBar } from '@/components/progress-bar'
import type { LevelInfo } from '@/lib/journey'

export function LevelProgressCard({
  xp,
  level,
  streak,
}: {
  xp: number
  level: LevelInfo
  streak: number
}) {
  return (
    <section aria-label="Your progress" className="rounded-3xl border border-border/70 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-xp">
            Level {level.current.id}
          </p>
          <p className="truncate text-lg font-bold leading-tight">{level.current.name}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-real-soft px-3 py-1.5 text-xs font-semibold text-real-ink">
          <Flame className="size-3.5" aria-hidden="true" />
          {streak}-day streak
        </span>
      </div>
      <ProgressBar
        value={level.percent}
        label={`Progress to ${level.next ? `level ${level.next.id}` : 'the top level'}`}
        className="mt-4"
      />
      <div className="mt-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-xp">{xp} XP</span>
        <span className="text-muted-foreground">
          {level.next ? `${level.toNext} XP to Level ${level.next.id}` : 'Top level reached'}
        </span>
      </div>
    </section>
  )
}
