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
    <div className="space-y-8 p-6 md:p-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile?.first_name || "Volunteer"}!</h1>
        <p className="text-muted-foreground">Here's an overview of your volunteering journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hours Contributed</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.hoursContributed}</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.opportunitiesApplied}</p>
            <p className="text-xs text-muted-foreground mt-1">Total submitted</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opportunities</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeOpportunities}</p>
            <p className="text-xs text-muted-foreground mt-1">Matching your profile</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Impact Score</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">4.8</p>
            <p className="text-xs text-muted-foreground mt-1">Based on reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your volunteering journey</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Link href="/dashboard/opportunities">
            <Button className="w-full h-11" variant="outline">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Opportunities
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button className="w-full h-11" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Complete Your Profile
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest volunteering activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Applied to Community Cleanup</p>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
              <span className="rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent">Pending</span>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Volunteered at Food Bank</p>
                <p className="text-sm text-muted-foreground">1 week ago</p>
              </div>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
