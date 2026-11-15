import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-muted', className)} />
}

export function ScreenSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-0 flex-1 flex-col gap-4 px-5 pt-[max(1.25rem,env(safe-area-inset-top))]"
    >
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-44 rounded-3xl" />
      <Skeleton className="h-20 rounded-3xl" />
    </div>
  )
}
