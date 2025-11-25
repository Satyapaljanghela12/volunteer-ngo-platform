"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NGOSettingsPage() {
  const [ngoData, setNgoData] = useState({
    organizationName: "",
    registrationNumber: "",
    website: "",
    mission: "",
    foundedYear: new Date().getFullYear(),
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase.from("ngo_details").select("*").eq("profile_id", user.id).single()

        if (data) {
          setNgoData({
            organizationName: data.organization_name || "",
            registrationNumber: data.registration_number || "",
            website: data.website || "",
            mission: data.mission || "",
            foundedYear: data.founded_year || new Date().getFullYear(),
          })
        }
      }

      setLoading(false)
    }

    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from("ngo_details").upsert({
          profile_id: user.id,
          organization_name: ngoData.organizationName,
          registration_number: ngoData.registrationNumber,
          website: ngoData.website,
          mission: ngoData.mission,
          founded_year: ngoData.foundedYear,
        })

        if (!error) {
          alert("Settings saved successfully!")
        }
      }
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Organization Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your NGO's profile and information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>Update your NGO's public information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              value={ngoData.organizationName}
              onChange={(e) =>
                setNgoData({
                  ...ngoData,
                  organizationName: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={ngoData.registrationNumber}
                onChange={(e) =>
                  setNgoData({
                    ...ngoData,
                    registrationNumber: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={ngoData.foundedYear}
                onChange={(e) =>
                  setNgoData({
                    ...ngoData,
                    foundedYear: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://example.org"
              value={ngoData.website}
              onChange={(e) => setNgoData({ ...ngoData, website: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              placeholder="Describe your NGO's mission and impact..."
              value={ngoData.mission}
              onChange={(e) => setNgoData({ ...ngoData, mission: e.target.value })}
              rows={4}
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
