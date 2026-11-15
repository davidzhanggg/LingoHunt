'use client'

import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'

export function ProofUpload({ disabled }: { disabled?: boolean }) {
  const [proof, setProof] = useState<{ name: string; url: string } | null>(null)
  const urlRef = useRef<string | null>(null)

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    },
    [],
  )

  function release() {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    release()
    const url = URL.createObjectURL(file)
    urlRef.current = url
    setProof({ name: file.name, url })
  }

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Add proof</h2>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          Optional
        </span>
      </div>

      {proof ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-muted/60 p-2.5 duration-300 animate-in fade-in">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not optimizable */}
          <img
            src={proof.url}
            alt="Preview of your selected proof photo"
            className="size-14 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{proof.name}</p>
            <p className="text-xs text-muted-foreground">Attached on this device only</p>
          </div>
          <button
            type="button"
            aria-label="Remove proof photo"
            disabled={disabled}
            onClick={() => {
              release()
              setProof(null)
            }}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-card hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-50"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-input p-3.5 transition-colors hover:bg-muted/50 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/40">
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={disabled}
            onChange={onChange}
          />
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-real-soft text-real">
            <ImagePlus className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Upload a photo</span>
            <span className="block text-xs text-muted-foreground">A receipt or your drink works well</span>
          </span>
        </label>
      )}
    </section>
  )
}
