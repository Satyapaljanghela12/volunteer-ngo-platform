"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import Link from "next/link"

export default function GiveReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const volunteerId = searchParams.get("volunteerId")

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!volunteerId) return

    setLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from("reviews").insert({
          reviewer_id: user.id,
          reviewed_id: volunteerId,
          rating,
          comment: comment || null,
        })

        if (!error) {
          alert("Review submitted successfully!")
          router.push("/dashboard/ngo")
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <Link href="/dashboard/ngo" className="text-primary hover:underline text-sm">
        ← Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Give Volunteer a Review</h1>
        <p className="mt-2 text-muted-foreground">Share your experience working with this volunteer</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Review</CardTitle>
          <CardDescription>Help the community by sharing feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Rating */}
            <div className="space-y-3">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition"
                  >
                    <Star
                      className={`h-8 w-8 ${star <= rating ? "fill-accent text-accent" : "text-muted-foreground"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review (optional)</Label>
              <Textarea
                id="comment"
                placeholder="Tell others about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
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
