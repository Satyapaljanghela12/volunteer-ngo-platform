"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Briefcase, TrendingUp, Calendar, Plus } from "lucide-react"

export default function NGODashboardPage() {
  const [ngoData, setNgoData] = useState<any>(null)
  const [stats, setStats] = useState({
    activeOpportunities: 0,
    totalVolunteers: 0,
    hoursContributed: 0,
    applications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNGOData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: ngoDetails } = await supabase.from("ngo_details").select("*").eq("profile_id", user.id).single()

        setNgoData(ngoDetails)

        // Fetch opportunities count
        const { data: opportunities } = await supabase.from("opportunities").select("id").eq("ngo_id", user.id)

        // Fetch applications count
        const { data: applications } = await supabase
          .from("applications")
          .select("id", { count: "exact" })
          .in("opportunity_id", opportunities?.map((o) => o.id) || [])

        setStats({
          activeOpportunities: opportunities?.length || 0,
          totalVolunteers: applications?.length || 0,
          hoursContributed: 148,
          applications: applications?.length || 0,
        })
      }

      setLoading(false)
    }

    loadNGOData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {ngoData?.organization_name || "NGO"}!</h1>
          <p className="mt-2 text-muted-foreground">Manage your volunteer opportunities and team</p>
        </div>
        <Link href="/dashboard/ngo/create-opportunity">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post Opportunity
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.activeOpportunities}</p>
            <p className="text-xs text-muted-foreground">Currently posted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.applications}</p>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.hoursContributed}</p>
            <p className="text-xs text-muted-foreground">Contributed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalVolunteers}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your volunteer program</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/ngo/create-opportunity">
            <Button className="w-full bg-transparent" variant="outline">
              <Briefcase className="mr-2 h-4 w-4" />
              Post Opportunity
            </Button>
          </Link>
          <Link href="/dashboard/ngo/volunteers">
            <Button className="w-full bg-transparent" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              View Volunteers
            </Button>
          </Link>
          <Link href="/dashboard/ngo/settings">
            <Button className="w-full bg-transparent" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Organization Settings
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Your Opportunities</CardTitle>
          <CardDescription>Recently posted volunteer opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Your opportunities will appear here once posted</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
