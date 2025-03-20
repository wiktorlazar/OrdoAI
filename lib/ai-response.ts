import type { Message, Conversation } from "./types"
import { searchKnowledge } from "./knowledge-base"
import { isModifyingTodoList, modifyTodoList } from "./context-manager"

// Enhanced AI response generator with simulated internet search
export async function generateAIResponse(
  userInput: string,
  conversationHistory: Message[],
  conversation: Conversation,
): Promise<string> {
  // Convert input to lowercase for easier matching
  const input = userInput.toLowerCase()

  // Check if the user is trying to modify a to-do list
  if (isModifyingTodoList(userInput, conversation)) {
    return modifyTodoList(userInput, conversation)
  }

  // Search knowledge base for relevant information
  const knowledgeResults = searchKnowledge(userInput, 2)

  // Calendar event creation
  if (
    (input.includes("calendar") ||
      input.includes("event") ||
      input.includes("schedule") ||
      input.includes("appointment")) &&
    (input.includes("add") || input.includes("create") || input.includes("new"))
  ) {
    return generateCalendarEvent(userInput)
  }

  // To-do list creation
  if (
    (input.includes("to do list") ||
      input.includes("todo list") ||
      input.includes("shopping list") ||
      (input.includes("list") && (input.includes("make") || input.includes("create")))) &&
    (input.includes("for") || input.includes("of") || input.includes("with"))
  ) {
    return generateToDoList(userInput)
  }

  // Task management related responses
  if (
    input.includes("todo") ||
    input.includes("task") ||
    input.includes("list") ||
    (input.includes("add") && (input.includes("item") || input.includes("task")))
  ) {
    return generateTaskResponse(input, knowledgeResults)
  }

  // Productivity related responses
  if (
    input.includes("productive") ||
    input.includes("productivity") ||
    input.includes("focus") ||
    input.includes("efficient") ||
    input.includes("time management")
  ) {
    return generateProductivityResponse(input, knowledgeResults)
  }

  // Goal setting related responses
  if (input.includes("goal") || input.includes("objective") || input.includes("target") || input.includes("achieve")) {
    return generateGoalResponse(input, knowledgeResults)
  }

  // Greeting or introduction
  if (
    input.includes("hello") ||
    input.includes("hi") ||
    input.includes("hey") ||
    input.includes("who are you") ||
    input.includes("what can you do")
  ) {
    return generateGreetingResponse()
  }

  // Default response for unrecognized inputs
  return generateDefaultResponse(input, knowledgeResults)
}

