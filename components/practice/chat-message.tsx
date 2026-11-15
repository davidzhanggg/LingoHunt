import { Lightbulb, Volume2 } from 'lucide-react'
import type { Rating } from '@/lib/data'
import { cn } from '@/lib/utils'

export type ChatItem = {
  id: number
  kind: 'ai' | 'user' | 'feedback'
  text: string
  rating?: Rating
  tip?: string
}

const RATINGS: Record<Rating, { label: string; className: string }> = {
  great: { label: 'Strong reply', className: 'bg-secondary text-secondary-foreground' },
  good: { label: 'Good start', className: 'bg-xp-soft text-xp' },
  basic: { label: 'Keep building', className: 'bg-real-soft text-real-ink' },
}

export function ChatMessage({
  item,
  personaName,
  onListen,
}: {
  item: ChatItem
  personaName: string
  onListen?: () => void
}) {
  if (item.kind === 'feedback') {
    const rating = RATINGS[item.rating ?? 'good']
    return (
      <div className="rounded-2xl border border-dashed border-input p-3 duration-300 animate-in fade-in slide-in-from-bottom-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Demo feedback
          </span>
          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', rating.className)}>
            {rating.label}
          </span>
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed">{item.text}</p>
        {item.tip && (
          <p className="mt-1.5 flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
            <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-xp" aria-hidden="true" />
            <span>
              <span className="font-semibold text-foreground">Speaking tip: </span>
              {item.tip}
            </span>
          </p>
        )}
      </div>
    )
  }

  const isUser = item.kind === 'user'

  return (
    <div
      className={cn(
        'flex flex-col duration-300 animate-in fade-in slide-in-from-bottom-1',
        isUser ? 'items-end' : 'items-start',
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-3xl px-4 py-3',
          isUser
            ? 'rounded-br-lg bg-accent text-accent-foreground'
            : 'rounded-bl-lg border border-border/70 bg-card',
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {isUser ? 'You' : personaName}
        </p>
        <p className="mt-0.5 text-sm font-medium leading-relaxed">{item.text}</p>
      </div>
      {!isUser && onListen && (
        <button
          type="button"
          onClick={onListen}
          className="ml-1 mt-1 inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold text-primary outline-none transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <Volume2 className="size-3.5" aria-hidden="true" />
          Listen
        </button>
      )}
    </div>
  )
}

export function TypingIndicator({ personaName }: { personaName: string }) {
  return (
    <div
      role="status"
      aria-label={`${personaName} is typing`}
      className="flex w-fit items-center gap-1.5 rounded-3xl rounded-bl-lg border border-border/70 bg-card px-4 py-4 duration-200 animate-in fade-in"
    >
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
    </div>
  )
}
