"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import LoginForm from "./auth/login-form"
import { Heart, Users, Briefcase, Zap } from "@/components/icons"

export default function LandingPage() {
  const [authView, setAuthView] = useState<"none" | "login" | "signup">("none")
  const router = useRouter()

  if (authView !== "none") {
    // Redirect to new registration form if signup is clicked
    if (authView === "signup") {
      router.push("/auth/signup")
      return null
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">VolConnect</h1>
            <p className="text-muted-foreground text-sm mt-1">Connect. Volunteer. Impact.</p>
          </div>

          <LoginForm onSignupClick={() => router.push("/auth/signup")} />

          <Button variant="ghost" className="w-full mt-4" onClick={() => setAuthView("none")}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">VolConnect</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setAuthView("login")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/auth/signup")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Make a Difference. Find Your Purpose.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Connect with NGOs doing meaningful work. Volunteer your time, skills, and passion to create real impact in
              your community.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => router.push("/auth/signup")}>
                Explore Opportunities
              </Button>
              <Button size="lg" variant="outline" onClick={() => setAuthView("login")}>
                Sign In
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Join Volunteers</h3>
              <p className="text-sm text-muted-foreground">Thousands making a difference</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Partner NGOs</h3>
              <p className="text-sm text-muted-foreground">Verified organizations</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Quick Matching</h3>
              <p className="text-sm text-muted-foreground">Find perfect fit fast</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Track Impact</h3>
              <p className="text-sm text-muted-foreground">See your contributions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/5 border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple steps to start your volunteering journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Sign Up</h3>
              <p className="text-muted-foreground">Create your profile and tell us about your interests and skills</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Browse & Apply</h3>
              <p className="text-muted-foreground">Explore opportunities and apply to ones that match your passion</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Make Impact</h3>
              <p className="text-muted-foreground">Connect with NGOs and start making a real difference in the world</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    For Volunteers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    For NGOs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>2025 VolConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
