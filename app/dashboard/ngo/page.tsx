"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Briefcase, TrendingUp, Calendar, Plus, CheckCircle2, Clock, AlertCircle, FileText, MessageSquare } from "lucide-react"

export default function NGODashboardPage() {
  const [ngoData, setNgoData] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    activeOpportunities: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedVolunteers: 0,
    totalVolunteers: 0,
    hoursContributed: 0,
    pendingVerifications: 0,
  })
  const [recentOpportunities, setRecentOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNGOData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Fetch profile for approval status
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(profileData)

        // Fetch NGO details
        const { data: ngoDetails } = await supabase.from("ngo_details").select("*").eq("profile_id", user.id).single()
        setNgoData(ngoDetails)

        // Fetch opportunities
        const { data: opportunities } = await supabase
          .from("opportunities")
          .select("id, title, status, created_at")
          .eq("ngo_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        setRecentOpportunities(opportunities || [])

        const opportunityIds = opportunities?.map((o) => o.id) || []
        const activeOpps = opportunities?.filter((o) => o.status === "active").length || 0

        // Fetch applications
        const { data: applications } = await supabase
          .from("applications")
          .select("id, status")
          .in("opportunity_id", opportunityIds)

        const pendingApps = applications?.filter((a) => a.status === "pending").length || 0
        const approvedApps = applications?.filter((a) => a.status === "accepted").length || 0

        // Fetch volunteer hours
        const { data: hours } = await supabase
          .from("volunteer_hours")
          .select("hours_worked")
          .eq("ngo_id", user.id)

        const totalHours = hours?.reduce((sum, h) => sum + (parseFloat(h.hours_worked) || 0), 0) || 0

        setStats({
          totalOpportunities: opportunities?.length || 0,
          activeOpportunities: activeOpps,
          totalApplications: applications?.length || 0,
          pendingApplications: pendingApps,
          approvedVolunteers: approvedApps,
          totalVolunteers: applications?.length || 0,
          hoursContributed: Math.round(totalHours),
          pendingVerifications: pendingApps,
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

  const approvalStatus = profile?.approval_status || "pending"
  const isApproved = approvalStatus === "approved"

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Approval Status Banner */}
      {!isApproved && (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {approvalStatus === "pending" ? (
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              ) : approvalStatus === "needs_info" ? (
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium text-foreground mb-1">
                  {approvalStatus === "pending" && "Your registration is under review"}
                  {approvalStatus === "needs_info" && "Additional information required"}
                  {approvalStatus === "rejected" && "Registration not approved"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {approvalStatus === "pending" && "Our admin team is reviewing your documents. You'll be notified once approved."}
                  {approvalStatus === "needs_info" && profile?.rejection_reason && profile.rejection_reason}
                  {approvalStatus === "rejected" && profile?.rejection_reason && `Reason: ${profile.rejection_reason}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">Welcome, {ngoData?.organization_name || "NGO"}!</h1>
            {isApproved && (
              <Badge className="bg-green-500 text-white">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Manage your volunteer opportunities and team</p>
        </div>
        {isApproved && (
          <Link href="/dashboard/ngo/create-opportunity">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Post Opportunity
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Opportunities</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalOpportunities}</p>
            <p className="text-xs text-muted-foreground mt-1">{stats.activeOpportunities} active</p>
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
            <p className="text-3xl font-bold">{stats.totalApplications}</p>
            <p className="text-xs text-muted-foreground mt-1">{stats.pendingApplications} pending</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved Volunteers</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.approvedVolunteers}</p>
            <p className="text-xs text-muted-foreground mt-1">Active volunteers</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hours Contributed</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.hoursContributed}</p>
            <p className="text-xs text-muted-foreground mt-1">Total hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your volunteer program</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {isApproved && (
            <Link href="/dashboard/ngo/create-opportunity">
              <Button className="w-full h-11" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Post Opportunity
              </Button>
            </Link>
          )}
          <Link href="/dashboard/ngo/opportunities">
            <Button className="w-full h-11" variant="outline">
              <Briefcase className="mr-2 h-4 w-4" />
              Manage Opportunities
            </Button>
          </Link>
          <Link href="/dashboard/ngo/volunteers">
            <Button className="w-full h-11" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              View Volunteers
            </Button>
          </Link>
          <Link href="/dashboard/ngo/settings">
            <Button className="w-full h-11" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Opportunities */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Opportunities</CardTitle>
              <CardDescription>Your recently posted volunteer opportunities</CardDescription>
            </div>
            {isApproved && (
              <Link href="/dashboard/ngo/opportunities">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recentOpportunities.length > 0 ? (
            <div className="space-y-0">
              {recentOpportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{opp.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(opp.created_at).toLocaleDateString()} • {opp.status}
                    </p>
                  </div>
                  <Link href={`/dashboard/ngo/opportunities/${opp.id}/applications`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No opportunities posted yet</p>
              {isApproved && (
                <Link href="/dashboard/ngo/create-opportunity">
                  <Button size="sm">Post Your First Opportunity</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
