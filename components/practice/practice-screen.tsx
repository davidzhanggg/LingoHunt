'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Bot, Footprints, Info, RotateCcw, Send } from 'lucide-react'
import { XpChip } from '@/components/badges'
import { cta } from '@/components/cta'
import { LockedNotice } from '@/components/locked-notice'
import { AccentSelector } from '@/components/practice/accent-selector'
import { ChatMessage, TypingIndicator, type ChatItem } from '@/components/practice/chat-message'
import { ScreenBody, ScreenFooter, ScreenHeader } from '@/components/screen'
import { ScreenSkeleton } from '@/components/skeleton'
import {
  DEFAULT_PRACTICE_MISSION_ID,
  getAccent,
  getClosingLine,
  getMission,
  resolveLine,
  type Mission,
  type PracticeOption,
  type Rating,
} from '@/lib/data'
import { evaluateReply, isUnlocked } from '@/lib/journey'
import { completePractice, useJourney } from '@/lib/progress'

type Phase = 'intro' | 'chat' | 'summary'

const subscribeNever = () => () => {}

function useSpeechSupported() {
  return useSyncExternalStore(
    subscribeNever,
    () => 'speechSynthesis' in window,
    () => false,
  )
}

function speak(text: string, lang: string) {
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  const voice = synth
    .getVoices()
    .find((candidate) => candidate.lang.replace('_', '-').toLowerCase() === lang.toLowerCase())
  if (voice) utterance.voice = voice
  synth.speak(utterance)
}

export function PracticeScreen({ missionId }: { missionId?: string }) {
  const { hydrated, xp, recommended } = useJourney()

  if (!hydrated) return <ScreenSkeleton />

  const mission =
    (missionId ? getMission(missionId) : undefined) ??
    recommended ??
    getMission(DEFAULT_PRACTICE_MISSION_ID)

  if (!mission) return null
  if (!isUnlocked(mission, xp)) return <LockedNotice mission={mission} xp={xp} />

  return <PracticeSession key={mission.id} mission={mission} />
}

