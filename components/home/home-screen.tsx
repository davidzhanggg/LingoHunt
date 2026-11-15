'use client'

import Link from 'next/link'
import { ArrowRight, Bot, ChevronRight, Globe, Route, Trophy } from 'lucide-react'
import { cta } from '@/components/cta'
import { TodayMissionCard } from '@/components/home/today-mission-card'
import { LevelProgressCard } from '@/components/level-progress-card'
import { ResetProgress } from '@/components/reset-progress'
import { ScreenBody } from '@/components/screen'
import { Skeleton } from '@/components/skeleton'
import { DEFAULT_PRACTICE_MISSION_ID, MISSIONS, USER } from '@/lib/data'
import { useJourney } from '@/lib/progress'

export function HomeScreen() {
  const { progress, hydrated, xp, level, recommended } = useJourney()

  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-3 px-5 pb-1 pt-[max(1rem,env(safe-area-inset-top))]">
        <p className="text-[15px] font-semibold">Hi, {USER.name}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold">
          <Globe className="size-3.5 text-primary" aria-hidden="true" />
          <span className="sr-only">Learning language:</span>
          {USER.language}
        </span>
      </header>

      <ScreenBody className="space-y-4">
        <h1 className="text-balance text-[28px] font-bold leading-[1.1] tracking-tight">
          Your next conversation.
        </h1>

        {!hydrated ? (
          <div role="status" aria-label="Loading your progress" className="space-y-4">
            <Skeleton className="h-[122px] rounded-3xl" />
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        ) : (
          <>
            <LevelProgressCard xp={xp} level={level} streak={progress.streak} />

            {recommended ? (
              <TodayMissionCard
                key={recommended.id}
                mission={recommended}
                practiced={progress.practiced.includes(recommended.id)}
              />
            ) : (
              <section className="rounded-3xl bg-secondary p-5">
                <span className="flex size-12 items-center justify-center rounded-full bg-card text-primary">
                  <Trophy className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-3 text-[22px] font-bold leading-tight tracking-tight">
                  Every mission complete.
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">
                  You finished the whole journey. Review it, or reset the demo to run it again.
                </p>
                <Link href="/roadmap" className={cta('primary', 'mt-5')}>
                  Continue Your Journey
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </section>
            )}

            <Link
              href={`/practice?mission=${DEFAULT_PRACTICE_MISSION_ID}`}
              className="flex items-center gap-3.5 rounded-3xl bg-accent p-4 outline-none transition-transform focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.99]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-xp">
                <Bot className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-accent-foreground">
                  Quick AI practice
                </span>
                <span className="block text-xs text-accent-foreground/75">
                  Chat with Maya, your AI barista
                </span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-xp" aria-hidden="true" />
            </Link>

            <Link
              href="/roadmap"
              className="flex items-center gap-3.5 rounded-3xl border border-border/70 bg-card p-4 outline-none transition-transform focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.99]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Route className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Your roadmap</span>
                <span className="block text-xs text-muted-foreground">
                  {progress.completed.length} of {MISSIONS.length} missions complete
                </span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Link>

            <ResetProgress />
          </>
        )}
      </ScreenBody>
    </>
  )
}
