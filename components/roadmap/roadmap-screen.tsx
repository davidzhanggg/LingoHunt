'use client'

import Link from 'next/link'
import { ArrowRight, Award, Bot, Check, Footprints, Lock, type LucideIcon } from 'lucide-react'
import { XpChip } from '@/components/badges'
import { LevelProgressCard } from '@/components/level-progress-card'
import { MissionIcon } from '@/components/mission-icon'
import { ResetProgress } from '@/components/reset-progress'
import { ScreenBody } from '@/components/screen'
import { ScreenSkeleton } from '@/components/skeleton'
import { LEVELS, MISSIONS, type Level, type Mission } from '@/lib/data'
import { getStatus, type MissionStatus } from '@/lib/journey'
import { useJourney } from '@/lib/progress'
import { cn } from '@/lib/utils'

export function RoadmapScreen() {
  const { progress, hydrated, xp, level, recommended } = useJourney()

  if (!hydrated) return <ScreenSkeleton />

  const badgesEarned = LEVELS.filter((item) => xp >= item.xpRequired).length

  return (
    <ScreenBody className="space-y-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div>
        <h1 className="text-[28px] font-bold leading-[1.1] tracking-tight">Your journey.</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {progress.completed.length} of {MISSIONS.length} missions complete · {badgesEarned} of{' '}
          {LEVELS.length} badges
        </p>
      </div>

      <LevelProgressCard xp={xp} level={level} streak={progress.streak} />

      <div className="flex items-center justify-center gap-2 rounded-2xl bg-muted/70 px-3 py-2.5 text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5 text-primary">
          <Bot className="size-4" aria-hidden="true" />
          AI practice
        </span>
        <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">prepares you for</span>
        <span className="inline-flex items-center gap-1.5 text-real-ink">
          <Footprints className="size-4" aria-hidden="true" />
          Real-world mission
        </span>
      </div>

      <ol aria-label="Learning roadmap">
        {LEVELS.map((item, levelIndex) => {
          const missions = MISSIONS.filter((mission) => mission.levelId === item.id)
          const reached = xp >= item.xpRequired
          const isLastLevel = levelIndex === LEVELS.length - 1
          return (
            <LevelSection key={item.id}>
              <PathRow
                isLast={isLastLevel && missions.length === 0}
                lineDone={reached}
                node={
                  <span
                    className={cn(
                      'flex size-11 items-center justify-center rounded-2xl',
                      reached ? 'bg-xp text-xp-foreground' : 'bg-xp-soft text-xp',
                    )}
                  >
                    {reached ? (
                      <Award className="size-5" aria-hidden="true" />
                    ) : (
                      <Lock className="size-4" aria-hidden="true" />
                    )}
                  </span>
                }
              >
                <LevelHeader level={item} reached={reached} xp={xp} />
              </PathRow>

              {missions.map((mission, missionIndex) => {
                const status = getStatus(mission, progress, xp)
                return (
                  <PathRow
                    key={mission.id}
                    isLast={isLastLevel && missionIndex === missions.length - 1}
                    lineDone={status === 'completed'}
                    node={<MissionNode mission={mission} status={status} current={recommended?.id === mission.id} />}
                  >
                    <MissionRow
                      mission={mission}
                      status={status}
                      practiced={progress.practiced.includes(mission.id)}
                      current={recommended?.id === mission.id}
                    />
                  </PathRow>
                )
              })}
            </LevelSection>
          )
        })}
      </ol>

      <ResetProgress />
    </ScreenBody>
  )
}

function LevelSection({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <ol>{children}</ol>
    </li>
  )
}

function PathRow({
  node,
  lineDone,
  isLast,
  children,
}: {
  node: React.ReactNode
  lineDone: boolean
  isLast: boolean
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-3">
      <div className="flex w-11 shrink-0 flex-col items-center">
        {node}
        {!isLast && (
          <span
            aria-hidden="true"
            className={cn(
              'my-1 w-0.5 flex-1 rounded-full transition-colors duration-500',
              lineDone ? 'bg-primary' : 'bg-input',
            )}
          />
        )}
      </div>
      <div className={cn('min-w-0 flex-1', !isLast && 'pb-4')}>{children}</div>
    </li>
  )
}

function LevelHeader({ level, reached, xp }: { level: Level; reached: boolean; xp: number }) {
  return (
    <div className="flex min-h-11 flex-col justify-center">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-xp">
        Level {level.id} · {reached ? 'Unlocked' : `${level.xpRequired} XP`}
      </p>
      <h2 className="text-base font-bold leading-tight">{level.name}</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {reached
          ? `${level.tagline} · ${level.badge} badge earned`
          : `${level.xpRequired - xp} XP to go · unlocks the ${level.badge} badge`}
      </p>
    </div>
  )
}

function MissionNode({
  mission,
  status,
  current,
}: {
  mission: Mission
  status: MissionStatus
  current: boolean
}) {
  if (status === 'completed') {
    return (
      <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-5" aria-hidden="true" />
      </span>
    )
  }
  if (status === 'locked') {
    return (
      <span className="flex size-11 items-center justify-center rounded-full border border-dashed border-input bg-muted text-muted-foreground">
        <Lock className="size-4" aria-hidden="true" />
      </span>
    )
  }
  return (
    <span className="relative flex size-11 items-center justify-center">
      {current && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-primary/25 [animation-duration:2s]"
        />
      )}
      <span
        className={cn(
          'relative flex size-11 items-center justify-center rounded-full bg-card text-primary',
          current ? 'border-2 border-primary' : 'border border-input',
        )}
      >
        <MissionIcon icon={mission.icon} className="size-5" />
      </span>
    </span>
  )
}

function MissionRow({
  mission,
  status,
  practiced,
  current,
}: {
  mission: Mission
  status: MissionStatus
  practiced: boolean
  current: boolean
}) {
  const locked = status === 'locked'
  const completed = status === 'completed'

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-sm font-semibold leading-snug">{mission.title}</p>
        <XpChip solid={completed}>{completed ? `${mission.xp} XP earned` : `${mission.xp} XP`}</XpChip>
      </div>
      {current && (
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-primary">Up next</p>
      )}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <StepPill icon={Bot} label="AI practice" done={practiced} tone="ai" />
        <ArrowRight className="size-3 text-muted-foreground" aria-hidden="true" />
        <StepPill icon={Footprints} label="Real world" done={completed} tone="real" />
      </div>
    </>
  )

  if (locked) {
    return (
      <div
        aria-disabled="true"
        className="rounded-2xl border border-dashed border-input p-3.5 text-muted-foreground"
      >
        {content}
        <span className="sr-only">Locked until Level {mission.levelId}</span>
      </div>
    )
  }

  return (
    <Link
      href={`/missions/${mission.id}`}
      className={cn(
        'block rounded-2xl border bg-card p-3.5 outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.99]',
        current ? 'border-primary/60 shadow-sm' : 'border-border/70 hover:border-primary/40',
      )}
    >
      {content}
    </Link>
  )
}

function StepPill({
  icon: Icon,
  label,
  done,
  tone,
}: {
  icon: LucideIcon
  label: string
  done: boolean
  tone: 'ai' | 'real'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold',
        !done && 'bg-muted text-muted-foreground',
        done && tone === 'ai' && 'bg-secondary text-secondary-foreground',
        done && tone === 'real' && 'bg-real-soft text-real-ink',
      )}
    >
      {done ? (
        <Check className="size-3" aria-hidden="true" />
      ) : (
        <Icon className="size-3" aria-hidden="true" />
      )}
      {label}
      <span className="sr-only">{done ? 'done' : 'not done'}</span>
    </span>
  )
}
