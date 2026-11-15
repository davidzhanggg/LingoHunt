'use client'

import Link from 'next/link'
import { Award, Bot, Check, Clock, Flame, Footprints, Target, Zap, type LucideIcon } from 'lucide-react'
import { DifficultyBadge, XpChip } from '@/components/badges'
import { cta } from '@/components/cta'
import { LockedNotice } from '@/components/locked-notice'
import { MissionIcon } from '@/components/mission-icon'
import { ScreenBody, ScreenFooter, ScreenHeader } from '@/components/screen'
import { ScreenSkeleton } from '@/components/skeleton'
import { PRACTICE_XP, getMission, getMissionSteps } from '@/lib/data'
import { isUnlocked } from '@/lib/journey'
import { useJourney } from '@/lib/progress'
import { cn } from '@/lib/utils'

export function MissionDetailsScreen({ missionId }: { missionId: string }) {
  const { progress, hydrated, xp, level } = useJourney()
  const mission = getMission(missionId)

  if (!mission) return null
  if (!hydrated) return <ScreenSkeleton />
  if (!isUnlocked(mission, xp)) return <LockedNotice mission={mission} xp={xp} />

  const practiced = progress.practiced.includes(mission.id)
  const completed = progress.completed.includes(mission.id)

  return (
    <>
      <ScreenHeader
        title="Mission details"
        subtitle={`${mission.context} · ${mission.difficulty}`}
        backHref="/missions"
      />

      <ScreenBody className="space-y-5">
        <section className="rounded-3xl bg-secondary p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground">
                {mission.context} mission
              </p>
              <h1 className="mt-1.5 text-balance text-[26px] font-bold leading-[1.1] tracking-tight">
                {mission.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">{mission.summary}</p>
            </div>
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-card text-primary">
              <MissionIcon icon={mission.icon} className="size-6" />
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <DifficultyBadge difficulty={mission.difficulty} />
            <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground/80">
              <Clock className="size-3" aria-hidden="true" />
              {mission.minutes} min
            </span>
            <XpChip className="bg-card">{mission.xp} XP</XpChip>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatusPill done={practiced} icon={Bot} label="AI practice" />
            <StatusPill done={completed} icon={Footprints} label="Real world" />
          </div>
        </section>

        <Section title="Objectives">
          <ul className="space-y-2.5 rounded-3xl border border-border/70 bg-card p-4">
            {mission.objectives.map((objective) => (
              <li key={objective} className="flex items-start gap-3 text-sm leading-snug">
                <Target className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                {objective}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Useful phrases">
          <ul className="space-y-2">
            {mission.phrases.map((phrase) => (
              <li key={phrase.text} className="rounded-2xl border border-border/70 bg-card p-3.5">
                <p className="text-sm font-semibold leading-snug">
                  {'“'}
                  {phrase.text}
                  {'”'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{phrase.note}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Expected dialogue">
          <ol className="space-y-2 rounded-3xl bg-muted/60 p-3.5">
            {mission.dialogue.map((line, index) => {
              const isYou = line.speaker === 'you'
              return (
                <li key={index} className={cn('flex', isYou ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5',
                      isYou
                        ? 'rounded-br-md bg-accent text-accent-foreground'
                        : 'rounded-bl-md bg-card',
                    )}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {isYou ? 'You' : mission.persona.name}
                    </p>
                    <p className="mt-0.5 text-[13px] font-medium leading-relaxed">{line.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </Section>

        <Section title="Mission steps">
          <ol className="space-y-3 rounded-3xl border border-border/70 bg-card p-4">
            {getMissionSteps(mission).map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug">{step.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Potential rewards">
          <ul className="space-y-2.5 rounded-3xl bg-accent p-4">
            <Reward
              icon={Zap}
              title={`+${mission.xp} XP`}
              detail={completed ? 'Earned for the real-world mission' : 'For completing the real-world mission'}
            />
            <Reward
              icon={Bot}
              title={`+${PRACTICE_XP} XP`}
              detail={practiced ? 'Earned for your AI practice' : 'For your first AI practice'}
            />
            <Reward icon={Flame} title="Streak" detail="Any activity today keeps your streak alive" />
            {level.next && (
              <Reward
                icon={Award}
                title={`${level.next.badge} badge`}
                detail={`Unlocks at Level ${level.next.id}, ${level.toNext} XP away`}
              />
            )}
          </ul>
        </Section>
      </ScreenBody>

      <ScreenFooter>
        <Link href={`/practice?mission=${mission.id}`} className={cta('primary')}>
          <Bot className="size-4" aria-hidden="true" />
          {practiced ? 'Practice with AI again' : 'Practice with AI'}
        </Link>
        <Link href={`/missions/${mission.id}/complete`} className={cta(completed ? 'outline' : 'real')}>
          <Footprints className="size-4" aria-hidden="true" />
          {completed ? 'View completed mission' : 'Start Real-World Mission'}
        </Link>
      </ScreenFooter>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function StatusPill({ done, icon: Icon, label }: { done: boolean; icon: LucideIcon; label: string }) {
  return (
    <span
      className={cn(
        'flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold',
        done ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground/80',
      )}
    >
      {done ? (
        <Check className="size-3.5 shrink-0" aria-hidden="true" />
      ) : (
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      )}
      {label}
      <span className="sr-only">{done ? 'done' : 'not done yet'}</span>
    </span>
  )
}

function Reward({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-xp">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-accent-foreground">{title}</p>
        <p className="text-xs text-accent-foreground/75">{detail}</p>
      </div>
    </li>
  )
}
