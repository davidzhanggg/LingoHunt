'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, ChevronRight, CircleCheck, Lock } from 'lucide-react'
import { DifficultyBadge, XpChip } from '@/components/badges'
import { MissionIcon } from '@/components/mission-icon'
import { ScreenBody } from '@/components/screen'
import { ScreenSkeleton } from '@/components/skeleton'
import {
  CONTEXTS,
  DIFFICULTIES,
  MISSIONS,
  type Difficulty,
  type Mission,
  type MissionContext,
} from '@/lib/data'
import { getStatus, type MissionStatus } from '@/lib/journey'
import { useJourney } from '@/lib/progress'
import { cn } from '@/lib/utils'

type DifficultyFilter = 'All' | Difficulty
type ContextFilter = 'All' | MissionContext

const DIFFICULTY_OPTIONS: DifficultyFilter[] = ['All', ...DIFFICULTIES]
const CONTEXT_OPTIONS: ContextFilter[] = ['All', ...CONTEXTS]

export function MissionsScreen() {
  const { progress, hydrated, xp } = useJourney()
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All')
  const [context, setContext] = useState<ContextFilter>('All')

  if (!hydrated) return <ScreenSkeleton />

  const missions = MISSIONS.filter(
    (mission) =>
      (difficulty === 'All' || mission.difficulty === difficulty) &&
      (context === 'All' || mission.context === context),
  )

  return (
    <ScreenBody className="space-y-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div>
        <h1 className="text-[28px] font-bold leading-[1.1] tracking-tight">Missions.</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {progress.completed.length} of {MISSIONS.length} complete. Pick one that fits your day.
        </p>
      </div>

      <div className="space-y-3">
        <FilterRow label="Difficulty" options={DIFFICULTY_OPTIONS} value={difficulty} onChange={setDifficulty} />
        <FilterRow label="Context" options={CONTEXT_OPTIONS} value={context} onChange={setContext} />
      </div>

      {missions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-6 text-center">
          <p className="text-sm font-semibold">No missions match these filters.</p>
          <button
            type="button"
            onClick={() => {
              setDifficulty('All')
              setContext('All')
            }}
            className="mt-3 h-10 rounded-full bg-secondary px-4 text-sm font-semibold text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} status={getStatus(mission, progress, xp)} />
          ))}
        </ul>
      )}
    </ScreenBody>
  )
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: T[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div
        role="group"
        aria-label={`Filter by ${label.toLowerCase()}`}
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-0.5"
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={cn(
              'h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40',
              value === option
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:bg-muted',
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function MissionCard({ mission, status }: { mission: Mission; status: MissionStatus }) {
  const locked = status === 'locked'
  const completed = status === 'completed'

  const content = (
    <>
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-2xl',
          completed && 'bg-primary text-primary-foreground',
          locked && 'bg-muted text-muted-foreground',
          !completed && !locked && 'bg-secondary text-primary',
        )}
      >
        {locked ? (
          <Lock className="size-5" aria-hidden="true" />
        ) : (
          <MissionIcon icon={mission.icon} className="size-5" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-snug">{mission.title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {mission.context} · {mission.minutes} min
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-1.5">
          <DifficultyBadge difficulty={mission.difficulty} />
          <XpChip>{mission.xp} XP</XpChip>
          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              <Check className="size-3" aria-hidden="true" />
              Completed
            </span>
          )}
          {status === 'practiced' && (
            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              Practiced
            </span>
          )}
          {locked && (
            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              Unlocks at Level {mission.levelId}
            </span>
          )}
        </span>
      </span>
      {completed && <CircleCheck className="size-5 shrink-0 text-primary" aria-hidden="true" />}
      {!completed && !locked && (
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      )}
    </>
  )

  if (locked) {
    return (
      <li>
        <div
          aria-disabled="true"
          className="flex items-center gap-3.5 rounded-3xl border border-dashed border-border p-4"
        >
          {content}
        </div>
      </li>
    )
  }

  return (
    <li>
      <Link
        href={`/missions/${mission.id}`}
        className="flex items-center gap-3.5 rounded-3xl border border-border/70 bg-card p-4 outline-none transition-all hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.99]"
      >
        {content}
      </Link>
    </li>
  )
}
