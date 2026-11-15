import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RealWorldScreen } from '@/components/real-world/real-world-screen'
import { getMission } from '@/lib/data'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Real-world mission' }

export default async function Page({ params }: Props) {
  const { id } = await params
  if (!getMission(id)) notFound()
  return <RealWorldScreen missionId={id} />
}
