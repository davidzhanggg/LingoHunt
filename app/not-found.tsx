import Link from 'next/link'
import { cta } from '@/components/cta'
import { ScreenBody, ScreenFooter } from '@/components/screen'

export default function NotFound() {
  return (
    <>
      <ScreenBody className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold tracking-tight">We couldn&apos;t find that.</h1>
        <p className="mt-2 max-w-[28ch] text-pretty text-sm leading-relaxed text-muted-foreground">
          This mission or page doesn&apos;t exist in the demo.
        </p>
      </ScreenBody>
      <ScreenFooter>
        <Link href="/" className={cta('primary')}>
          Back to Home
        </Link>
      </ScreenFooter>
    </>
  )
}
