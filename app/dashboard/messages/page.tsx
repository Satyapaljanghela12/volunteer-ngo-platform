"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [filteredConversations, setFilteredConversations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadConversations = async () => {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setUser(authUser)

      if (authUser) {
        const { data: messages } = await supabase
          .from("messages")
          .select(
            "*, sender:sender_id(first_name, last_name, email), receiver:receiver_id(first_name, last_name, email)",
          )
          .or(`sender_id.eq.${authUser.id},receiver_id.eq.${authUser.id}`)
          .order("created_at", { ascending: false })

        // Group messages into conversations
        const conversationMap = new Map()
        messages?.forEach((msg) => {
          const otherUserId = msg.sender_id === authUser.id ? msg.receiver_id : msg.sender_id
          const otherUser = msg.sender_id === authUser.id ? msg.receiver : msg.sender

          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              userId: otherUserId,
              user: otherUser,
              lastMessage: msg,
              messages: [],
            })
          }
          conversationMap.get(otherUserId).messages.push(msg)
        })

        const convList = Array.from(conversationMap.values())
        setConversations(convList)
        setFilteredConversations(convList)
      }

      setLoading(false)
    }

    loadConversations()
  }, [])

  useEffect(() => {
    const filtered = conversations.filter(
      (conv) =>
        `${conv.user?.first_name} ${conv.user?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredConversations(filtered)
  }, [searchTerm, conversations])

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="mt-2 text-muted-foreground">Connect with volunteers and NGOs</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Conversations */}
      <div className="space-y-2">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <Link key={conv.userId} href={`/dashboard/messages/${conv.userId}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">
                        {conv.user?.first_name} {conv.user?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{conv.lastMessage?.content}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(conv.lastMessage?.created_at).toLocaleDateString()}
                      </p>
                      {!conv.lastMessage?.is_read && conv.lastMessage?.receiver_id === user?.id && (
                        <Badge variant="default" className="mt-1">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {conversations.length === 0 ? "No conversations yet" : "No conversations match your search"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
