"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"
import type { Task } from "@/lib/types"

interface TaskListProps {
  tasks: Task[]
  onComplete: (id: number) => void
  onDelete: (id: number) => void
  onAdd: (text: string) => void
}

export default function TaskList({ tasks, onComplete, onDelete, onAdd }: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState("")

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      onAdd(newTaskText.trim())
      setNewTaskText("")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
    >
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Your Tasks</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => document.body.click()}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
            <Input
              placeholder="Add a new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No tasks yet. Add one above!</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => !task.completed && onComplete(task.id)}
                      disabled={task.completed}
                    />
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.text}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

