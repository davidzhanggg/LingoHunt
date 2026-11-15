import {
  Coffee,
  Hand,
  MapPin,
  Receipt,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import type { MissionIconKey } from '@/lib/data'

const ICONS: Record<MissionIconKey, LucideIcon> = {
  hand: Hand,
  coffee: Coffee,
  'map-pin': MapPin,
  'shopping-bag': ShoppingBag,
  utensils: UtensilsCrossed,
  receipt: Receipt,
}

export function MissionIcon({ icon, className }: { icon: MissionIconKey; className?: string }) {
  const Icon = ICONS[icon]
  return <Icon className={className} aria-hidden="true" />
}
