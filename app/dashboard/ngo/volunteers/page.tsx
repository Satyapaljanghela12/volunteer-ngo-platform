"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [filteredVolunteers, setFilteredVolunteers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVolunteers = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: opportunities } = await supabase.from("opportunities").select("id").eq("ngo_id", user.id)

        if (opportunities && opportunities.length > 0) {
          const oppIds = opportunities.map((o) => o.id)
          const { data: applications } = await supabase
            .from("applications")
            .select("*, profiles(*)")
            .in("opportunity_id", oppIds)

          const uniqueVolunteers = Array.from(
            new Map(applications?.map((app) => [app.profiles.id, app.profiles]) || []).values(),
          )

          setVolunteers(uniqueVolunteers)
          setFilteredVolunteers(uniqueVolunteers)
        }
      }

      setLoading(false)
    }

    loadVolunteers()
  }, [])

  useEffect(() => {
    const filtered = volunteers.filter(
      (vol) =>
        `${vol.first_name} ${vol.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.location?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredVolunteers(filtered)
  }, [searchTerm, volunteers])

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Volunteers</h1>
        <p className="mt-2 text-muted-foreground">Manage and track volunteers who have applied to your opportunities</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search volunteers by name, email, or location..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Volunteers List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVolunteers.length > 0 ? (
          filteredVolunteers.map((volunteer) => (
            <Card key={volunteer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {volunteer.first_name} {volunteer.last_name}
                    </CardTitle>
                    <CardDescription>{volunteer.email}</CardDescription>
                  </div>
                  {volunteer.verified && <Badge variant="secondary">Verified</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {volunteer.location && (
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm">{volunteer.location}</p>
                  </div>
                )}

                {volunteer.skills && volunteer.skills.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {volunteer.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{volunteer.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {volunteer.bio && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bio</p>
                    <p className="text-sm line-clamp-2 text-muted-foreground">{volunteer.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {volunteers.length === 0 ? "No volunteers have applied yet" : "No volunteers match your search"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
