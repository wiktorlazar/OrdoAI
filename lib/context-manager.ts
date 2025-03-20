import type { Conversation, TodoItem } from "./types"

// Function to check if a message is asking to modify a previous to-do list
export function isModifyingTodoList(input: string, conversation: Conversation): boolean {
  const lowerInput = input.toLowerCase()

  // Check for modification keywords
  const modifyKeywords = [
    "modify",
    "change",
    "update",
    "edit",
    "revise",
    "add to",
    "remove from",
    "delete from",
    "add item",
    "remove item",
    "check off",
    "mark",
    "complete",
  ]

  const hasModifyKeyword = modifyKeywords.some((keyword) => lowerInput.includes(keyword))

  if (!hasModifyKeyword) {
    return false
  }

  // Check if there's a to-do list in the conversation
  const hasTodoList = conversation.messages.some((message) => {
    return (
      message.role === "assistant" &&
      (message.content.includes("# To-Do List") ||
        message.content.includes("# Shopping List") ||
        message.content.includes("# Work List") ||
        message.content.includes("# Study List") ||
        message.content.includes("- [ ]"))
    )
  })

  return hasTodoList
}

// Function to extract to-do items from a conversation
export function extractTodoItems(conversation: Conversation): TodoItem[] {
  const todoItems: TodoItem[] = []

  conversation.messages.forEach((message) => {
    if (message.role === "assistant") {
      // Extract todo items
      const todoRegex = /- \[([ x])\] (.*?)$/gm
      let match
      while ((match = todoRegex.exec(message.content)) !== null) {
        todoItems.push({
          id: `${message.id}-${todoItems.length}`,
          text: match[2],
          completed: match[1] === "x",
          messageId: message.id,
        })
      }
    }
  })

  return todoItems
}

// Function to modify a to-do list based on user input
export function modifyTodoList(input: string, conversation: Conversation): string {
  const lowerInput = input.toLowerCase()
  const todoItems = extractTodoItems(conversation)

  // Get the list type from the conversation
  let listType = "To-Do"
  conversation.messages.forEach((message) => {
    if (message.role === "assistant") {
      if (message.content.includes("# Shopping List")) {
        listType = "Shopping"
      } else if (message.content.includes("# Grocery List")) {
        listType = "Grocery"
      } else if (message.content.includes("# Work List")) {
        listType = "Work"
      } else if (message.content.includes("# Study List")) {
        listType = "Study"
      }
    }
  })

  // Handle adding items
  if (lowerInput.includes("add") && !lowerInput.includes("list")) {
    // Extract the item to add
    let itemToAdd = ""

    const addPatterns = [
      /add\s+(.*?)(?:to|on|in|into)\s+(?:the|my|this)?\s*(?:list|todo|to-do)/i,
      /add\s+(.*?)(?:$|\.)/i,
    ]

    for (const pattern of addPatterns) {
      const match = input.match(pattern)
      if (match && match[1]) {
        itemToAdd = match[1].trim()
        break
      }
    }

    if (itemToAdd) {
      // Add the new item to the list
      todoItems.push({
        id: `new-${Date.now()}`,
        text: itemToAdd,
        completed: false,
        messageId: "new",
      })

      return generateUpdatedTodoList(listType, todoItems, `I've added "${itemToAdd}" to your ${listType} List.`)
    }
  }

  // Handle removing items
  if (lowerInput.includes("remove") || lowerInput.includes("delete")) {
    // Extract the item to remove
    let itemToRemove = ""

    const removePatterns = [
      /(?:remove|delete)\s+(.*?)(?:from|on|in)\s+(?:the|my|this)?\s*(?:list|todo|to-do)/i,
      /(?:remove|delete)\s+(.*?)(?:$|\.)/i,
    ]

    for (const pattern of removePatterns) {
      const match = input.match(pattern)
      if (match && match[1]) {
        itemToRemove = match[1].trim()
        break
      }
    }

    if (itemToRemove) {
      // Find and remove the item
      const initialCount = todoItems.length
      const updatedItems = todoItems.filter((item) => !item.text.toLowerCase().includes(itemToRemove.toLowerCase()))

      if (updatedItems.length < initialCount) {
        return generateUpdatedTodoList(
          listType,
          updatedItems,
          `I've removed "${itemToRemove}" from your ${listType} List.`,
        )
      } else {
        return generateUpdatedTodoList(
          listType,
          todoItems,
          `I couldn't find "${itemToRemove}" in your ${listType} List. Here's your current list:`,
        )
      }
    }
  }

  // Handle marking items as complete
  if (
    lowerInput.includes("mark") ||
    lowerInput.includes("complete") ||
    lowerInput.includes("check") ||
    lowerInput.includes("done")
  ) {
    // Extract the item to mark
    let itemToMark = ""

    const markPatterns = [
      /(?:mark|complete|check|done)\s+(.*?)(?:as|off|on|in)\s+(?:complete|done|finished)/i,
      /(?:mark|complete|check|done)\s+(.*?)(?:$|\.)/i,
    ]

    for (const pattern of markPatterns) {
      const match = input.match(pattern)
      if (match && match[1]) {
        itemToMark = match[1].trim()
        break
      }
    }

    if (itemToMark) {
      // Find and mark the item as complete
      let itemFound = false
      const updatedItems = todoItems.map((item) => {
        if (item.text.toLowerCase().includes(itemToMark.toLowerCase()) && !item.completed) {
          itemFound = true
          return { ...item, completed: true }
        }
        return item
      })

      if (itemFound) {
        return generateUpdatedTodoList(
          listType,
          updatedItems,
          `I've marked "${itemToMark}" as complete in your ${listType} List.`,
        )
      } else {
        return generateUpdatedTodoList(
          listType,
          todoItems,
          `I couldn't find "${itemToMark}" or it's already completed. Here's your current list:`,
        )
      }
    }
  }

  // Handle clearing completed items
  if (lowerInput.includes("clear") && (lowerInput.includes("complete") || lowerInput.includes("done"))) {
    const updatedItems = todoItems.filter((item) => !item.completed)

    if (updatedItems.length < todoItems.length) {
      return generateUpdatedTodoList(
        listType,
        updatedItems,
        `I've cleared all completed items from your ${listType} List.`,
      )
    } else {
      return generateUpdatedTodoList(
        listType,
        todoItems,
        `There are no completed items to clear. Here's your current list:`,
      )
    }
  }

  // Default: just show the current list
  return generateUpdatedTodoList(listType, todoItems, `Here's your current ${listType} List:`)
}

// Helper function to generate an updated to-do list
function generateUpdatedTodoList(listType: string, items: TodoItem[], message: string): string {
  let response = `${message}\n\n# ${listType} List\n\n`

  // Add items with checkboxes
  items.forEach((item) => {
    response += `- [${item.completed ? "x" : " "}] ${item.text}\n`
  })

  if (items.length === 0) {
    response += "Your list is empty. You can add items by saying 'Add [item] to my list'.\n"
  } else {
    response += "\nYou can modify this list by saying things like:\n"
    response += "• 'Add [item] to my list'\n"
    response += "• 'Remove [item] from my list'\n"
    response += "• 'Mark [item] as complete'\n"
    response += "• 'Clear completed items'\n"
  }

  return response
}

