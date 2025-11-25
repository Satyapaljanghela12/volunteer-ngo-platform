"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const CAUSE_AREAS = [
  "Education",
  "Healthcare",
  "Environment",
  "Community Development",
  "Disaster Relief",
  "Animal Welfare",
  "Arts & Culture",
  "Sports & Recreation",
]

const COMMITMENT_LEVELS = [
  { value: "flexible", label: "Flexible (As per your availability)" },
  { value: "part-time", label: "Part-time (5-15 hours/week)" },
  { value: "full-time", label: "Full-time (20+ hours/week)" },
]

export default function CreateOpportunityPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    causeArea: "",
    requiredSkills: "",
    commitmentLevel: "flexible",
    timeCommitmentHours: "5",
    startDate: "",
    endDate: "",
    spotsAvailable: "1",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("opportunities").insert({
        ngo_id: user.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        cause_area: formData.causeArea,
        required_skills: formData.requiredSkills.split(",").map((s) => s.trim()),
        commitment_level: formData.commitmentLevel,
        time_commitment_hours: Number.parseInt(formData.timeCommitmentHours),
        start_date: formData.startDate,
        end_date: formData.endDate,
        spots_available: Number.parseInt(formData.spotsAvailable),
        status: "active",
      })

      if (error) throw error

      router.push("/dashboard/ngo")
      alert("Opportunity posted successfully!")
    } catch (error) {
      console.error("Error creating opportunity:", error)
      alert("Failed to create opportunity")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Link href="/dashboard/ngo" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Post a New Opportunity</h1>
        <p className="mt-2 text-muted-foreground">Share a volunteering opportunity to attract passionate volunteers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opportunity Details</CardTitle>
          <CardDescription>Provide information about the volunteer position</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Opportunity Title</Label>
              <Input
                id="title"
                placeholder="e.g., Community Event Organizer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and impact..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, Country or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Cause Area */}
            <div className="space-y-2">
              <Label htmlFor="causeArea">Cause Area</Label>
              <Select value={formData.causeArea} onValueChange={(val) => setFormData({ ...formData, causeArea: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a cause area" />
                </SelectTrigger>
                <SelectContent>
                  {CAUSE_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <Label htmlFor="requiredSkills">Required Skills (comma-separated)</Label>
              <Input
                id="requiredSkills"
                placeholder="e.g., Public Speaking, Event Planning, Social Media"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              />
            </div>

            {/* Commitment Level */}
            <div className="space-y-2">
              <Label htmlFor="commitmentLevel">Commitment Level</Label>
              <Select
                value={formData.commitmentLevel}
                onValueChange={(val) => setFormData({ ...formData, commitmentLevel: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMITMENT_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Commitment */}
            <div className="space-y-2">
              <Label htmlFor="timeCommitmentHours">Hours per Week</Label>
              <Input
                id="timeCommitmentHours"
                type="number"
                min="1"
                value={formData.timeCommitmentHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeCommitmentHours: e.target.value,
                  })
                }
              />
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Spots Available */}
            <div className="space-y-2">
              <Label htmlFor="spotsAvailable">Number of Spots Available</Label>
              <Input
                id="spotsAvailable"
                type="number"
                min="1"
                value={formData.spotsAvailable}
                onChange={(e) => setFormData({ ...formData, spotsAvailable: e.target.value })}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Publishing..." : "Publish Opportunity"}
              </Button>
              <Link href="/dashboard/ngo">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
