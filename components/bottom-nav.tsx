'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, MessagesSquare, Route, Target, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS: { href: string; label: string; icon: LucideIcon; prefix: string }[] = [
  { href: '/', label: 'Home', icon: House, prefix: '/' },
  { href: '/missions', label: 'Missions', icon: Target, prefix: '/missions' },
  { href: '/practice', label: 'Practice', icon: MessagesSquare, prefix: '/practice' },
  { href: '/roadmap', label: 'Roadmap', icon: Route, prefix: '/roadmap' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className="shrink-0 border-t border-border bg-card px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <ul className="grid grid-cols-4">
        {TABS.map(({ href, label, icon: Icon, prefix }) => {
          const active = prefix === '/' ? pathname === '/' : pathname.startsWith(prefix)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className="group flex flex-col items-center gap-1 rounded-xl py-0.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <span
                  className={cn(
                    'flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200',
                    active
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground group-hover:bg-muted',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    'text-[11px]',
                    active ? 'font-semibold text-primary' : 'font-medium text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
