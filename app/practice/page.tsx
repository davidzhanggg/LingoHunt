import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PracticeScreen } from '@/components/practice/practice-screen'
import { getMission } from '@/lib/data'

type Props = { searchParams: Promise<{ mission?: string | string[] }> }

export const metadata: Metadata = { title: 'AI practice' }

export default async function Page({ searchParams }: Props) {
  const { mission } = await searchParams
  const missionId = typeof mission === 'string' ? mission : undefined
  if (missionId && !getMission(missionId)) notFound()
  return <PracticeScreen missionId={missionId} />
}
