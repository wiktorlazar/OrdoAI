"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

interface ConversationBubbleProps {
  title: string
  isActive: boolean
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}

export default function ConversationBubble({ title, isActive, onClick, onDelete }: ConversationBubbleProps) {
  // Extract emoji if present at the beginning of the title
  const hasEmoji = /^\p{Emoji}/u.test(title)
  const emoji = hasEmoji ? title.match(/^\p{Emoji}/u)?.[0] : null
  const displayTitle = hasEmoji ? title.replace(/^\p{Emoji}\s*/u, "") : title

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <Button
        onClick={onClick}
        variant={isActive ? "default" : "outline"}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md ${
          isActive ? "bg-primary text-primary-foreground" : "bg-background"
        } min-w-[180px] justify-start`}
      >
        {emoji ? (
          <span className="text-xl flex-shrink-0">{emoji}</span>
        ) : (
          <MessageCircle className="h-5 w-5 flex-shrink-0" />
        )}
        <span className="font-medium truncate">{displayTitle}</span>
      </Button>

      {/* Delete button */}
      <Button
        variant="destructive"
        size="icon"
        className="h-6 w-6 absolute -right-2 -top-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <X className="h-3 w-3" />
      </Button>
    </motion.div>
  )
}

