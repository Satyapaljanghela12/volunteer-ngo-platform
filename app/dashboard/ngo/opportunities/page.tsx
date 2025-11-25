"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Users } from "lucide-react"
import Link from "next/link"

export default function NGOOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOpportunities = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("opportunities")
          .select("*")
          .eq("ngo_id", user.id)
          .order("created_at", { ascending: false })

        setOpportunities(data || [])
      }

      setLoading(false)
    }

    loadOpportunities()
  }, [])

  const handleDelete = async (oppId: string) => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("opportunities").delete().eq("id", oppId)

      if (!error) {
        setOpportunities(opportunities.filter((o) => o.id !== oppId))
        alert("Opportunity deleted")
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error)
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Opportunities</h1>
          <p className="mt-2 text-muted-foreground">Manage all your volunteer opportunities</p>
        </div>
        <Link href="/dashboard/ngo/create-opportunity">
          <Button>Create New</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <Card key={opp.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{opp.title}</CardTitle>
                    <CardDescription>
                      {opp.location} • {opp.time_commitment_hours} hrs/week
                    </CardDescription>
                  </div>
                  <Badge variant={opp.status === "active" ? "default" : "secondary"}>{opp.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {opp.spots_available - opp.spots_filled} spots available
                    </p>
                    <p className="text-sm text-muted-foreground">{opp.cause_area}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/ngo/opportunities/${opp.id}/applications`}>
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Users className="h-4 w-4" />
                        Applications
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(opp.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't posted any opportunities yet</p>
            <Link href="/dashboard/ngo/create-opportunity">
              <Button>Post Your First Opportunity</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
