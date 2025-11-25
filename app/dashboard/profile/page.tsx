"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"

const AVAILABLE_SKILLS = [
  "Teaching",
  "Mentoring",
  "Event Planning",
  "Fundraising",
  "Social Media",
  "Design",
  "Writing",
  "Coding",
  "Photography",
  "Translation",
  "Cooking",
  "Healthcare",
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    phone: "",
  })

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profileData) {
          setProfile(profileData)
          setFormData({
            firstName: profileData.first_name || "",
            lastName: profileData.last_name || "",
            bio: profileData.bio || "",
            location: profileData.location || "",
            phone: profileData.phone || "",
          })
          setSkills(profileData.skills || [])
        }
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleAddSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            bio: formData.bio,
            location: formData.location,
            phone: formData.phone,
            skills,
            updated_at: new Date(),
          })
          .eq("id", user.id)

        if (!error) {
          alert("Profile updated successfully!")
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
        <p className="mt-2 text-muted-foreground">Complete your profile to help NGOs find you</p>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself and your volunteering interests..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
          <CardDescription>Add skills to help NGOs find you for relevant opportunities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search or type a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddSkill(newSkill)
                }
              }}
              list="skills-list"
            />
            <datalist id="skills-list">
              {AVAILABLE_SKILLS.filter(
                (s) => !skills.includes(s) && s.toLowerCase().includes(newSkill.toLowerCase()),
              ).map((skill) => (
                <option key={skill} value={skill} />
              ))}
            </datalist>
            <Button onClick={() => handleAddSkill(newSkill)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggested Skills */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Suggested Skills</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleAddSkill(skill)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-sm hover:bg-muted"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Your Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSaveProfile} disabled={saving} className="w-full md:w-auto">
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  )
}
