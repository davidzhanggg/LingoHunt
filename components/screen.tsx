import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScreenHeader({
  title,
  subtitle,
  backHref,
  action,
}: {
  title: string
  subtitle?: string
  backHref?: string
  action?: React.ReactNode
}) {
  return (
    <header className="flex shrink-0 items-center gap-1.5 px-4 pb-2 pt-[max(0.875rem,env(safe-area-inset-top))]">
      {backHref && (
        <Link
          href={backHref}
          aria-label="Go back"
          className="-ml-1.5 flex size-10 shrink-0 items-center justify-center rounded-full outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
      )}
      <div className={cn('min-w-0 flex-1', !backHref && 'pl-1')}>
        <p className="truncate text-[15px] font-semibold leading-tight">{title}</p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}

export function ScreenBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <main
      className={cn(
        'min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-1 duration-300 animate-in fade-in slide-in-from-bottom-2',
        className,
      )}
    >
      {children}
    </main>
  )
}

export function ScreenFooter({ children }: { children: React.ReactNode }) {
  return <div className="shrink-0 space-y-2.5 px-5 pb-3 pt-2">{children}</div>
}
