'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { resetProgress } from '@/lib/progress'

export function ResetProgress() {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="mx-auto flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Reset demo progress
      </button>
    )
  }

  return (
    <div
      role="group"
      aria-label="Confirm reset"
      className="rounded-2xl border border-border bg-card p-4 text-center duration-200 animate-in fade-in zoom-in-95"
    >
      <p className="text-sm font-semibold">Reset demo progress?</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        XP, streak and completed missions go back to the sample starting point.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="h-10 rounded-xl border border-border bg-card text-sm font-semibold outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            resetProgress()
            setConfirming(false)
          }}
          className="h-10 rounded-xl bg-foreground text-sm font-semibold text-background outline-none transition-colors hover:bg-foreground/90 focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
