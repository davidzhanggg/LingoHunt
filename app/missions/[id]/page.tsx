import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MissionDetailsScreen } from '@/components/missions/mission-details-screen'
import { getMission } from '@/lib/data'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: getMission(id)?.title ?? 'Mission' }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  if (!getMission(id)) notFound()
  return <MissionDetailsScreen missionId={id} />
}
