"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Home, Users, Briefcase, MessageSquare, Star, BarChart3, Settings, Menu } from "@/components/icons"
import { useState } from "react"

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "#" },
    { icon: Briefcase, label: "Opportunities", href: "#" },
    ...(user?.role === "ngo" ? [] : [{ icon: Users, label: "NGOs", href: "#" }]),
    { icon: MessageSquare, label: "Messages", href: "#" },
    { icon: Star, label: "Applications", href: "#" },
    ...(user?.role === "ngo" ? [{ icon: BarChart3, label: "Analytics", href: "#" }] : []),
    { icon: Settings, label: "Settings", href: "#" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">VC</span>
              </div>
              <h1 className="text-lg font-bold text-foreground hidden sm:block">VolConnect</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-foreground">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-muted-foreground text-xs capitalize">{user?.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-64" : "w-0"} bg-sidebar border-r border-border transition-all duration-300 overflow-hidden lg:w-64 lg:block`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.name?.split(" ")[0]}!</h2>
            <p className="text-muted-foreground">
              {user?.role === "volunteer"
                ? "Find meaningful opportunities to make an impact"
                : "Manage your volunteer team and opportunities"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Active Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">12</p>
                <p className="text-muted-foreground text-sm mt-1">Matching your profile</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Your Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">3</p>
                <p className="text-muted-foreground text-sm mt-1">Pending review</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Hours Contributed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-secondary">24</p>
                <p className="text-muted-foreground text-sm mt-1">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border mt-8">
            <CardHeader>
              <CardTitle>Featured Opportunities</CardTitle>
              <CardDescription>These opportunities match your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Opportunities will be displayed here once they are available</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
