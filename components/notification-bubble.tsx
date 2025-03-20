"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ListTodo } from "lucide-react"

interface NotificationBubbleProps {
  title: string
  onClick: () => void
}

export default function NotificationBubble({ title, onClick }: NotificationBubbleProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-4 left-4 z-50">
      <Button onClick={onClick} variant="default" className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg">
        <ListTodo className="h-4 w-4" />
        <span>{title}</span>
      </Button>
    </motion.div>
  )
}

