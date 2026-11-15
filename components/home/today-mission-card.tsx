'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Bot, Footprints, type LucideIcon } from 'lucide-react'
import { DifficultyBadge, XpChip } from '@/components/badges'
import { cta } from '@/components/cta'
import { MissionIcon } from '@/components/mission-icon'
import { PRACTICE_XP, type Mission } from '@/lib/data'
import { cn } from '@/lib/utils'

type Mode = 'ai' | 'real'

const MODES: { id: Mode; label: string; icon: LucideIcon }[] = [
  { id: 'ai', label: 'AI practice', icon: Bot },
  { id: 'real', label: 'Real world', icon: Footprints },
]

export function TodayMissionCard({ mission, practiced }: { mission: Mission; practiced: boolean }) {
  const [chosen, setChosen] = useState<Mode | null>(null)
  const mode = chosen ?? (practiced ? 'real' : 'ai')
  const isAi = mode === 'ai'

  return (
    <section aria-label="Today's recommended mission" className="space-y-3">
      <div
        role="group"
        aria-label="Choose how to continue"
        className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1"
      >
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setChosen(id)}
            className={cn(
              'flex h-10 items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold outline-none transition-all duration-200 focus-visible:ring-3 focus-visible:ring-ring/40',
              mode === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          'rounded-3xl p-5 transition-colors duration-300',
          isAi ? 'bg-secondary' : 'bg-real-soft',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <p
            className={cn(
              'text-[11px] font-semibold uppercase tracking-wider',
              isAi ? 'text-secondary-foreground' : 'text-real-ink',
            )}
          >
            Today&apos;s mission
          </p>
          <XpChip className="bg-card">+{isAi ? PRACTICE_XP : mission.xp} XP</XpChip>
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-balance text-[22px] font-bold leading-tight tracking-tight">
              {mission.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">
              {isAi
                ? `Rehearse with ${mission.persona.name}, your AI ${mission.persona.role}.`
                : `Do it for real at ${mission.place}.`}
            </p>
          </div>
          <span
            className={cn(
              'flex size-14 shrink-0 items-center justify-center rounded-full bg-card',
              isAi ? 'text-primary' : 'text-real',
            )}
          >
            <MissionIcon icon={mission.icon} className="size-6" />
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <DifficultyBadge difficulty={mission.difficulty} />
          <span className="rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground/80">
            {practiced ? 'AI practice done' : `${mission.minutes} min`}
          </span>
        </div>

        <Link
          href={isAi ? `/practice?mission=${mission.id}` : `/missions/${mission.id}/complete`}
          className={cta(isAi ? 'primary' : 'real', 'mt-5')}
        >
          Continue Your Journey
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href={`/missions/${mission.id}`}
          className="mx-auto mt-3 flex w-fit rounded-full px-2 py-1 text-xs font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          View mission details
        </Link>
      </div>
    </section>
  )
}