// New function to generate calendar events
function generateCalendarEvent(input: string): string {
  // Try to extract event details
  let title = "New Event"
  let date = new Date().toLocaleDateString()
  let time = "12:00 PM"
  let location = ""
  let description = ""

  // Extract title
  const titlePatterns = [
    /(?:add|create|schedule|new)\s+(?:an\s+)?(?:event|appointment|meeting)\s+(?:called|titled|named|for|about)?\s+"([^"]+)"/i,
    /(?:add|create|schedule|new)\s+(?:an\s+)?(?:event|appointment|meeting)\s+(?:called|titled|named|for|about)?\s+([^"]+?)(?:\s+on|\s+at|\s+for|\s+with|\s+in|$)/i,
  ]

  for (const pattern of titlePatterns) {
    const match = input.match(pattern)
    if (match && match[1]) {
      title = match[1].trim()
      break
    }
  }

  // Extract date
  const datePatterns = [
    /(?:on|for)\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?/i,
    /(?:on|for)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)(?:,?\s+(\d{4}))?/i,
    /(?:on|for)\s+(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/i,
    /(?:on|for)\s+(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
  ]

  for (const pattern of datePatterns) {
    const match = input.match(pattern)
    if (match) {
      if (match[0].toLowerCase().includes("tomorrow")) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        date = tomorrow.toLocaleDateString()
      } else if (match[0].toLowerCase().includes("today")) {
        date = new Date().toLocaleDateString()
      } else if (match[0].toLowerCase().match(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/i)) {
        const today = new Date()
        const dayOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(
          match[1].toLowerCase(),
        )
        const daysToAdd = (dayOfWeek + 7 - today.getDay()) % 7 || 7 // If today, then next week
        const targetDate = new Date()
        targetDate.setDate(today.getDate() + daysToAdd)
        date = targetDate.toLocaleDateString()
      } else if (match[1] && match[2]) {
        // Handle month name formats
        if (isNaN(Number.parseInt(match[1]))) {
          // Format: Month Day, Year
          const month =
            [
              "january",
              "february",
              "march",
              "april",
              "may",
              "june",
              "july",
              "august",
              "september",
              "october",
              "november",
              "december",
            ].indexOf(match[1].toLowerCase()) + 1
          const day = Number.parseInt(match[2])
          const year = match[3] ? Number.parseInt(match[3]) : new Date().getFullYear()
          date = `${month}/${day}/${year}`
        } else {
          // Format: MM/DD/YYYY
          const month = Number.parseInt(match[1])
          const day = Number.parseInt(match[2])
          const year = match[3] ? Number.parseInt(match[3]) : new Date().getFullYear()
          date = `${month}/${day}/${year}`
        }
      }
      break
    }
  }

  // Extract time
  const timePatterns = [
    /(?:at|from)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i,
    /(?:at|from)\s+(\d{1,2})(?::(\d{2}))?(?:\s*(am|pm))?/i,
  ]

  for (const pattern of timePatterns) {
    const match = input.match(pattern)
    if (match && match[1]) {
      const hour = Number.parseInt(match[1])
      const minute = match[2] ? match[2] : "00"
      const period = match[3] ? match[3].toLowerCase() : hour < 12 ? "am" : "pm"
      time = `${hour}:${minute} ${period}`
      break
    }
  }

  // Extract location
  const locationPatterns = [
    /(?:at|in|location)\s+([^,.]+?)(?:,|\.|on|at|$)/i,
    /(?:location|place|venue)(?:\s+is|\s*:)?\s+([^,.]+?)(?:,|\.|on|at|$)/i,
  ]

  for (const pattern of locationPatterns) {
    const match = input.match(pattern)
    if (match && match[1] && !match[1].match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)/i)) {
      location = match[1].trim()
      break
    }
  }

  // Extract description
  const descriptionPatterns = [
    /(?:description|about|details|notes)(?:\s+is|\s*:)?\s+([^,.]+?)(?:,|\.|on|at|$)/i,
    /(?:for|about)\s+([^,.]+?)(?:,|\.|on|at|$)/i,
  ]

  for (const pattern of descriptionPatterns) {
    const match = input.match(pattern)
    if (match && match[1] && !match[1].match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)/i) && match[1].length > 5) {
      description = match[1].trim()
      break
    }
  }

  // Format the response
  let response = `I've created a calendar event for you:\n\n`

  response += `## Event: ${title}\n`
  response += `Date: ${date}\n`
  response += `Time: ${time}\n`

  if (location) {
    response += `Location: ${location}\n`
  }

  if (description) {
    response += `Description: ${description}\n`
  }

  response += `\nThe event has been added to your calendar. You can view it by clicking on the event above.`

  return response
}