function PracticeSession({ mission }: { mission: Mission }) {
  const { progress } = useJourney()
  const accent = progress.accent
  const speechSupported = useSpeechSupported()
  const persona = mission.persona
  const turns = mission.practice

  const [phase, setPhase] = useState<Phase>('intro')
  const [items, setItems] = useState<ChatItem[]>([])
  const [turnIndex, setTurnIndex] = useState(0)
  const [typing, setTyping] = useState(false)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [xpGained, setXpGained] = useState(0)
  const [draft, setDraft] = useState('')

  const timers = useRef<number[]>([])
  const nextId = useRef(0)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer))
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [items.length, typing, phase])

  function later(callback: () => void, delay: number) {
    timers.current.push(window.setTimeout(callback, delay))
  }

  function push(item: Omit<ChatItem, 'id'>) {
    const id = ++nextId.current
    setItems((previous) => [...previous, { ...item, id }])
  }

  function start() {
    setPhase('chat')
    setTyping(true)
    later(() => {
      push({ kind: 'ai', text: resolveLine(turns[0].ai, accent) })
      setTyping(false)
    }, 900)
  }

  function reply(text: string, option?: PracticeOption) {
    const clean = text.trim()
    if (!clean || typing || phase !== 'chat') return

    const turn = turns[turnIndex]
    const result = option ?? evaluateReply(clean, turn)
    const isLast = turnIndex === turns.length - 1

    push({ kind: 'user', text: clean })
    push({ kind: 'feedback', text: result.feedback, rating: result.rating, tip: turn.tip })
    setRatings((previous) => [...previous, result.rating])
    setDraft('')
    setTyping(true)

    later(() => {
      if (isLast) {
        push({ kind: 'ai', text: getClosingLine(mission, accent) })
        setXpGained(completePractice(mission.id).xpGained)
        setPhase('summary')
      } else {
        push({ kind: 'ai', text: resolveLine(turns[turnIndex + 1].ai, accent) })
        setTurnIndex(turnIndex + 1)
      }
      setTyping(false)
    }, 1200)
  }

  function restart() {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current.length = 0
    setItems([])
    setRatings([])
    setTurnIndex(0)
    setTyping(false)
    setDraft('')
    setPhase('intro')
  }

  const strongReplies = ratings.filter((rating) => rating === 'great').length
  const currentTurn = turns[turnIndex]
  const suggestions = currentTurn.options.map(
    (_, index) => currentTurn.options[(index + turnIndex + 1) % currentTurn.options.length],
  )
  const completed = progress.completed.includes(mission.id)

  return (
    <>
      <ScreenHeader
        title={mission.title}
        subtitle={
          phase === 'chat'
            ? `Turn ${turnIndex + 1} of ${turns.length} · ${currentTurn.goal}`
            : `AI practice · ${persona.name}, ${persona.role}`
        }
        backHref={`/missions/${mission.id}`}
        action={
          <Link
            href="/missions"
            className="flex h-8 shrink-0 items-center rounded-full bg-secondary px-3 text-xs font-semibold text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            Change
          </Link>
        }
      />

      <AccentSelector value={accent} />

      <ScreenBody className="space-y-3">
        {phase === 'intro' ? (
          <>
            <div className="flex flex-col items-center pt-3 text-center">
              <span
                aria-hidden="true"
                className="flex size-20 items-center justify-center rounded-full bg-secondary text-3xl font-bold text-primary"
              >
                {persona.name.charAt(0)}
              </span>
              <h1 className="mt-4 text-2xl font-bold tracking-tight">
                {persona.name} · AI {persona.role}
              </h1>
              <p className="mt-1.5 max-w-[30ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                {mission.summary}
              </p>
            </div>

            <section className="rounded-3xl border border-border/70 bg-card p-4">
              <h2 className="text-sm font-semibold">In this conversation</h2>
              <ol className="mt-3 space-y-2.5">
                {turns.map((turn, index) => (
                  <li key={turn.goal} className="flex items-center gap-3 text-sm leading-snug">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-secondary-foreground">
                      {index + 1}
                    </span>
                    {turn.goal}
                  </li>
                ))}
              </ol>
            </section>

            <p className="flex gap-2 rounded-2xl bg-accent p-3.5 text-xs leading-relaxed text-accent-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-xp" aria-hidden="true" />
              <span>
                <span className="font-semibold">Demo mode: </span>
                {persona.name}&apos;s replies are scripted and feedback is simulated, not real speech
                analysis. The accent changes word choices and the read-aloud voice your device offers.
              </span>
            </p>
          </>
        ) : (
          <>
            <div aria-live="polite" className="space-y-3">
              {items.map((item) => (
                <ChatMessage
                  key={item.id}
                  item={item}
                  personaName={persona.name}
                  onListen={
                    speechSupported && item.kind === 'ai'
                      ? () => speak(item.text, getAccent(accent).lang)
                      : undefined
                  }
                />
              ))}
            </div>
            {typing && <TypingIndicator personaName={persona.name} />}

            {phase === 'summary' && (
              <section className="rounded-3xl bg-secondary p-5 duration-500 animate-in fade-in zoom-in-95">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground">
                    Practice complete
                  </p>
                  <XpChip solid={xpGained > 0} className={xpGained > 0 ? undefined : 'bg-card'}>
                    {xpGained > 0 ? `+${xpGained} XP` : 'XP already earned'}
                  </XpChip>
                </div>
                <p className="mt-2 text-4xl font-bold tracking-tight text-primary">
                  {strongReplies} of {turns.length}
                </p>
                <p className="text-sm font-medium text-secondary-foreground">strong replies</p>

                <h2 className="mt-4 text-sm font-semibold">Phrases to take with you</h2>
                <ul className="mt-2 space-y-2">
                  {turns.map((turn) => (
                    <li
                      key={turn.goal}
                      className="rounded-2xl bg-card px-3.5 py-2.5 text-[13px] font-medium leading-relaxed"
                    >
                      {'“'}
                      {turn.options[0].text}
                      {'”'}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-foreground/75">
                  Demo feedback: scores are simulated from a script, not real speech analysis.
                </p>
              </section>
            )}
            <div ref={endRef} />
          </>
        )}
      </ScreenBody>

      <ScreenFooter>
        {phase === 'intro' && (
          <button type="button" onClick={start} className={cta('primary')}>
            <Bot className="size-4" aria-hidden="true" />
            Start conversation
          </button>
        )}

        {phase === 'chat' && (
          <>
            <div role="group" aria-label="Sample responses" className="space-y-1.5">
              {suggestions.map((option) => (
                <button
                  key={option.text}
                  type="button"
                  disabled={typing}
                  onClick={() => reply(option.text, option)}
                  className="w-full rounded-2xl border border-border bg-card px-3.5 py-2.5 text-left text-[13px] font-medium leading-snug outline-none transition-all hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
                >
                  {option.text}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                reply(draft)
              }}
            >
              <label htmlFor="practice-reply" className="sr-only">
                Type your own reply
              </label>
              <input
                id="practice-reply"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault()
                }}
                placeholder="Or type your own reply"
                autoComplete="off"
                enterKeyHint="send"
                className="h-12 min-w-0 flex-1 rounded-2xl border border-input bg-card px-4 text-base outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/30"
              />
              <button
                type="submit"
                aria-label="Send reply"
                disabled={typing || !draft.trim()}
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
              >
                <Send className="size-4" aria-hidden="true" />
              </button>
            </form>
          </>
        )}

        {phase === 'summary' && (
          <>
            {completed ? (
              <Link href="/roadmap" className={cta('primary')}>
                See your roadmap
              </Link>
            ) : (
              <Link href={`/missions/${mission.id}/complete`} className={cta('real')}>
                <Footprints className="size-4" aria-hidden="true" />
                Start Real-World Mission
              </Link>
            )}
            <button type="button" onClick={restart} className={cta('outline')}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Practice again
            </button>
          </>
        )}
      </ScreenFooter>
    </>
  )
}
