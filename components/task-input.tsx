"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface TaskInputProps {
  onSubmit: (input: string) => void
}

export default function TaskInput({ onSubmit }: TaskInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input.trim())
      setInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Enter a task or ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 shadow-md"
        />
        <Button type="submit" size="icon" className="shadow-md">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

