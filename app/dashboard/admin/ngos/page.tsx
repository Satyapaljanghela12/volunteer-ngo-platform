"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"

export default function NGOVerificationPage() {
  const [ngos, setNgos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNGOs = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("profiles")
        .select("*, ngo_details(*)")
        .eq("user_type", "ngo")
        .order("created_at", { ascending: false })

      setNgos(data || [])
      setLoading(false)
    }

    loadNGOs()
  }, [])

  const handleVerify = async (userId: string, verified: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("profiles").update({ verified }).eq("id", userId)

      if (!error) {
        setNgos(ngos.map((ngo) => (ngo.id === userId ? { ...ngo, verified } : ngo)))
        alert(verified ? "NGO verified!" : "NGO unverified")
      }
    } catch (error) {
      console.error("Error verifying NGO:", error)
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  const pendingNGOs = ngos.filter((ngo) => !ngo.verified)
  const verifiedNGOs = ngos.filter((ngo) => ngo.verified)

  return (
    <div className="space-y-6 p-6">
      <Link href="/dashboard/admin" className="text-primary hover:underline text-sm">
        ← Back to Admin Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">NGO Verification</h1>
        <p className="mt-2 text-muted-foreground">Review and verify registered NGOs</p>
      </div>

      {/* Pending NGOs */}
      <div>
        <h2 className="text-xl font-bold mb-4">Pending Verification ({pendingNGOs.length})</h2>
        <div className="space-y-4">
          {pendingNGOs.length > 0 ? (
            pendingNGOs.map((ngo) => (
              <Card key={ngo.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>
                        {ngo.first_name} {ngo.last_name}
                      </CardTitle>
                      <CardDescription>{ngo.email}</CardDescription>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ngo.ngo_details && ngo.ngo_details.length > 0 && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Organization Name</p>
                        <p className="font-medium">{ngo.ngo_details[0]?.organization_name || "N/A"}</p>
                      </div>
                      {ngo.ngo_details[0]?.mission && (
                        <div>
                          <p className="text-sm text-muted-foreground">Mission</p>
                          <p className="text-sm line-clamp-2">{ngo.ngo_details[0].mission}</p>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={() => handleVerify(ngo.id, true)} className="gap-2">
                      <Check className="h-4 w-4" />
                      Verify
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleVerify(ngo.id, false)} className="gap-2">
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">All NGOs have been verified</p>
          )}
        </div>
      </div>

      {/* Verified NGOs */}
      <div>
        <h2 className="text-xl font-bold mb-4">Verified NGOs ({verifiedNGOs.length})</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Organization</th>
                    <th className="text-left py-3 px-4 font-medium">Contact</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedNGOs.map((ngo) => (
                    <tr key={ngo.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        {ngo.ngo_details?.[0]?.organization_name || `${ngo.first_name} ${ngo.last_name}`}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{ngo.email}</td>
                      <td className="py-3 px-4">
                        <Badge>Verified</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
