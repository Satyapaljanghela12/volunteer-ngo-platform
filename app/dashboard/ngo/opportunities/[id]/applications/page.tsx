"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ApplicationsPage() {
  const params = useParams()
  const oppId = params.id as string

  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadApplications = async () => {
      const supabase = createClient()

      const { data } = await supabase.from("applications").select("*, profiles(*)").eq("opportunity_id", oppId)

      setApplications(data || [])
      setLoading(false)
    }

    loadApplications()
  }, [oppId])

  const updateApplicationStatus = async (appId: string, status: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("applications").update({ status }).eq("id", appId)

      if (!error) {
        setApplications(applications.map((app) => (app.id === appId ? { ...app, status } : app)))
      }
    } catch (error) {
      console.error("Error updating application:", error)
    }
  }

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
      <Link href="/dashboard/ngo/opportunities" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Opportunities
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Applications</h1>
        <p className="mt-2 text-muted-foreground">Review and manage volunteer applications</p>
      </div>

      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle>
                      {app.profiles?.first_name} {app.profiles?.last_name}
                    </CardTitle>
                    <CardDescription>{app.profiles?.email}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(app.status)}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {app.cover_letter && (
                  <div>
                    <p className="text-sm font-medium mb-2">Cover Letter:</p>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{app.cover_letter}</p>
                  </div>
                )}

                {app.profiles?.skills && app.profiles.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {app.profiles.skills.map((skill: string) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {app.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={() => updateApplicationStatus(app.id, "accepted")} className="gap-2">
                      <Check className="h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateApplicationStatus(app.id, "rejected")}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No applications yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
