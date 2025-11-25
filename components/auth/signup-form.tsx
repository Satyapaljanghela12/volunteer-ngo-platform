"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Loader2 } from "@/components/icons"

interface SignupFormProps {
  onLoginClick: () => void
}

export default function SignupForm({ onLoginClick }: SignupFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer")
  const [error, setError] = useState("")
  const { signup, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      await signup(email, password, name, role)
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to create account. Please try again.")
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join VolConnect to make an impact</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">I'm signing up as a</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="volunteer"
                  checked={role === "volunteer"}
                  onChange={(e) => setRole(e.target.value as "volunteer")}
                  disabled={loading}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Volunteer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="ngo"
                  checked={role === "ngo"}
                  onChange={(e) => setRole(e.target.value as "ngo")}
                  disabled={loading}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">NGO</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button type="button" onClick={onLoginClick} className="text-primary font-semibold hover:underline">
              Sign in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