// Function to generate to-do lists
function generateToDoList(input: string): string {
  // Try to extract the list type/category
  let listType = "To-Do"

  if (input.toLowerCase().includes("shopping list")) {
    listType = "Shopping"
  } else if (input.toLowerCase().includes("grocery list")) {
    listType = "Grocery"
  } else if (input.toLowerCase().includes("work list")) {
    listType = "Work"
  } else if (input.toLowerCase().includes("study list")) {
    listType = "Study"
  }

  // Try to extract items from the input
  const items: string[] = []

  // Look for patterns like "create a list with X, Y, and Z"
  const withPattern = /(?:with|of|for|:)\s+(.*?)(?:$|\.)/i
  const withMatch = input.match(withPattern)

  if (withMatch && withMatch[1]) {
    // Split by commas and "and"
    const itemText = withMatch[1].replace(/\s+and\s+/g, ", ")
    const extractedItems = itemText.split(/,\s*/).filter((item) => item.trim().length > 0)
    items.push(...extractedItems)
  }

  // If no items were found using the pattern, try to extract any nouns or phrases that might be list items
  if (items.length === 0) {
    // Simple extraction based on common list item indicators
    const lines = input.split(/[.,;]/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.length > 2 && !trimmed.toLowerCase().includes("list") && !trimmed.toLowerCase().includes("create")) {
        items.push(trimmed)
      }
    }
  }

  // If we still don't have items, generate some based on the list type
  if (items.length === 0) {
    if (listType === "Shopping") {
      items.push("Milk", "Bread", "Eggs", "Fruits", "Vegetables")
    } else if (listType === "Grocery") {
      items.push("Apples", "Pasta", "Chicken", "Rice", "Tomatoes")
    } else if (listType === "Work") {
      items.push("Finish report", "Reply to emails", "Schedule meeting", "Update presentation")
    } else if (listType === "Study") {
      items.push("Read chapter 5", "Complete assignment", "Review notes", "Prepare for quiz")
    } else {
      items.push("Task 1", "Task 2", "Task 3", "Task 4", "Task 5")
    }
  }

  // Format the response
  let response = `# ${listType} List\n\n`

  // Add items with checkboxes
  items.forEach((item, index) => {
    response += `- [ ] ${item}\n`
  })

  response +=
    "\nYou can mark items as complete by clicking the checkbox. You can also add more items by saying 'add [item] to my list'."

  return response
}

function generateTaskResponse(input: string, knowledgeResults: any[]): string {
  let response = ""

  if (input.includes("create") || input.includes("make") || input.includes("add")) {
    response =
      "I can help you create a task list! Here's how to get started:\n\n" +
      "1. Decide on the most important tasks you need to complete\n" +
      "2. Break down large tasks into smaller, manageable steps\n" +
      "3. Prioritize your tasks based on urgency and importance\n" +
      "4. Set realistic deadlines for each task\n\n"
  } else if (input.includes("manage") || input.includes("organize")) {
    response =
      "Managing your tasks effectively is key to productivity. Here are some tips:\n\n" +
      "• Use the 1-3-5 rule: plan to accomplish 1 big thing, 3 medium things, and 5 small things each day\n" +
      "• Try time-blocking your calendar for focused work on specific tasks\n" +
      "• Review and adjust your task list at the end of each day\n" +
      "• Consider using the Eisenhower Matrix to categorize tasks by urgency and importance\n\n"
  } else {
    response =
      "Task management is essential for staying organized and productive. Some effective methods include:\n\n" +
      "• Creating a master list of all tasks, then breaking them down by project\n" +
      "• Using the GTD (Getting Things Done) method to capture, clarify, organize, reflect, and engage\n" +
      "• Setting up a Kanban board with 'To Do', 'In Progress', and 'Done' columns\n" +
      "• Scheduling regular reviews of your task system\n\n"
  }

  // Add knowledge base information if available
  if (knowledgeResults.length > 0) {
    response += "**Research findings:**\n\n"

    knowledgeResults.forEach((result) => {
      response += `According to ${result.source}: "${result.content}"\n\n`
    })
  }

  response += "What specific aspect of task management would you like help with?"

  return response
}

function generateProductivityResponse(input: string, knowledgeResults: any[]): string {
  let response = ""

  if (input.includes("improve") || input.includes("increase") || input.includes("boost")) {
    response =
      "To improve your productivity, try these evidence-based strategies:\n\n" +
      "1. Use the Pomodoro Technique: work for 25 minutes, then take a 5-minute break\n" +
      "2. Eliminate distractions by turning off notifications during focused work\n" +
      "3. Practice single-tasking instead of multitasking\n" +
      "4. Start your day by completing your most important task first\n" +
      "5. Take regular breaks to maintain energy and focus throughout the day\n\n"
  } else if (input.includes("focus") || input.includes("concentrate") || input.includes("distraction")) {
    response =
      "Improving focus in our distraction-filled world can be challenging. Here are some techniques that can help:\n\n" +
      "• Create a dedicated workspace free from distractions\n" +
      "• Use website blockers during focused work sessions\n" +
      "• Practice mindfulness meditation to train your attention muscle\n" +
      "• Use noise-cancelling headphones or background white noise\n" +
      "• Schedule specific times to check email and messages rather than responding immediately\n\n"
  } else {
    response =
      "Becoming more productive is about working smarter, not harder. Consider these approaches:\n\n" +
      "• Identify your peak energy hours and schedule your most demanding work during those times\n" +
      "• Use the 2-minute rule: if something takes less than 2 minutes, do it immediately\n" +
      "• Batch similar tasks together to reduce context switching\n" +
      "• Take care of your physical health through sleep, exercise, and nutrition\n" +
      "• Regularly reflect on your productivity system and make adjustments as needed\n\n"
  }

  // Add knowledge base information if available
  if (knowledgeResults.length > 0) {
    response += "**Latest Research Findings:**\n\n"

    knowledgeResults.forEach((result) => {
      const dateInfo = result.date ? ` (${result.date})` : ""
      response += `According to ${result.source}${dateInfo}: "${result.content}"\n\n`
    })
  }

  return response
}

