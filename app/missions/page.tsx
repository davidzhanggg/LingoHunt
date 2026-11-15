import type { Metadata } from 'next'
import { MissionsScreen } from '@/components/missions/missions-screen'

export const metadata: Metadata = { title: 'Missions' }

export default function Page() {
  return <MissionsScreen />
}
