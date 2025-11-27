import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { opportunityId, coverLetter, collegeIdUrl } = await request.json()

    if (!opportunityId) {
      return NextResponse.json({ error: "opportunityId is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: opportunity, error: opportunityError } = await supabase
      .from("opportunities")
      .select("id, ngo_id, title")
      .eq("id", opportunityId)
      .single()

    if (opportunityError || !opportunity) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 })
    }

    const { data: existingApplication, error: existingError } = await supabase
      .from("applications")
      .select("id")
      .eq("opportunity_id", opportunityId)
      .eq("volunteer_id", user.id)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 })
    }

    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied to this opportunity." }, { status: 409 })
    }

    const { error: insertError } = await supabase.from("applications").insert({
      opportunity_id: opportunityId,
      volunteer_id: user.id,
      cover_letter: coverLetter || null,
      college_id_url: collegeIdUrl || null,
      status: "pending",
    })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Optional notification via messages table
    const notificationContent = `New application received for ${opportunity.title}`

    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: opportunity.ngo_id,
      content: notificationContent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

