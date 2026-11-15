import {
  BASE_XP,
  LEVELS,
  MISSIONS,
  PRACTICE_XP,
  getLevel,
  getMission,
  type AccentId,
  type Level,
  type Mission,
  type PracticeTurn,
  type Rating,
} from './data'

export type Progress = {
  completed: string[]
  practiced: string[]
  streak: number
  lastActiveDay: string | null
  accent: AccentId
}

export const DEFAULT_PROGRESS: Progress = {
  completed: ['introduce-yourself'],
  practiced: ['introduce-yourself'],
  streak: 4,
  lastActiveDay: null,
  accent: 'american',
}

export type LevelInfo = {
  current: Level
  next: Level | null
  percent: number
  toNext: number
}

export type MissionStatus = 'locked' | 'available' | 'practiced' | 'completed'

export function getXp(progress: Progress): number {
  const missionXp = progress.completed.reduce((total, id) => total + (getMission(id)?.xp ?? 0), 0)
  return BASE_XP + missionXp + progress.practiced.length * PRACTICE_XP
}

export function getLevelInfo(xp: number): LevelInfo {
  let index = 0
  LEVELS.forEach((level, i) => {
    if (xp >= level.xpRequired) index = i
  })
  const current = LEVELS[index]
  const next = LEVELS[index + 1] ?? null
  if (!next) return { current, next, percent: 100, toNext: 0 }
  const span = next.xpRequired - current.xpRequired
  const percent = Math.min(100, Math.max(0, ((xp - current.xpRequired) / span) * 100))
  return { current, next, percent, toNext: next.xpRequired - xp }
}

export function isUnlocked(mission: Mission, xp: number): boolean {
  return xp >= getLevel(mission.levelId).xpRequired
}

export function getStatus(mission: Mission, progress: Progress, xp: number): MissionStatus {
  if (progress.completed.includes(mission.id)) return 'completed'
  if (!isUnlocked(mission, xp)) return 'locked'
  if (progress.practiced.includes(mission.id)) return 'practiced'
  return 'available'
}

export function getRecommended(progress: Progress): Mission | null {
  const xp = getXp(progress)
  return (
    MISSIONS.find((mission) => isUnlocked(mission, xp) && !progress.completed.includes(mission.id)) ?? null
  )
}

export function evaluateReply(text: string, turn: PracticeTurn): { rating: Rating; feedback: string } {
  const reply = text.toLowerCase()
  const hits = turn.keywords.filter((keyword) => reply.includes(keyword)).length
  const polite = /(please|could|thank|excuse|sorry|may i|would)/.test(reply)
  const words = reply.trim().split(/\s+/).length

  if (hits >= 2 && polite && words >= 4) {
    return { rating: 'great', feedback: 'Clear and polite. You covered the goal for this turn.' }
  }
  if (hits >= 1 || (polite && words >= 4)) {
    return { rating: 'good', feedback: 'Good effort. Add a polite phrase or one more detail next time.' }
  }
  return { rating: 'basic', feedback: `Aim for the goal of this turn: ${turn.goal.toLowerCase()}.` }
}
