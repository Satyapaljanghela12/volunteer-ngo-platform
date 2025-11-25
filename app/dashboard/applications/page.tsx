"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadApplications = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("applications")
          .select("*, opportunities(*)")
          .eq("volunteer_id", user.id)
          .order("applied_at", { ascending: false })

        setApplications(data || [])
      }

      setLoading(false)
    }

    loadApplications()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-accent/20 text-accent"
      case "rejected":
        return "bg-destructive/20 text-destructive"
      case "pending":
        return "bg-yellow-500/20 text-yellow-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
        <p className="mt-2 text-muted-foreground">Track the status of your volunteer applications</p>
      </div>

      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle>{app.opportunities?.title || "Opportunity"}</CardTitle>
                    <CardDescription>Applied on {new Date(app.applied_at).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(app.status)}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {app.cover_letter && (
                  <div>
                    <p className="text-sm font-medium mb-2">Your Message:</p>
                    <p className="text-sm text-muted-foreground">{app.cover_letter}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">You haven't applied to any opportunities yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
