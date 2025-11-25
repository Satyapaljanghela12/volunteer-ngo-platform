"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ModeratorActionsPage() {
  const [actions, setActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActions = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("admin_actions")
        .select("*, profiles(*)")
        .order("created_at", { ascending: false })
        .limit(50)

      setActions(data || [])
      setLoading(false)
    }

    loadActions()
  }, [])

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <Link href="/dashboard/admin" className="text-primary hover:underline text-sm">
        ← Back to Admin Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Moderation Log</h1>
        <p className="mt-2 text-muted-foreground">Track all admin moderation actions and decisions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {actions.length > 0 ? (
            <div className="space-y-4">
              {actions.map((action) => (
                <div key={action.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium capitalize">{action.action_type}</p>
                    <p className="text-sm text-muted-foreground">
                      By {action.profiles?.first_name} {action.profiles?.last_name}
                    </p>
                    {action.reason && <p className="text-sm text-muted-foreground mt-1">Reason: {action.reason}</p>}
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{new Date(action.created_at).toLocaleDateString()}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No moderation actions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
