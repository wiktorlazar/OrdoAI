"use client"

import { Button } from "@/components/ui/button"
import { ListTodo, Target, Clock, Brain, Lightbulb, Calendar } from "lucide-react"

interface QuickActionButtonsProps {
  onActionClick: (action: string) => void
}

export default function QuickActionButtons({ onActionClick }: QuickActionButtonsProps) {
  const actions = [
    {
      text: "Create a to-do list",
      icon: <ListTodo className="h-5 w-5" />,
      color: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    },
    {
      text: "Add calendar event",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-emerald-100 hover:bg-emerald-200 text-emerald-700",
    },
    {
      text: "Set a goal",
      icon: <Target className="h-5 w-5" />,
      color: "bg-green-100 hover:bg-green-200 text-green-700",
    },
    {
      text: "Time management tips",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-purple-100 hover:bg-purple-200 text-purple-700",
    },
    {
      text: "Improve focus",
      icon: <Brain className="h-5 w-5" />,
      color: "bg-amber-100 hover:bg-amber-200 text-amber-700",
    },
    {
      text: "Productivity ideas",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "bg-rose-100 hover:bg-rose-200 text-rose-700",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className={`h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 rounded-xl shadow-sm border-2 border-transparent ${action.color}`}
          onClick={() => onActionClick(action.text)}
        >
          {action.icon}
          <span className="text-sm font-medium text-center">{action.text}</span>
        </Button>
      ))}
    </div>
  )
}

