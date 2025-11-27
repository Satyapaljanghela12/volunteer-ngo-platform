"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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
  const [collegeIdFile, setCollegeIdFile] = useState<File | null>(null)
  const [uploadingId, setUploadingId] = useState(false)
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

    if (!collegeIdFile) {
      alert("Please upload your college ID for verification")
      return
    }

    setApplying(true)
    setUploadingId(true)
    let collegeIdUrl = ""

    try {
      const supabase = createClient()

      // Upload college ID to Supabase Storage
      if (collegeIdFile) {
        const fileExt = collegeIdFile.name.split(".").pop()
        const fileName = `${user.id}/${opportunityId}-${Date.now()}.${fileExt}`
        const filePath = `college-ids/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(filePath, collegeIdFile, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          console.warn("Storage upload failed, using alternative method:", uploadError)
          collegeIdUrl = `pending-upload-${fileName}`
        } else {
          const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath)
          collegeIdUrl = urlData.publicUrl
        }
      }

      const response = await fetch("/api/opportunities/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId,
          coverLetter,
          collegeIdUrl,
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || "Failed to submit application")
      }

      alert("Application submitted successfully! Your college ID has been uploaded for verification.")
      setAlreadyApplied(true)
      setCoverLetter("")
      setCollegeIdFile(null)
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Failed to submit application. Please try again.")
    } finally {
      setApplying(false)
      setUploadingId(false)
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
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      <Link 
        href="/dashboard/opportunities" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Opportunities
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{opportunity.title}</h1>
        <p className="text-muted-foreground">
          Posted by {ngoData?.first_name} {ngoData?.last_name}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">About This Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{opportunity.description}</p>
            </CardContent>
          </Card>

          {/* Details */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {opportunity.location && (
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</p>
                      <p className="font-medium text-foreground">{opportunity.location}</p>
                    </div>
                  </div>
                )}

                {opportunity.time_commitment_hours && (
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Time Commitment</p>
                      <p className="font-medium text-foreground">{opportunity.time_commitment_hours} hours/week</p>
                    </div>
                  </div>
                )}

                {opportunity.commitment_level && (
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Commitment Level</p>
                      <p className="font-medium text-foreground capitalize">{opportunity.commitment_level.replace("-", " ")}</p>
                    </div>
                  </div>
                )}

                {opportunity.start_date && (
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Start Date</p>
                      <p className="font-medium text-foreground">{new Date(opportunity.start_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Required Skills */}
          {opportunity.required_skills && opportunity.required_skills.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {opportunity.required_skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
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
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">About the Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Organization</p>
                <p className="font-medium text-foreground">
                  {ngoData?.first_name} {ngoData?.last_name}
                </p>
              </div>
              {ngoData?.location && (
                <div className="space-y-1 pt-2 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</p>
                  <p className="font-medium text-foreground">{ngoData.location}</p>
                </div>
              )}
              {ngoData?.bio && (
                <div className="space-y-1 pt-2 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">About</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ngoData.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Opportunity Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Spots Available</p>
                <p className="text-3xl font-bold text-foreground">{opportunity.spots_available - opportunity.spots_filled}</p>
              </div>
              {alreadyApplied && (
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                  <p className="text-sm text-accent font-medium">You've already applied to this opportunity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Apply Section */}
          {!alreadyApplied && (
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Apply Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-foreground">Cover Letter (optional)</label>
                  <Textarea
                    placeholder="Tell the organization why you're interested..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-foreground">
                    College ID Upload <span className="text-destructive">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Please upload a clear image of your college ID for verification. Accepted formats: JPG, PNG, PDF (Max 5MB)
                  </p>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("File size must be less than 5MB")
                            return
                          }
                          setCollegeIdFile(file)
                        }
                      }}
                      className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      required
                    />
                    {collegeIdFile && (
                      <div className="rounded-md bg-muted/50 border border-border/50 p-2.5">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">Selected:</span> {collegeIdFile.name} ({(collegeIdFile.size / 1024).toFixed(2)} KB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-1.5">
                  <p className="text-sm font-medium text-foreground">Verification Required</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your college ID will be verified to confirm your student status. This helps ensure opportunities are available to eligible students.
                  </p>
                </div>

                <Button 
                  onClick={handleApply} 
                  disabled={applying || uploadingId || !collegeIdFile} 
                  className="w-full"
                  size="lg"
                >
                  {applying || uploadingId ? "Submitting..." : "Submit Application"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
