"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Link from "next/link"

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOpportunities = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("opportunities")
        .select("*, profiles(*)")
        .order("created_at", { ascending: false })

      setOpportunities(data || [])
      setLoading(false)
    }

    loadOpportunities()
  }, [])

  const handleRemove = async (oppId: string) => {
    if (!confirm("Are you sure you want to remove this opportunity?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("opportunities").delete().eq("id", oppId)

      if (!error) {
        setOpportunities(opportunities.filter((o) => o.id !== oppId))
        alert("Opportunity removed")
      }
    } catch (error) {
      console.error("Error removing opportunity:", error)
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <Link href="/dashboard/admin" className="text-primary hover:underline text-sm">
        ← Back to Admin Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Review Opportunities</h1>
        <p className="mt-2 text-muted-foreground">Monitor and manage posted volunteer opportunities</p>
      </div>

      <div className="space-y-4">
        {opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <Card key={opp.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{opp.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      by {opp.profiles?.first_name} {opp.profiles?.last_name}
                    </p>
                  </div>
                  <Badge variant={opp.status === "active" ? "default" : "secondary"}>{opp.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground line-clamp-1">{opp.description}</p>
                    <p className="text-muted-foreground">
                      {opp.location} • {opp.time_commitment_hours} hrs/week
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleRemove(opp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No opportunities found</p>
          </div>
        )}
      </div>
    </div>
  )
}
