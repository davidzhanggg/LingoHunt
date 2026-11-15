import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export function ProgressBar({
  value,
  from,
  label,
  className,
}: {
  value: number
  from?: number
  label: string
  className?: string
}) {
  const percent = Math.min(100, Math.max(0, value))
  const style =
    from === undefined
      ? { width: `${percent}%` }
      : ({ width: `${percent}%`, '--bar-from': `${from}%`, '--bar-to': `${percent}%` } as CSSProperties)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className={cn('h-2.5 w-full overflow-hidden rounded-full bg-xp-soft', className)}
    >
      <div
        className={cn(
          'h-full rounded-full bg-xp transition-[width] duration-700 ease-out',
          from !== undefined && 'bar-animate',
        )}
        style={style}
      />
    </div>
  )
}
