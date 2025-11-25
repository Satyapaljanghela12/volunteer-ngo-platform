"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, AlertCircle, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalNGOs: 0,
    pendingVerifications: 0,
    flaggedContent: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const supabase = createClient()

      const { count: volunteerCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact" })
        .eq("user_type", "volunteer")

      const { count: ngoCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact" })
        .eq("user_type", "ngo")

      const { count: unverifiedCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact" })
        .eq("user_type", "ngo")
        .eq("verified", false)

      setStats({
        totalVolunteers: volunteerCount || 0,
        totalNGOs: ngoCount || 0,
        pendingVerifications: unverifiedCount || 0,
        flaggedContent: 0,
      })

      setLoading(false)
    }

    loadStats()
  }, [])

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage users, verify organizations, and moderate content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalVolunteers}</p>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total NGOs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalNGOs}</p>
            <p className="text-xs text-muted-foreground">Registered organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
            <p className="text-xs text-muted-foreground">NGOs awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Stats</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">92%</p>
            <p className="text-xs text-muted-foreground">Satisfaction rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Tools</CardTitle>
          <CardDescription>Manage platform activity and moderation</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/admin/users">
            <Button className="w-full bg-transparent" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </Link>
          <Link href="/dashboard/admin/ngos">
            <Button className="w-full bg-transparent" variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              Verify NGOs
            </Button>
          </Link>
          <Link href="/dashboard/admin/opportunities">
            <Button className="w-full bg-transparent" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Review Opportunities
            </Button>
          </Link>
          <Link href="/dashboard/admin/actions">
            <Button className="w-full bg-transparent" variant="outline">
              <AlertCircle className="mr-2 h-4 w-4" />
              Moderation Log
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">New NGO Registration</p>
                <p className="text-sm text-muted-foreground">Green Earth Foundation registered</p>
              </div>
              <Badge variant="outline">2 hours ago</Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Opportunity Posted</p>
                <p className="text-sm text-muted-foreground">Community Cleanup Drive - 50 spots</p>
              </div>
              <Badge variant="outline">4 hours ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Volunteer Signup</p>
                <p className="text-sm text-muted-foreground">15 new volunteers joined today</p>
              </div>
              <Badge variant="outline">Today</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
