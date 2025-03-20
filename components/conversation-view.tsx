"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, CornerDownLeft, ArrowLeft, Edit2, Copy, ThumbsUp, RotateCcw, Check, MessageSquare } from "lucide-react"
import type { Conversation, Message, TodoItem, CalendarEvent } from "@/lib/types"
import { detectTopic } from "@/lib/topic-detector"

interface ConversationViewProps {
  conversation: Conversation
  onClose: () => void
  onContinue: (message: string) => void
  allConversations: Conversation[]
  onConversationSelect: (id: string) => void
  onUpdateConversation: (updatedConversation: Conversation) => void
  onRegenerateResponse: (conversationId: string, messageIndex: number) => void
}

export default function ConversationView({
  conversation,
  onClose,
  onContinue,
  allConversations,
  onConversationSelect,
  onUpdateConversation,
  onRegenerateResponse,
}: ConversationViewProps) {
  const [showHistory, setShowHistory] = useState(false)
  const [todoItems, setTodoItems] = useState<TodoItem[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [upvotedMessages, setUpvotedMessages] = useState<string[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Parse todo items and calendar events from messages
  useEffect(() => {
    // Extract todo items
    const extractedTodoItems: TodoItem[] = []
    const extractedEvents: CalendarEvent[] = []

    conversation.messages.forEach((message) => {
      if (message.role === "assistant") {
        // Extract todo items
        const todoRegex = /- \[([ x])\] (.*?)$/gm
        let match
        while ((match = todoRegex.exec(message.content)) !== null) {
          extractedTodoItems.push({
            id: `${message.id}-${extractedTodoItems.length}`,
            text: match[2],
            completed: match[1] === "x",
            messageId: message.id,
          })
        }

        // Extract calendar events
        const eventRegex = /## Event: (.*?)\nDate: (.*?)\nTime: (.*?)(?:\nLocation: (.*?))?(?:\nDescription: (.*?))?$/gm
        while ((match = eventRegex.exec(message.content)) !== null) {
          extractedEvents.push({
            id: `${message.id}-${extractedEvents.length}`,
            title: match[1],
            date: match[2],
            time: match[3],
            location: match[4] || "",
            description: match[5] || "",
            messageId: message.id,
          })
        }
      }
    })

    setTodoItems(extractedTodoItems)
    setCalendarEvents(extractedEvents)
  }, [conversation.messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [conversation.messages, editingMessageId])

  const toggleTodoItem = (itemId: string) => {
    setTodoItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
    )
  }

  const handleEditMessage = (message: Message) => {
    setEditingMessageId(message.id)
    setEditedContent(message.content)
  }

  const handleSaveEdit = () => {
    if (!editingMessageId) return

    // Find the index of the message being edited
    const messageIndex = conversation.messages.findIndex((msg) => msg.id === editingMessageId)
    if (messageIndex === -1) return

    // Create a copy of the messages array
    const updatedMessages = [...conversation.messages]

    // Update the message content
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: editedContent,
    }

    // If this is the first user message, update the conversation title
    if (messageIndex === 0 && updatedMessages[0].role === "user") {
      const { topic, emoji } = detectTopic(editedContent)
      const newTitle = `${emoji} ${topic}`

      // Update the conversation with new title and messages
      const updatedConversation = {
        ...conversation,
        title: newTitle,
        messages: updatedMessages,
        lastUpdated: new Date().toISOString(),
      }

      onUpdateConversation(updatedConversation)
    } else {
      // Just update the messages
      const updatedConversation = {
        ...conversation,
        messages: updatedMessages,
        lastUpdated: new Date().toISOString(),
      }

      onUpdateConversation(updatedConversation)

      // If we edited a user message, regenerate the AI response
      if (updatedMessages[messageIndex].role === "user" && messageIndex < updatedMessages.length - 1) {
        onRegenerateResponse(conversation.id, messageIndex)
      }
    }

    // Exit edit mode
    setEditingMessageId(null)
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        // Could show a toast notification here
        console.log("Message copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy message: ", err)
      })
  }

  const handleUpvoteMessage = (messageId: string) => {
    if (upvotedMessages.includes(messageId)) {
      // Remove upvote
      setUpvotedMessages(upvotedMessages.filter((id) => id !== messageId))
    } else {
      // Add upvote
      setUpvotedMessages([...upvotedMessages, messageId])
    }
  }

  const handleRetryMessage = (messageIndex: number) => {
    onRegenerateResponse(conversation.id, messageIndex)
  }

  // Function to render message content with interactive elements
  const renderMessageContent = (message: Message) => {
    // If we're editing this message, show the edit input instead
    if (editingMessageId === message.id) {
      return (
        <div className="flex flex-col gap-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[100px] text-gray-800"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button size="sm" variant="default" onClick={handleSaveEdit}>
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      )
    }

    // For normal display
    if (message.role === "user") {
      return <p className="whitespace-pre-wrap text-base">{message.content}</p>
    }

    // For assistant messages, render with interactive elements
    let content = message.content

    // Replace todo items with interactive checkboxes
    todoItems.forEach((item) => {
      if (item.messageId === message.id) {
        const checkboxPattern = `- \\[[ x]\\] ${item.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
        const checkboxRegex = new RegExp(checkboxPattern, "g")
        content = content.replace(
          checkboxRegex,
          `<div class="todo-item" data-id="${item.id}">
            <input type="checkbox" ${item.completed ? "checked" : ""} class="todo-checkbox mr-2" />
            <span class="${item.completed ? "line-through text-gray-500" : ""}">${item.text}</span>
          </div>`,
        )
      }
    })

    // Replace calendar events with formatted display
    calendarEvents.forEach((event) => {
      if (event.messageId === message.id) {
        const eventPattern = `## Event: ${event.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\nDate: ${event.date.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\nTime: ${event.time.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\nLocation: ${event.location ? event.location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : ".*?"})?(?:\\nDescription: ${event.description ? event.description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : ".*?"})?`
        const eventRegex = new RegExp(eventPattern, "s")
        content = content.replace(
          eventRegex,
          `<div class="calendar-event bg-blue-50 p-3 rounded-md border border-blue-200 my-2">
            <div class="font-bold text-blue-700">${event.title}</div>
            <div class="text-sm">
              <span class="font-medium">Date:</span> ${event.date} • <span class="font-medium">Time:</span> ${event.time}
            </div>
            ${event.location ? `<div class="text-sm"><span class="font-medium">Location:</span> ${event.location}</div>` : ""}
            ${event.description ? `<div class="text-sm mt-1">${event.description}</div>` : ""}
          </div>`,
        )
      }
    })

    // Handle markdown-like formatting
    content = content
      // Headers
      .replace(/^# (.*?)$/gm, '<h1 class="text-xl font-bold mt-3 mb-2">$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold mt-2 mb-2">$2</h2>')
      .replace(/^### (.*?)$/gm, '<h3 class="text-md font-bold mt-2 mb-1">$1</h3>')
      // Lists (that aren't todo items)
      .replace(/^- ([^[].*?)$/gm, '<li class="ml-5 list-disc">$1</li>')
      .replace(/^(\d+)\. (.*?)$/gm, '<li class="ml-5 list-decimal">$2</li>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Paragraphs (add spacing between paragraphs)
      .replace(/\n\n/g, '</p><p class="my-2">')

    return (
      <div
        className="whitespace-pre-wrap text-base prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
        onClick={(e) => {
          // Handle checkbox clicks
          const target = e.target as HTMLElement
          if (target.classList.contains("todo-checkbox")) {
            const todoItem = target.closest(".todo-item") as HTMLElement
            if (todoItem) {
              const itemId = todoItem.dataset.id
              if (itemId) toggleTodoItem(itemId)
            }
          }
        }}
      />
    )
  }

  // Function to render message actions
  const renderMessageActions = (message: Message, index: number) => {
    if (message.role === "user") {
      return (
        <div className="flex gap-1 mt-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
            onClick={() => handleEditMessage(message)}
            title="Edit message"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
            onClick={() => handleCopyMessage(message.content)}
            title="Copy message"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
            onClick={() => handleRetryMessage(index)}
            title="Regenerate response"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      )
    } else {
      // For assistant messages
      return (
        <div className="flex gap-1 mt-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
            onClick={() => handleCopyMessage(message.content)}
            title="Copy message"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant={upvotedMessages.includes(message.id) ? "default" : "ghost"}
            size="icon"
            className={`h-6 w-6 rounded-full ${upvotedMessages.includes(message.id) ? "bg-green-500 text-white" : "opacity-70 hover:opacity-100"}`}
            onClick={() => handleUpvoteMessage(message.id)}
            title="Upvote message"
          >
            <ThumbsUp className="h-3 w-3" />
          </Button>
        </div>
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                className="text-gray-500"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-xl font-bold">{conversation.title}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          {showHistory ? (
            // Conversation history view
            <ScrollArea className="h-[60vh]">
              <div className="p-4">
                <h3 className="font-bold text-lg mb-3">Recent Conversations</h3>
                <div className="space-y-2">
                  {allConversations
                    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                    .map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                          conv.id === conversation.id ? "bg-gray-100 border-l-4 border-primary" : ""
                        }`}
                        onClick={() => {
                          onConversationSelect(conv.id)
                          setShowHistory(false)
                        }}
                      >
                        <div className="font-medium">{conv.title}</div>
                        <div className="text-xs text-gray-500">{new Date(conv.lastUpdated).toLocaleString()}</div>
                      </div>
                    ))}
                </div>
              </div>
            </ScrollArea>
          ) : (
            // Current conversation view
            <ScrollArea className="h-[60vh]" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {conversation.messages.map((message, index) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {renderMessageContent(message)}
                      <div className="flex items-center justify-between text-xs opacity-70 mt-2">
                        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                        {renderMessageActions(message, index)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Enhanced continue conversation section */}
          <div className="p-4 border-t">
            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                className="w-full flex items-center justify-center gap-2 py-6 bg-primary hover:bg-primary/90"
                onClick={() => onContinue("")}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Continue this conversation</span>
              </Button>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-1"
                  onClick={() => onContinue("Modify this list")}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  <span className="text-sm">Modify this list</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-1"
                  onClick={() => onContinue("Tell me more about this")}
                >
                  <CornerDownLeft className="h-4 w-4 mr-1" />
                  <span className="text-sm">Tell me more</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

