"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, Clock, Users, TrendingUp, Settings } from "lucide-react"

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    hoursContributed: 0,
    opportunitiesApplied: 0,
    activeOpportunities: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        setProfile(profileData)

        // Fetch application count
        const { data: applications } = await supabase.from("applications").select("id").eq("volunteer_id", user.id)

        setStats({
          hoursContributed: 24,
          opportunitiesApplied: applications?.length || 0,
          activeOpportunities: 12,
        })
      }

      setLoading(false)
    }

    loadData()
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile?.first_name || "Volunteer"}!</h1>
        <p className="mt-2 text-muted-foreground">Here's an overview of your volunteering journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Contributed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.hoursContributed}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.opportunitiesApplied}</p>
            <p className="text-xs text-muted-foreground">Total submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.activeOpportunities}</p>
            <p className="text-xs text-muted-foreground">Matching your profile</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4.8</p>
            <p className="text-xs text-muted-foreground">Based on reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your volunteering journey</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard/opportunities">
            <Button className="w-full bg-transparent" variant="outline">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Opportunities
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button className="w-full bg-transparent" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Complete Your Profile
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest volunteering activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Applied to Community Cleanup</p>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent">Pending</span>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Volunteered at Food Bank</p>
                <p className="text-sm text-muted-foreground">1 week ago</p>
              </div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent">Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
