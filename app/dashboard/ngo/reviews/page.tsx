"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import Link from "next/link"

export default function NGOReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReviews = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Fetch reviews for NGO
        const { data: ngoReviews } = await supabase
          .from("reviews")
          .select("*, reviewer:reviewer_id(first_name, last_name)")
          .eq("reviewed_id", user.id)
          .order("created_at", { ascending: false })

        setReviews(ngoReviews || [])

        if (ngoReviews && ngoReviews.length > 0) {
          const avgRating = ngoReviews.reduce((sum, r) => sum + r.rating, 0) / ngoReviews.length
          setStats({
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: ngoReviews.length,
          })
        }
      }

      setLoading(false)
    }

    loadReviews()
  }, [])

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <Link href="/dashboard/ngo" className="text-primary hover:underline text-sm">
        ← Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Organization Reviews</h1>
        <p className="mt-2 text-muted-foreground">Feedback from volunteers on your organization</p>
      </div>

      {/* Rating Summary */}
      {stats.totalReviews > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Organization Rating</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-8">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-foreground">{stats.averageRating}</span>
                <span className="text-lg text-muted-foreground">/5</span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(stats.averageRating) ? "fill-accent text-accent" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {review.reviewer?.first_name} {review.reviewer?.last_name}
                    </CardTitle>
                    <CardDescription>{new Date(review.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              {review.comment && (
                <CardContent>
                  <p className="text-foreground">{review.comment}</p>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No reviews yet. Your organization will receive reviews from volunteers!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
