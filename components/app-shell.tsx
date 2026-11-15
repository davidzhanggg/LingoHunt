import { BottomNav } from '@/components/bottom-nav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh justify-center overflow-hidden bg-background sm:items-center sm:bg-muted sm:p-6">
      <div className="flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-background sm:max-h-[880px] sm:rounded-[2.75rem] sm:border-2 sm:border-foreground/70 sm:shadow-2xl">
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
        <BottomNav />
      </div>
    </div>
  )
}
