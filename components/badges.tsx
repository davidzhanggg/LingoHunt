import { Zap } from 'lucide-react'
import type { Difficulty } from '@/lib/data'
import { cn } from '@/lib/utils'

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Beginner: 'bg-secondary text-secondary-foreground',
  Intermediate: 'bg-real-soft text-real-ink',
  Advanced: 'bg-foreground text-background',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        DIFFICULTY_STYLES[difficulty],
      )}
    >
      {difficulty}
    </span>
  )
}

export function XpChip({
  children,
  solid = false,
  className,
}: {
  children: React.ReactNode
  solid?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        solid ? 'bg-xp text-xp-foreground' : 'bg-xp-soft text-xp',
        className,
      )}
    >
      <Zap className="size-3" aria-hidden="true" />
      {children}
    </span>
  )
}
