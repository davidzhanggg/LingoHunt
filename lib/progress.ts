'use client'

import { useSyncExternalStore } from 'react'
import { ACCENTS, getMission, type AccentId } from './data'
import { DEFAULT_PROGRESS, getLevelInfo, getRecommended, getXp, type Progress } from './journey'

const STORAGE_KEY = 'lingohunt.progress.v1'

export type ActivityResult = {
  xpBefore: number
  xpAfter: number
  xpGained: number
  streak: number
  streakIncreased: boolean
}

let cached: Progress | null = null
const listeners = new Set<() => void>()

function missionIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const ids = value.filter((id): id is string => typeof id === 'string' && Boolean(getMission(id)))
  return Array.from(new Set(ids))
}

function sanitize(value: unknown): Progress {
  if (!value || typeof value !== 'object') return DEFAULT_PROGRESS
  const stored = value as Partial<Progress>
  return {
    completed: missionIds(stored.completed) ?? DEFAULT_PROGRESS.completed,
    practiced: missionIds(stored.practiced) ?? DEFAULT_PROGRESS.practiced,
    streak:
      typeof stored.streak === 'number' && stored.streak >= 0
        ? Math.floor(stored.streak)
        : DEFAULT_PROGRESS.streak,
    lastActiveDay: typeof stored.lastActiveDay === 'string' ? stored.lastActiveDay : null,
    accent: ACCENTS.some((accent) => accent.id === stored.accent)
      ? (stored.accent as AccentId)
      : DEFAULT_PROGRESS.accent,
  }
}

function read(): Progress {
  if (cached) return cached
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    cached = raw ? sanitize(JSON.parse(raw)) : DEFAULT_PROGRESS
  } catch {
    cached = DEFAULT_PROGRESS
  }
  return cached
}

function write(next: Progress) {
  cached = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage can be unavailable (private mode); progress then lasts for the session only.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return
    cached = null
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

const subscribeNever = () => () => {}

function withActivity(progress: Progress): Progress {
  const today = new Date().toLocaleDateString('en-CA')
  if (progress.lastActiveDay === today) return progress
  return { ...progress, streak: progress.streak + 1, lastActiveDay: today }
}

function record(update: (progress: Progress) => Progress): ActivityResult {
  const before = read()
  const after = withActivity(update(before))
  write(after)
  const xpBefore = getXp(before)
  const xpAfter = getXp(after)
  return {
    xpBefore,
    xpAfter,
    xpGained: xpAfter - xpBefore,
    streak: after.streak,
    streakIncreased: after.streak > before.streak,
  }
}

export function completePractice(missionId: string): ActivityResult {
  return record((progress) =>
    progress.practiced.includes(missionId)
      ? progress
      : { ...progress, practiced: [...progress.practiced, missionId] },
  )
}

export function completeMission(missionId: string): ActivityResult {
  return record((progress) =>
    progress.completed.includes(missionId)
      ? progress
      : { ...progress, completed: [...progress.completed, missionId] },
  )
}

export function setAccent(accent: AccentId) {
  write({ ...read(), accent })
}

export function resetProgress() {
  write(DEFAULT_PROGRESS)
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  )
}

export function useJourney() {
  const progress = useSyncExternalStore(subscribe, read, () => DEFAULT_PROGRESS)
  const hydrated = useHydrated()
  const xp = getXp(progress)
  return {
    progress,
    hydrated,
    xp,
    level: getLevelInfo(xp),
    recommended: getRecommended(progress),
  }
}
