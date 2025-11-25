"use client"

import { useAuth } from "@/lib/auth-context"
import LandingPage from "@/components/landing-page"
import DashboardLayout from "@/components/dashboard-layout"

export default function Home() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <DashboardLayout />
  }

  return <LandingPage />
}
