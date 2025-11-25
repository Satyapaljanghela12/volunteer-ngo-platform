"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export type UserRole = "volunteer" | "ngo" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock login - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: "1",
        email,
        name: email.split("@")[0],
        role: "volunteer",
        createdAt: new Date(),
      })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true)
    try {
      // Mock signup - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: "1",
        email,
        name,
        role,
        createdAt: new Date(),
      })
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: user !== null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
