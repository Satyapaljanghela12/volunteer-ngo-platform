"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const params = useParams()
  const otherUserId = params.userId as string

  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [otherUser, setOtherUser] = useState<any>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const loadChat = async () => {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setUser(authUser)

      if (authUser) {
        const { data: msgs } = await supabase
          .from("messages")
          .select("*, sender:sender_id(first_name, last_name), receiver:receiver_id(first_name, last_name)")
          .or(
            `and(sender_id.eq.${authUser.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${authUser.id})`,
          )
          .order("created_at", { ascending: true })

        setMessages(msgs || [])

        // Get other user's profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", otherUserId).single()

        setOtherUser(profile)

        // Mark messages as read
        if (msgs) {
          await supabase
            .from("messages")
            .update({ is_read: true })
            .eq("receiver_id", authUser.id)
            .eq("sender_id", otherUserId)
        }
      }

      setLoading(false)
    }

    loadChat()
  }, [otherUserId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    setSending(true)
    try {
      const supabase = createClient()
      const { data: newMsg, error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          receiver_id: otherUserId,
          content: newMessage,
        })
        .select("*, sender:sender_id(first_name, last_name), receiver:receiver_id(first_name, last_name)")
        .single()

      if (!error && newMsg) {
        setMessages([...messages, newMsg])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col p-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Link href="/dashboard/messages">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-bold text-foreground">
            {otherUser?.first_name} {otherUser?.last_name}
          </h1>
          <p className="text-sm text-muted-foreground">{otherUser?.email}</p>
        </div>
      </div>

      {/* Messages */}
      <Card className="flex-1 flex flex-col mb-4 overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
        />
        <Button type="submit" disabled={sending || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
