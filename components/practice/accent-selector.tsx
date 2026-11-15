'use client'

import { ACCENTS, type AccentId } from '@/lib/data'
import { setAccent } from '@/lib/progress'
import { cn } from '@/lib/utils'

export function AccentSelector({ value }: { value: AccentId }) {
  return (
    <div
      role="group"
      aria-label="Accent"
      className="no-scrollbar flex shrink-0 gap-1.5 overflow-x-auto px-5 pb-2 pt-0.5"
    >
      {ACCENTS.map((accent) => {
        const active = accent.id === value
        return (
          <button
            key={accent.id}
            type="button"
            aria-pressed={active}
            onClick={() => setAccent(accent.id)}
            className={cn(
              'h-8 shrink-0 rounded-full border px-3 text-xs font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40',
              active
                ? 'border-primary bg-secondary text-secondary-foreground'
                : 'border-border bg-card text-muted-foreground hover:bg-muted',
            )}
          >
            {accent.label}
          </button>
        )
      })}
    </div>
  )
}
