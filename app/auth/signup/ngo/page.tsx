"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

const NGO_TYPES = ["Trust", "Society", "Section 8 Company", "Other"]
const CAUSE_CATEGORIES = [
  "Education",
  "Environment",
  "Healthcare",
  "Women Empowerment",
  "Animal Welfare",
  "Disaster Relief",
  "Community Development",
  "Child Welfare",
  "Elderly Care",
  "Rural Development",
  "Skill Development",
  "Other"
]

const REPRESENTATIVE_ROLES = ["Founder", "Manager", "HR", "Coordinator", "Director", "Other"]

export default function NGOSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Step 1: Basic Account Info
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [representativeName, setRepresentativeName] = useState("")
  const [representativeRole, setRepresentativeRole] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [officialEmail, setOfficialEmail] = useState("")
  const [idProofFile, setIdProofFile] = useState<File | null>(null)
  const [idProofType, setIdProofType] = useState("")

  // Step 2: NGO Basic Details
  const [ngoName, setNgoName] = useState("")
  const [registeredAddress, setRegisteredAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [ngoType, setNgoType] = useState("")
  const [socialCauses, setSocialCauses] = useState<string[]>([])
  const [ngoDescription, setNgoDescription] = useState("")
  const [website, setWebsite] = useState("")
  const [foundedYear, setFoundedYear] = useState("")

  // Step 3: Legal Documents
  const [registrationCertFile, setRegistrationCertFile] = useState<File | null>(null)
  const [panNumber, setPanNumber] = useState("")
  const [panDocumentFile, setPanDocumentFile] = useState<File | null>(null)
  const [certificate12aFile, setCertificate12aFile] = useState<File | null>(null)
  const [certificate80gFile, setCertificate80gFile] = useState<File | null>(null)
  const [fcraCertFile, setFcraCertFile] = useState<File | null>(null)
  const [gstCertFile, setGstCertFile] = useState<File | null>(null)
  const [bankProofFile, setBankProofFile] = useState<File | null>(null)

  const handleFileUpload = async (file: File, path: string): Promise<string> => {
    const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${path}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
    }

    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath)
    return urlData.publicUrl
  }

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1
      if (!email || !password || !repeatPassword || !representativeName || !representativeRole || !mobileNumber || !officialEmail || !idProofFile || !idProofType) {
        setError("Please fill in all required fields")
        return
      }
      if (password !== repeatPassword) {
        setError("Passwords do not match")
        return
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters")
        return
      }
    } else if (step === 2) {
      // Validate step 2
      if (!ngoName || !registeredAddress || !city || !state || !ngoType || socialCauses.length === 0 || !ngoDescription) {
        setError("Please fill in all required fields")
        return
      }
    }
    setError(null)
    setStep(step + 1)
  }

  const handleBack = () => {
    setError(null)
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: representativeName.split(" ")[0] || representativeName,
            last_name: representativeName.split(" ").slice(1).join(" ") || "",
            user_type: "ngo",
            representative_role: representativeRole,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("Failed to create user")

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Upload documents
      const documentUrls: Record<string, string> = {}

      if (idProofFile) {
        documentUrls.idProof = await handleFileUpload(idProofFile, `ngo-documents/${authData.user.id}/id-proof`)
      }
      if (registrationCertFile) {
        documentUrls.registrationCert = await handleFileUpload(registrationCertFile, `ngo-documents/${authData.user.id}/registration`)
      }
      if (panDocumentFile) {
        documentUrls.panDocument = await handleFileUpload(panDocumentFile, `ngo-documents/${authData.user.id}/pan`)
      }
      if (certificate12aFile) {
        documentUrls.certificate12a = await handleFileUpload(certificate12aFile, `ngo-documents/${authData.user.id}/certificates`)
      }
      if (certificate80gFile) {
        documentUrls.certificate80g = await handleFileUpload(certificate80gFile, `ngo-documents/${authData.user.id}/certificates`)
      }
      if (fcraCertFile) {
        documentUrls.fcraCert = await handleFileUpload(fcraCertFile, `ngo-documents/${authData.user.id}/certificates`)
      }
      if (gstCertFile) {
        documentUrls.gstCert = await handleFileUpload(gstCertFile, `ngo-documents/${authData.user.id}/certificates`)
      }
      if (bankProofFile) {
        documentUrls.bankProof = await handleFileUpload(bankProofFile, `ngo-documents/${authData.user.id}/bank`)
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: representativeName.split(" ")[0] || representativeName,
          last_name: representativeName.split(" ").slice(1).join(" ") || "",
          phone: mobileNumber,
          email: email,
          representative_role: representativeRole,
          id_proof_url: documentUrls.idProof,
          id_proof_type: idProofType,
          approval_status: "pending",
        })
        .eq("id", authData.user.id)

      if (profileError) throw profileError

      // Create NGO details
      const { error: ngoError } = await supabase
        .from("ngo_details")
        .insert({
          profile_id: authData.user.id,
          organization_name: ngoName,
          registered_address: registeredAddress,
          city: city,
          state: state,
          ngo_type: ngoType,
          social_cause_category: socialCauses,
          mission: ngoDescription,
          website: website || null,
          founded_year: foundedYear ? parseInt(foundedYear) : null,
          official_email: officialEmail,
          registration_certificate_url: documentUrls.registrationCert,
          pan_number: panNumber || null,
          pan_document_url: documentUrls.panDocument,
          certificate_12a_url: documentUrls.certificate12a,
          certificate_80g_url: documentUrls.certificate80g,
          fcra_certificate_url: documentUrls.fcraCert,
          gst_certificate_url: documentUrls.gstCert,
          bank_account_proof_url: documentUrls.bankProof,
        })

      if (ngoError) throw ngoError

      router.push("/auth/check-email?type=ngo")
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || "Failed to register. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleCause = (cause: string) => {
    setSocialCauses(prev =>
      prev.includes(cause) ? prev.filter(c => c !== cause) : [...prev, cause]
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/auth/signup" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Signup
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">NGO Registration</h1>
          <p className="text-muted-foreground">Complete your registration to start posting opportunities</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= s ? "bg-primary text-primary-foreground border-primary" : "border-muted text-muted-foreground"
              }`}>
                {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Step 1: Representative Information"}
              {step === 2 && "Step 2: NGO Details"}
              {step === 3 && "Step 3: Legal Documents"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about yourself and your contact information"}
              {step === 2 && "Provide your NGO's basic information and mission"}
              {step === 3 && "Upload required legal documents for verification"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Step 1: Representative Information */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="officialEmail">Official Email (NGO domain preferred) <span className="text-destructive">*</span></Label>
                    <Input
                      id="officialEmail"
                      type="email"
                      placeholder="contact@yourngo.org"
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repeatPassword">Confirm Password <span className="text-destructive">*</span></Label>
                    <Input
                      id="repeatPassword"
                      type="password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="representativeName">Representative Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="representativeName"
                      placeholder="Full Name"
                      value={representativeName}
                      onChange={(e) => setRepresentativeName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="representativeRole">Your Role <span className="text-destructive">*</span></Label>
                    <Select value={representativeRole} onValueChange={setRepresentativeRole}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {REPRESENTATIVE_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number <span className="text-destructive">*</span></Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idProofType">ID Proof Type <span className="text-destructive">*</span></Label>
                  <Select value={idProofType} onValueChange={setIdProofType}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aadhar">Aadhar Card</SelectItem>
                      <SelectItem value="PAN">PAN Card</SelectItem>
                      <SelectItem value="Driving License">Driving License</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idProof">ID Proof Document <span className="text-destructive">*</span></Label>
                  <Input
                    id="idProof"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setIdProofFile(e.target.files?.[0] || null)}
                    className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Upload Aadhar, PAN, Driving License, or Passport (Max 5MB)</p>
                </div>
              </div>
            )}

            {/* Step 2: NGO Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="ngoName">NGO Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="ngoName"
                    placeholder="Your NGO Name"
                    value={ngoName}
                    onChange={(e) => setNgoName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registeredAddress">Registered Address <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="registeredAddress"
                    placeholder="Complete registered address"
                    value={registeredAddress}
                    onChange={(e) => setRegisteredAddress(e.target.value)}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ngoType">NGO Type <span className="text-destructive">*</span></Label>
                    <Select value={ngoType} onValueChange={setNgoType}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select NGO type" />
                      </SelectTrigger>
                      <SelectContent>
                        {NGO_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      type="number"
                      placeholder="2020"
                      value={foundedYear}
                      onChange={(e) => setFoundedYear(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Social Cause Categories <span className="text-destructive">*</span></Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border border-border rounded-lg">
                    {CAUSE_CATEGORIES.map((cause) => (
                      <label key={cause} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={socialCauses.includes(cause)}
                          onChange={() => toggleCause(cause)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{cause}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Select all that apply</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ngoDescription">NGO Description / Mission <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="ngoDescription"
                    placeholder="Describe what your NGO does, your mission, and the impact you create..."
                    value={ngoDescription}
                    onChange={(e) => setNgoDescription(e.target.value)}
                    required
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.yourngo.org"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Legal Documents */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Required Documents</p>
                  <p className="text-xs text-muted-foreground">
                    Upload clear, legible copies of all documents. All documents will be verified by our admin team before approval.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationCert">NGO Registration Certificate <span className="text-destructive">*</span></Label>
                  <Input
                    id="registrationCert"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setRegistrationCertFile(e.target.files?.[0] || null)}
                    className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      placeholder="ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="h-11"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panDocument">PAN Document</Label>
                    <Input
                      id="panDocument"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setPanDocumentFile(e.target.files?.[0] || null)}
                      className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate12a">12A Certificate (if applicable)</Label>
                  <Input
                    id="certificate12a"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setCertificate12aFile(e.target.files?.[0] || null)}
                    className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate80g">80G Certificate (if applicable)</Label>
                  <Input
                    id="certificate80g"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setCertificate80gFile(e.target.files?.[0] || null)}
                    className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fcraCert">FCRA Certificate (if applicable)</Label>
                  <Input
                    id="fcraCert"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setFcraCertFile(e.target.files?.[0] || null)}
                    className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Required if accepting foreign volunteers/donations</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstCert">GST Certificate (optional)</Label>
                  <Input
                    id="gstCert"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setGstCertFile(e.target.files?.[0] || null)}
                    className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankProof">Bank Account Proof (optional)</Label>
                  <Input
                    id="bankProof"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setBankProofFile(e.target.files?.[0] || null)}
                    className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={handleNext} className="flex-1">
                  Next
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={loading} className="flex-1">
                  {loading ? "Submitting..." : "Submit Registration"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

