import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET() {
  const { data, error } = await supabaseServer
    .from("responses")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const {
    survey_id,
    rating,
    comment,
    source = "LINK",
    customer_full_name,
    customer_email,
    customer_phone,
  } = body ?? {}

  if (!survey_id || !rating) {
    return NextResponse.json({ error: "survey_id and rating are required" }, { status: 400 })
  }

  // Fetch survey to determine threshold and redirect
  const { data: survey, error: surveyError } = await supabaseServer
    .from("surveys")
    .select("id, redirect_url, rating_threshold, filter_enabled")
    .eq("id", survey_id)
    .single()

  if (surveyError || !survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 })
  }

  const threshold = survey.rating_threshold ?? 4
  const filterEnabled = survey.filter_enabled ?? true
  const shouldRedirect = filterEnabled ? Number(rating) >= Number(threshold) : false

  const status = shouldRedirect ? "REDIRECTED" : "CAPTURED"

  const insertPayload = {
    survey_id,
    rating,
    comment,
    status,
    source,
    customer_full_name,
    customer_email,
    customer_phone,
  }

  const { data, error } = await supabaseServer.from("responses").insert(insertPayload).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Traza de redirección (si aplica)
  if (shouldRedirect) {
    const hitPayload = { survey_id, source }
    const { error: hitError } = await supabaseServer.from("survey_hits").insert(hitPayload)
    if (hitError && (hitError as any).code !== "42P01") {
      // Si la tabla no existe, se ignora; cualquier otro error se registra en server logs
      console.error("Error logging survey_hit", hitError)
    }
  }

  return NextResponse.json(
    {
      data,
      redirect_url: shouldRedirect ? survey.redirect_url : null,
    },
    { status: 201 }
  )
}
