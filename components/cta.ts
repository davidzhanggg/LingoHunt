import { cn } from '@/lib/utils'

type Tone = 'primary' | 'real' | 'outline'

const TONES: Record<Tone, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  real: 'bg-real text-real-foreground hover:bg-real/90',
  outline: 'border border-border bg-card text-foreground hover:bg-muted',
}

export function cta(tone: Tone = 'primary', className?: string) {
  return cn(
    'inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    TONES[tone],
    className,
  )
}
