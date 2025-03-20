"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface InputSuggestionsProps {
  inputValue: string
  onSuggestionClick: (suggestion: string) => void
}

export default function InputSuggestions({ inputValue, onSuggestionClick }: InputSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    // Show suggestions even with just 1 character
    if (!inputValue) {
      setSuggestions([])
      return
    }

    const lowerInput = inputValue.toLowerCase()
    const newSuggestions: string[] = []

    // Create suggestions - show immediately when typing "c" or "create"
    if (lowerInput.startsWith("c") || lowerInput.startsWith("create") || lowerInput.startsWith("make")) {
      newSuggestions.push(
        "Create a to-do list for today",
        "Create a shopping list with milk, eggs, and bread",
        "Create a work task list",
        "Create a calendar event for tomorrow",
      )
    }

    // Show suggestions
    else if (lowerInput.startsWith("s") || lowerInput.startsWith("show") || lowerInput.startsWith("view")) {
      newSuggestions.push("Show my to-do list", "Show my calendar events", "Show productivity tips")
    }

    // Modify suggestions
    else if (lowerInput.startsWith("m") || lowerInput.startsWith("modify") || lowerInput.startsWith("change")) {
      newSuggestions.push("Modify my to-do list", "Change the last item on my list", "Update my calendar event")
    }

    // Delete suggestions
    else if (lowerInput.startsWith("d") || lowerInput.startsWith("delete") || lowerInput.startsWith("remove")) {
      newSuggestions.push("Delete the last item from my list", "Remove completed tasks", "Delete my calendar event")
    }

    // Help suggestions
    else if (lowerInput.startsWith("h") || lowerInput.startsWith("help") || lowerInput.startsWith("how")) {
      newSuggestions.push("Help me be more productive", "How can I improve my focus?", "How to manage my time better")
    }

    // Add suggestions
    else if (lowerInput.startsWith("a") || lowerInput.startsWith("add")) {
      newSuggestions.push(
        "Add milk to my shopping list",
        "Add a meeting to my calendar",
        "Add a new task to my to-do list",
      )
    }

    // Filter suggestions based on input, but be more lenient
    const filteredSuggestions = newSuggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(lowerInput) || suggestion.toLowerCase().startsWith(lowerInput.charAt(0)),
    )

    setSuggestions(filteredSuggestions.slice(0, 4)) // Limit to 4 suggestions
  }, [inputValue])

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="ghost"
          className="w-full justify-start text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}

