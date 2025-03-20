// Map of topics to their corresponding emojis
export const topicEmojis: Record<string, string> = {
  todo: "📝",
  task: "✅",
  list: "📋",
  shopping: "🛒",
  grocery: "🥑",
  work: "💼",
  study: "📚",
  calendar: "📅",
  event: "🗓️",
  meeting: "👥",
  appointment: "🕒",
  schedule: "⏰",
  goal: "🎯",
  objective: "🏆",
  productivity: "⚡",
  focus: "🧠",
  time: "⏱️",
  management: "📊",
  health: "💪",
  fitness: "🏃",
  meditation: "🧘",
  mindfulness: "🌿",
  habit: "🔄",
  routine: "🔁",
  project: "📋",
  idea: "💡",
  brainstorm: "🌪️",
  creativity: "🎨",
  motivation: "🔥",
  inspiration: "✨",
  default: "🤖",
}

// Function to detect the main topic from user input
export function detectTopic(input: string): { topic: string; emoji: string } {
  const lowerInput = input.toLowerCase()

  // Check for to-do list related topics
  if (
    lowerInput.includes("todo list") ||
    lowerInput.includes("to do list") ||
    lowerInput.includes("task list") ||
    (lowerInput.includes("list") && lowerInput.includes("create"))
  ) {
    return { topic: "To-do List", emoji: topicEmojis.todo }
  }

  // Check for specific list types
  if (lowerInput.includes("shopping list")) {
    return { topic: "Shopping List", emoji: topicEmojis.shopping }
  }

  if (lowerInput.includes("grocery list")) {
    return { topic: "Grocery List", emoji: topicEmojis.grocery }
  }

  if (lowerInput.includes("work list")) {
    return { topic: "Work List", emoji: topicEmojis.work }
  }

  if (lowerInput.includes("study list")) {
    return { topic: "Study List", emoji: topicEmojis.study }
  }

  // Check for calendar/event related topics
  if (
    (lowerInput.includes("calendar") ||
      lowerInput.includes("event") ||
      lowerInput.includes("meeting") ||
      lowerInput.includes("appointment")) &&
    (lowerInput.includes("add") || lowerInput.includes("create") || lowerInput.includes("schedule"))
  ) {
    return { topic: "Calendar Event", emoji: topicEmojis.calendar }
  }

  // Check for goal setting
  if (lowerInput.includes("goal") || lowerInput.includes("objective") || lowerInput.includes("target")) {
    return { topic: "Goal Setting", emoji: topicEmojis.goal }
  }

  // Check for productivity
  if (lowerInput.includes("productive") || lowerInput.includes("productivity")) {
    return { topic: "Productivity", emoji: topicEmojis.productivity }
  }

  // Check for focus
  if (lowerInput.includes("focus") || lowerInput.includes("concentrate") || lowerInput.includes("attention")) {
    return { topic: "Focus", emoji: topicEmojis.focus }
  }

  // Check for time management
  if (lowerInput.includes("time management") || (lowerInput.includes("time") && lowerInput.includes("manage"))) {
    return { topic: "Time Management", emoji: topicEmojis.time }
  }

  // Check for health and wellness
  if (
    lowerInput.includes("health") ||
    lowerInput.includes("wellness") ||
    lowerInput.includes("fitness") ||
    lowerInput.includes("exercise")
  ) {
    return { topic: "Health & Wellness", emoji: topicEmojis.health }
  }

  // Check for meditation/mindfulness
  if (
    lowerInput.includes("meditation") ||
    lowerInput.includes("mindfulness") ||
    lowerInput.includes("relax") ||
    lowerInput.includes("calm")
  ) {
    return { topic: "Mindfulness", emoji: topicEmojis.mindfulness }
  }

  // Check for habits/routines
  if (
    lowerInput.includes("habit") ||
    lowerInput.includes("routine") ||
    lowerInput.includes("daily") ||
    lowerInput.includes("regular")
  ) {
    return { topic: "Habits & Routines", emoji: topicEmojis.habit }
  }

  // Check for project management
  if (lowerInput.includes("project") || (lowerInput.includes("manage") && lowerInput.includes("project"))) {
    return { topic: "Project Management", emoji: topicEmojis.project }
  }

  // Check for ideas/creativity
  if (
    lowerInput.includes("idea") ||
    lowerInput.includes("creative") ||
    lowerInput.includes("brainstorm") ||
    lowerInput.includes("inspiration")
  ) {
    return { topic: "Ideas & Creativity", emoji: topicEmojis.idea }
  }

  // Check for motivation
  if (
    lowerInput.includes("motivate") ||
    lowerInput.includes("motivation") ||
    lowerInput.includes("inspire") ||
    lowerInput.includes("inspiration")
  ) {
    return { topic: "Motivation", emoji: topicEmojis.motivation }
  }

  // Extract main topic from the first sentence
  const firstSentence = input.split(/[.!?]/, 1)[0].trim()

  // Try to extract a meaningful topic from the first 3-5 words
  const words = firstSentence.split(" ")
  let topic = ""

  if (words.length <= 3) {
    topic = firstSentence
  } else {
    // Try to find a noun phrase or meaningful segment
    const importantWords = words.filter(
      (word) =>
        word.length > 3 &&
        !["what", "when", "where", "why", "how", "the", "and", "for", "with"].includes(word.toLowerCase()),
    )

    if (importantWords.length > 0) {
      // Use the first important word and a few surrounding words
      const mainWordIndex = words.findIndex((word) => word === importantWords[0])
      const startIndex = Math.max(0, mainWordIndex - 1)
      const endIndex = Math.min(words.length, mainWordIndex + 3)

      topic = words.slice(startIndex, endIndex).join(" ")
    } else {
      // Fallback to first few words
      topic = words.slice(0, Math.min(4, words.length)).join(" ")
    }
  }

  if (topic.length > 25) {
    topic = topic.substring(0, 25) + "..."
  }

  // Find the most appropriate emoji
  const topicWords = topic.toLowerCase().split(/\s+/)
  for (const word of topicWords) {
    if (word.length > 3 && topicEmojis[word]) {
      return { topic, emoji: topicEmojis[word] }
    }
  }

  return { topic, emoji: topicEmojis.default }
}

// Function to get emoji for a specific topic
export function getEmojiForTopic(topic: string): string {
  const lowerTopic = topic.toLowerCase()

  for (const [key, emoji] of Object.entries(topicEmojis)) {
    if (lowerTopic.includes(key)) {
      return emoji
    }
  }

  return topicEmojis.default
}

