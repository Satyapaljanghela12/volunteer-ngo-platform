"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Clock, Heart, Target } from "lucide-react"

export default function ImpactPage() {
  const [impactData, setImpactData] = useState<any>(null)
  const [stats, setStats] = useState({
    hoursContributed: 0,
    livesImpacted: 0,
    projectsCompleted: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImpactData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: impact } = await supabase.from("impact_stats").select("*").eq("volunteer_id", user.id).single()

        if (impact) {
          setImpactData(impact)
          setStats({
            hoursContributed: impact.hours_contributed || 0,
            livesImpacted: impact.lives_impacted || 0,
            projectsCompleted: impact.projects_completed || 0,
          })
        }
      }

      setLoading(false)
    }

    loadImpactData()
  }, [])

  const chartData = [
    { month: "Jan", hours: 4 },
    { month: "Feb", hours: 8 },
    { month: "Mar", hours: 12 },
    { month: "Apr", hours: 16 },
    { month: "May", hours: 20 },
    { month: "Jun", hours: stats.hoursContributed },
  ]

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Impact</h1>
        <p className="mt-2 text-muted-foreground">Track your volunteering impact and contribution</p>
      </div>

      {/* Impact Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Contributed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.hoursContributed}</p>
            <p className="text-xs text-muted-foreground mt-1">Total volunteer hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lives Impacted</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.livesImpacted}</p>
            <p className="text-xs text-muted-foreground mt-1">People positively impacted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.projectsCompleted}</p>
            <p className="text-xs text-muted-foreground mt-1">Opportunities completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Hours Contributed Over Time</CardTitle>
          <CardDescription>Your volunteer hours trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="var(--color-primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Impact Achievement */}
      <Card>
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
          <CardDescription>Milestones you've reached</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">First Steps</p>
              <p className="text-sm text-muted-foreground">Complete your first volunteer opportunity</p>
            </div>
            <div className="text-2xl">✓</div>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium">Building Impact</p>
              <p className="text-sm text-muted-foreground">Contribute 10 hours of volunteering</p>
            </div>
            <div className={stats.hoursContributed >= 10 ? "text-2xl" : "text-2xl opacity-50"}>✓</div>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium">Change Maker</p>
              <p className="text-sm text-muted-foreground">Complete 5 different opportunities</p>
            </div>
            <div className={stats.projectsCompleted >= 5 ? "text-2xl" : "text-2xl opacity-50"}>✓</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
