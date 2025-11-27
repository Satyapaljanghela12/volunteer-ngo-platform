"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Briefcase } from "lucide-react"
import Link from "next/link"

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("opportunities")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })

        setOpportunities(data || [])
        setFilteredOpportunities(data || [])
      } catch (error) {
        console.error("[v0] Error loading opportunities:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOpportunities()
  }, [])

  useEffect(() => {
    const filtered = opportunities.filter(
      (opp) =>
        opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.cause_area?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredOpportunities(filtered)
  }, [searchTerm, opportunities])

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading opportunities...</div>
  }

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
        <p className="text-muted-foreground">Find volunteering opportunities that match your interests</p>
      </div>

      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          placeholder="Search by title, location, or cause..."
          className="pl-10 h-11"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Opportunities Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opp) => (
            <Card key={opp.id} className="flex flex-col hover:shadow-md transition-all duration-200 border-border/50 hover:border-border">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="line-clamp-2 text-lg leading-tight mb-1">{opp.title}</CardTitle>
                    <CardDescription className="text-xs">Posted by NGO</CardDescription>
                  </div>
                  {opp.cause_area && (
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {opp.cause_area}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">{opp.description}</p>

                <div className="space-y-2.5 pt-2 border-t border-border/50">
                  {opp.location && (
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{opp.location}</span>
                    </div>
                  )}
                  {opp.time_commitment_hours && (
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{opp.time_commitment_hours} hours/week</span>
                    </div>
                  )}
                  {opp.commitment_level && (
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5 shrink-0" />
                      <span className="capitalize">{opp.commitment_level.replace("-", " ")}</span>
                    </div>
                  )}
                </div>

                <Link href={`/dashboard/opportunities/${opp.id}`} className="mt-auto pt-2">
                  <Button className="w-full" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <p className="text-muted-foreground">No opportunities found</p>
          </div>
        )}
      </div>
    </div>
  )
}
