"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import ConversationBubble from "@/components/conversation-bubble"
import ConversationView from "@/components/conversation-view"
import QuickActionButtons from "@/components/quick-action-buttons"
import InputSuggestions from "@/components/input-suggestions"
import { generateAIResponse } from "@/lib/ai-response"
import { detectTopic } from "@/lib/topic-detector"
import type { Conversation, Message } from "@/lib/types"

export default function Home() {
  const [input, setInput] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations")
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations))
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations))
  }, [conversations])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    await createOrUpdateConversation(input)
    setInput("")
  }

  const createOrUpdateConversation = async (userInput: string) => {
    setIsGenerating(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      role: "user",
      timestamp: new Date().toISOString(),
    }

    // Create a new conversation or add to existing one
    if (activeConversationId) {
      // Add to existing conversation
      const updatedConversations = conversations.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage],
            lastUpdated: new Date().toISOString(),
          }
        }
        return conv
      })
      setConversations(updatedConversations)

      // Get the active conversation
      const activeConversation = updatedConversations.find((c) => c.id === activeConversationId)!

      // Generate AI response
      const aiResponse = await generateAIResponse(userInput, activeConversation.messages, activeConversation)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date().toISOString(),
      }

      // Add AI response to conversation
      const finalConversations = updatedConversations.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, aiMessage],
            lastUpdated: new Date().toISOString(),
          }
        }
        return conv
      })
      setConversations(finalConversations)
    } else {
      // Create new conversation
      const newConversationId = Date.now().toString()
      const { topic, emoji } = detectTopic(userInput)
      const title = `${emoji} ${topic}`

      // Create a new conversation with just the user message
      const newConversation: Conversation = {
        id: newConversationId,
        title,
        messages: [userMessage],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }

      // Generate AI response
      const aiResponse = await generateAIResponse(userInput, [userMessage], newConversation)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date().toISOString(),
      }

      // Update the conversation with the AI response
      newConversation.messages.push(aiMessage)
      newConversation.lastUpdated = new Date().toISOString()

      setConversations([...conversations, newConversation])
      setActiveConversationId(newConversationId)
    }

    setIsGenerating(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    // Optional: Auto-submit the suggestion
    setTimeout(() => {
      createOrUpdateConversation(suggestion)
    }, 100)
  }

  const handleBubbleClick = (conversationId: string) => {
    setActiveConversationId(conversationId)
  }

  const handleCloseConversation = () => {
    setActiveConversationId(null)
  }

  const handleContinueConversation = (message: string) => {
    setInput(message)
  }

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent bubble click
    setConversations(conversations.filter((conv) => conv.id !== conversationId))
    if (activeConversationId === conversationId) {
      setActiveConversationId(null)
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    // Auto-submit the quick action
    setTimeout(() => {
      createOrUpdateConversation(action)
    }, 100)
  }

  const handleUpdateConversation = (updatedConversation: Conversation) => {
    setConversations(conversations.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv)))
  }

  const handleRegenerateResponse = async (conversationId: string, messageIndex: number) => {
    if (isGenerating) return
    setIsGenerating(true)

    // Find the conversation
    const conversation = conversations.find((conv) => conv.id === conversationId)
    if (!conversation) {
      setIsGenerating(false)
      return
    }

    // Get the user message that we want to regenerate a response for
    const userMessage = conversation.messages[messageIndex]
    if (!userMessage || userMessage.role !== "user") {
      setIsGenerating(false)
      return
    }

    // Get all messages up to and including this user message
    const messagesUpToUser = conversation.messages.slice(0, messageIndex + 1)

    // Generate a new AI response
    const aiResponse = await generateAIResponse(userMessage.content, messagesUpToUser, {
      ...conversation,
      messages: messagesUpToUser,
    })

    // Create the new AI message
    const newAiMessage: Message = {
      id: Date.now().toString(),
      content: aiResponse,
      role: "assistant",
      timestamp: new Date().toISOString(),
    }

    // Create updated messages array - keep messages up to user message, add new AI response
    const updatedMessages = [...messagesUpToUser, newAiMessage]

    // If there were more messages after, remove them (they're now invalid in the conversation flow)

    // Update the conversation
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      lastUpdated: new Date().toISOString(),
    }

    // Update conversations state
    setConversations(conversations.map((conv) => (conv.id === conversationId ? updatedConversation : conv)))

    setIsGenerating(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 relative">
      {/* Left side conversation bubbles */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 space-y-3 z-10">
        {conversations.map((conversation) => (
          <ConversationBubble
            key={conversation.id}
            title={conversation.title}
            isActive={conversation.id === activeConversationId}
            onClick={() => handleBubbleClick(conversation.id)}
            onDelete={(e) => handleDeleteConversation(conversation.id, e)}
          />
        ))}
      </div>

      {/* Central input */}
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Ordo AI</h1>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center gap-2 relative">
            <Input
              type="text"
              placeholder="Ask me anything or tell me what to do..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 shadow-md"
              disabled={isGenerating}
            />
            <Button type="submit" size="icon" className="shadow-md" disabled={isGenerating}>
              <Send className="h-4 w-4" />
            </Button>
            <InputSuggestions inputValue={input} onSuggestionClick={handleSuggestionClick} />
          </div>
        </form>

        {/* Quick action buttons */}
        <div className="mt-6">
          <QuickActionButtons onActionClick={handleQuickAction} />
        </div>
      </div>

      {/* Active conversation view */}
      {activeConversationId && (
        <ConversationView
          conversation={conversations.find((c) => c.id === activeConversationId)!}
          onClose={handleCloseConversation}
          onContinue={handleContinueConversation}
          allConversations={conversations}
          onConversationSelect={handleBubbleClick}
          onUpdateConversation={handleUpdateConversation}
          onRegenerateResponse={handleRegenerateResponse}
        />
      )}
    </main>
  )
}

