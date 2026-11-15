'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Bot, Check, CircleCheck, Info, LoaderCircle } from 'lucide-react'
import { XpChip } from '@/components/badges'
import { cta } from '@/components/cta'
import { LockedNotice } from '@/components/locked-notice'
import { Celebration } from '@/components/real-world/celebration'
import { ProofUpload } from '@/components/real-world/proof-upload'
import { ScreenBody, ScreenFooter, ScreenHeader } from '@/components/screen'
import { ScreenSkeleton } from '@/components/skeleton'
import { getMission, type Mission } from '@/lib/data'
import { isUnlocked } from '@/lib/journey'
import { completeMission, useJourney, type ActivityResult } from '@/lib/progress'
import { cn } from '@/lib/utils'

type Phase = 'checklist' | 'saving' | 'done'

export function RealWorldScreen({ missionId }: { missionId: string }) {
  const { progress, hydrated, xp } = useJourney()
  const mission = getMission(missionId)

  const [phase, setPhase] = useState<Phase>('checklist')
  const [checked, setChecked] = useState<number[]>([])
  const [outcome, setOutcome] = useState<ActivityResult | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  if (!mission) return null
  if (!hydrated) return <ScreenSkeleton />
  if (phase === 'done' && outcome) return <Celebration mission={mission} outcome={outcome} />
  if (!isUnlocked(mission, xp)) return <LockedNotice mission={mission} xp={xp} />
  if (progress.completed.includes(mission.id)) return <AlreadyCompleted mission={mission} />

  const total = mission.objectives.length
  const allChecked = checked.length === total
  const saving = phase === 'saving'
  const practiced = progress.practiced.includes(mission.id)
  const id = mission.id

  function toggle(index: number) {
    setChecked((previous) =>
      previous.includes(index) ? previous.filter((item) => item !== index) : [...previous, index],
    )
  }

  function confirm() {
    if (!allChecked || phase !== 'checklist') return
    setPhase('saving')
    timer.current = window.setTimeout(() => {
      setOutcome(completeMission(id))
      setPhase('done')
    }, 1400)
  }

  return (
    <>
      <ScreenHeader
        title="Real-world mission"
        subtitle={`${mission.context} · ${mission.difficulty}`}
        backHref={`/missions/${mission.id}`}
        action={<XpChip>+{mission.xp} XP</XpChip>}
      />

      <ScreenBody className="space-y-4">
        <div>
          <h1 className="text-balance text-[26px] font-bold leading-[1.1] tracking-tight">
            {mission.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Head to {mission.place}, put your phone away and have the conversation. Then come back
            and tick off what you did.
          </p>
        </div>

        <section className="rounded-3xl border border-border/70 bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Mission checklist</h2>
            <span aria-live="polite" className="text-xs font-semibold text-real-ink">
              {checked.length} of {total} done
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {mission.objectives.map((objective, index) => {
              const isChecked = checked.includes(index)
              return (
                <li key={objective}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/40',
                      isChecked ? 'border-real/40 bg-real-soft' : 'border-border hover:bg-muted/50',
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isChecked}
                      disabled={saving}
                      onChange={() => toggle(index)}
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                        isChecked ? 'border-real bg-real text-real-foreground' : 'border-input',
                      )}
                    >
                      {isChecked && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span className="text-sm font-medium leading-snug">{objective}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>

        <ProofUpload disabled={saving} />

        <p className="flex gap-2 rounded-2xl bg-accent p-3.5 text-xs leading-relaxed text-accent-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-xp" aria-hidden="true" />
          <span>
            <span className="font-semibold">Demo note: </span>
            completion is self-reported. Proof stays on this device and is not uploaded or
            independently verified.
          </span>
        </p>

        {!practiced && (
          <Link
            href={`/practice?mission=${mission.id}`}
            className="flex items-center justify-center gap-2 rounded-2xl py-2 text-xs font-semibold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <Bot className="size-4" aria-hidden="true" />
            Not ready yet? Practice with AI first
          </Link>
        )}
      </ScreenBody>

      <ScreenFooter>
        <button
          type="button"
          onClick={confirm}
          disabled={!allChecked}
          aria-busy={saving}
          className={cta('real')}
        >
          {saving ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Saving your mission…
            </>
          ) : (
            'Complete Mission'
          )}
        </button>
        {!allChecked && (
          <p className="text-center text-xs text-muted-foreground">
            Tick all {total} checklist items to confirm.
          </p>
        )}
      </ScreenFooter>
    </>
  )
}

function AlreadyCompleted({ mission }: { mission: Mission }) {
  return (
    <>
      <ScreenHeader
        title="Real-world mission"
        subtitle={mission.title}
        backHref={`/missions/${mission.id}`}
      />
      <ScreenBody className="flex flex-col items-center justify-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
          <CircleCheck className="size-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Mission completed.</h1>
        <p className="mt-2 max-w-[28ch] text-pretty text-sm leading-relaxed text-muted-foreground">
          You already earned {mission.xp} XP for {mission.title}. Missions award XP once.
        </p>
      </ScreenBody>
      <ScreenFooter>
        <Link href="/roadmap" className={cta('primary')}>
          See your roadmap
        </Link>
        <Link href={`/practice?mission=${mission.id}`} className={cta('outline')}>
          Practice with AI again
        </Link>
      </ScreenFooter>
    </>
  )
}
