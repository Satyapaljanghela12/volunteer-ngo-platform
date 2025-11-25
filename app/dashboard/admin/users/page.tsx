"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2 } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      const supabase = createClient()

      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      setUsers(data || [])
      setFilteredUsers(data || [])
      setLoading(false)
    }

    loadUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleDeactivate = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return

    try {
      const supabase = createClient()
      // In a real app, you'd have a deactivation mechanism
      alert("User deactivation would be processed")
    } catch (error) {
      console.error("Error deactivating user:", error)
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <Link href="/dashboard/admin" className="text-primary hover:underline text-sm">
        ← Back to Admin Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
        <p className="mt-2 text-muted-foreground">View and manage all platform users</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Joined</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {user.user_type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.verified ? "default" : "secondary"}>
                        {user.verified ? "Verified" : "Unverified"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="ghost" onClick={() => handleDeactivate(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