function generateGoalResponse(input: string, knowledgeResults: any[]): string {
  let response = ""

  if (input.includes("set") || input.includes("create")) {
    response =
      "Setting effective goals is crucial for success. Try using the SMART framework:\n\n" +
      "• Specific: Clearly define what you want to accomplish\n" +
      "• Measurable: Include concrete criteria to measure progress\n" +
      "• Achievable: Make sure the goal is realistic given your resources\n" +
      "• Relevant: Align with your broader objectives and values\n" +
      "• Time-bound: Set a deadline to create urgency and focus\n\n"
  } else if (input.includes("achieve") || input.includes("accomplish")) {
    response =
      "To achieve your goals more effectively:\n\n" +
      "1. Break them down into smaller, manageable milestones\n" +
      "2. Create a specific action plan with next steps\n" +
      "3. Build in accountability through sharing goals or finding an accountability partner\n" +
      "4. Track your progress regularly and celebrate small wins\n" +
      "5. Anticipate obstacles and plan how you'll overcome them\n\n"
  } else {
    response =
      "Goal setting is powerful because it provides direction and purpose. For best results:\n\n" +
      "• Focus on a few important goals rather than many\n" +
      "• Write your goals down and review them regularly\n" +
      "• Connect your goals to your deeper values and purpose\n" +
      "• Balance short-term and long-term goals\n" +
      "• Be willing to adjust your approach if something isn't working\n\n"
  }

  // Add knowledge base information if available
  if (knowledgeResults.length > 0) {
    response += "**Research findings:**\n\n"

    knowledgeResults.forEach((result) => {
      response += `According to ${result.source}: "${result.content}"\n\n`
    })
  }

  return response
}

function generateGreetingResponse(): string {
  return (
    "Hello! I'm Ordo AI, your productivity assistant. I can help you with:\n\n" +
    "• Task and to-do list management\n" +
    "• Productivity tips and techniques\n" +
    "• Goal setting and achievement strategies\n" +
    "• Time management advice\n" +
    "• Focus and concentration improvement\n\n" +
    "What would you like assistance with today?"
  )
}

// Update the generateDefaultResponse function to include more citations and real-time information
function generateDefaultResponse(input: string, knowledgeResults: any[]): string {
  let response = "I understand you're asking about \"" + input + '".\n\n'

  // Add knowledge base information if available
  if (knowledgeResults.length > 0) {
    response += "Here's what I found from reliable sources:\n\n"

    knowledgeResults.forEach((result) => {
      const dateInfo = result.date ? ` (${result.date})` : ""
      const urlInfo = result.url ? `\nSource: ${result.url}` : ""

      response += `According to ${result.source}${dateInfo}: "${result.content}"${urlInfo}\n\n`
    })

    response += "Is there a specific aspect of this topic you'd like to explore further?\n\n"
  } else {
    response +=
      "I've searched for information on this topic, but I don't have specific data in my knowledge base. As your productivity assistant, I can help with task management, productivity techniques, goal setting, and time management.\n\n"

    response +=
      "Would you like me to provide some general guidance on this topic, or would you prefer to ask about something more specific?\n\n"
  }

  return response
}

