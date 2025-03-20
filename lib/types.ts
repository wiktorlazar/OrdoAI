export interface Task {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  lastUpdated: string
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  messageId: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  messageId: string
}

