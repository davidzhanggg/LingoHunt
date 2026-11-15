import Link from 'next/link'
import { Lock } from 'lucide-react'
import { cta } from '@/components/cta'
import { ScreenBody, ScreenFooter, ScreenHeader } from '@/components/screen'
import { getLevel, type Mission } from '@/lib/data'

export function LockedNotice({ mission, xp }: { mission: Mission; xp: number }) {
  const level = getLevel(mission.levelId)

  return (
    <>
      <ScreenHeader title={mission.title} subtitle="Locked mission" backHref="/missions" />
      <ScreenBody className="flex flex-col items-center justify-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Lock className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Locked for now.</h1>
        <p className="mt-2 max-w-[28ch] text-pretty text-sm leading-relaxed text-muted-foreground">
          Reach Level {level.id} · {level.name} at {level.xpRequired} XP to unlock this mission. You
          need {Math.max(0, level.xpRequired - xp)} more XP.
        </p>
      </ScreenBody>
      <ScreenFooter>
        <Link href="/roadmap" className={cta('primary')}>
          See your roadmap
        </Link>
        <Link href="/missions" className={cta('outline')}>
          Back to missions
        </Link>
      </ScreenFooter>
    </>
  )
}
