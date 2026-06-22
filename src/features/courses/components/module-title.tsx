"use client"

import { useRef, useState } from "react"
import { Input } from "@/shared/ui/input"

interface Props {
  title: string
  topicCount: number
  onChange: (title: string) => void
}

export function ModuleTitle({ title, topicCount, onChange }: Props) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-1">
      {editing ? (
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => { if (e.key === "Enter") setEditing(false) }}
          className="h-auto px-0 text-4xl font-heading font-medium text-foreground border-0 border-b border-transparent focus-visible:border-input focus-visible:ring-0 rounded-none pb-1"
          autoFocus
          placeholder="Module title"
        />
      ) : (
        <h1
          className="cursor-text text-4xl font-heading font-medium text-foreground"
          onClick={() => {
            setEditing(true)
            setTimeout(() => inputRef.current?.focus(), 0)
          }}
        >
          {title || <span className="text-muted-foreground">Module title</span>}
        </h1>
      )}
      <p className="text-sm text-muted-foreground">
        {topicCount} topic{topicCount !== 1 ? "s" : ""}
      </p>
    </div>
  )
}
