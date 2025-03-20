import type { Task } from "./types"

type CommandResult = {
  action: "show" | "add" | "complete" | "delete" | "unknown"
  task?: string
  taskId?: number
}

export function processCommand(input: string, tasks: Task[]): CommandResult {
  const lowerInput = input.toLowerCase()

  // Show task list
  if (
    lowerInput.includes("show") ||
    lowerInput.includes("list") ||
    lowerInput.includes("tasks") ||
    lowerInput.includes("what") ||
    lowerInput.includes("display") ||
    lowerInput.includes("see")
  ) {
    if (
      lowerInput.includes("task") ||
      lowerInput.includes("todo") ||
      lowerInput.includes("to do") ||
      lowerInput.includes("list")
    ) {
      return { action: "show" }
    }
  }

  // Add task
  if (
    lowerInput.includes("add") ||
    lowerInput.includes("create") ||
    lowerInput.includes("new") ||
    lowerInput.startsWith("i need to")
  ) {
    let task = input

    // Extract the actual task text
    if (lowerInput.startsWith("add ")) {
      task = input.substring(4)
    } else if (lowerInput.startsWith("create ")) {
      task = input.substring(7)
    } else if (lowerInput.startsWith("new ")) {
      task = input.substring(4)
    } else if (lowerInput.startsWith("i need to ")) {
      task = input.substring(10)
    }

    return { action: "add", task }
  }

  // Complete task
  if (lowerInput.includes("complete") || lowerInput.includes("done") || lowerInput.includes("finish")) {
    // Try to find the task by matching text
    for (const task of tasks) {
      if (!task.completed && task.text.toLowerCase().includes(lowerInput.replace(/complete|done|finish/g, "").trim())) {
        return { action: "complete", taskId: task.id }
      }
    }
  }

  // Delete task
  if (lowerInput.includes("delete") || lowerInput.includes("remove") || lowerInput.includes("cancel")) {
    // Try to find the task by matching text
    for (const task of tasks) {
      if (task.text.toLowerCase().includes(lowerInput.replace(/delete|remove|cancel/g, "").trim())) {
        return { action: "delete", taskId: task.id }
      }
    }
  }

  // If the input doesn't match any command pattern, assume it's a new task
  return { action: "add", task: input }
}

