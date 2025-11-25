"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Briefcase, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function OpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const opportunityId = params.id as string

  const [opportunity, setOpportunity] = useState<any>(null)
  const [ngoData, setNgoData] = useState<any>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setUser(authUser)

      const { data: opp } = await supabase.from("opportunities").select("*").eq("id", opportunityId).single()

      setOpportunity(opp)

      if (opp) {
        const { data: ngo } = await supabase.from("profiles").select("*").eq("id", opp.ngo_id).single()

        setNgoData(ngo)
      }

      // Check if already applied
      if (authUser) {
        const { data: existingApp } = await supabase
          .from("applications")
          .select("id")
          .eq("opportunity_id", opportunityId)
          .eq("volunteer_id", authUser.id)
          .single()

        setAlreadyApplied(!!existingApp)
      }

      setLoading(false)
    }

    loadData()
  }, [opportunityId])

  const handleApply = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setApplying(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("applications").insert({
        opportunity_id: opportunityId,
        volunteer_id: user.id,
        cover_letter: coverLetter,
        status: "pending",
      })

      if (error) throw error

      alert("Application submitted successfully!")
      setAlreadyApplied(true)
      setCoverLetter("")
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Failed to submit application")
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!opportunity) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Opportunity not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Link href="/dashboard/opportunities" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Opportunities
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">{opportunity.title}</h1>
        <p className="mt-2 text-muted-foreground">
          Posted by {ngoData?.first_name} {ngoData?.last_name}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Opportunity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-wrap text-foreground">{opportunity.description}</p>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {opportunity.location && (
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{opportunity.location}</p>
                    </div>
                  </div>
                )}

                {opportunity.time_commitment_hours && (
                  <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time Commitment</p>
                      <p className="font-medium">{opportunity.time_commitment_hours} hours/week</p>
                    </div>
                  </div>
                )}

                {opportunity.commitment_level && (
                  <div className="flex gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Commitment Level</p>
                      <p className="font-medium capitalize">{opportunity.commitment_level}</p>
                    </div>
                  </div>
                )}

                {opportunity.start_date && (
                  <div className="flex gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date(opportunity.start_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Required Skills */}
          {opportunity.required_skills && opportunity.required_skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {opportunity.required_skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* NGO Card */}
          <Card>
            <CardHeader>
              <CardTitle>About the Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Organization</p>
                <p className="font-medium">
                  {ngoData?.first_name} {ngoData?.last_name}
                </p>
              </div>
              {ngoData?.location && (
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{ngoData.location}</p>
                </div>
              )}
              {ngoData?.bio && (
                <div>
                  <p className="text-sm text-muted-foreground">About</p>
                  <p className="text-sm">{ngoData.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Spots Available</p>
                <p className="text-2xl font-bold">{opportunity.spots_available - opportunity.spots_filled}</p>
              </div>
              {alreadyApplied && (
                <div className="rounded-lg bg-accent/10 p-3">
                  <p className="text-sm text-accent font-medium">You've already applied to this opportunity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Apply Section */}
          {!alreadyApplied && (
            <Card>
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Letter (optional)</label>
                  <Textarea
                    placeholder="Tell the organization why you're interested..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleApply} disabled={applying} className="w-full">
                  {applying ? "Submitting..." : "Submit Application"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
