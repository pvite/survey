import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

function buildSurveyUrl(req: Request, slug: string) {
  const url = new URL(req.url)
  const host = url.host
  const protocol = url.protocol.replace(":", "") || "https"
  const base = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}//${host}`
  return `${base}/s/${slug}`
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const idOrSlug = params.id
  if (!idOrSlug) return NextResponse.json({ error: "id is required" }, { status: 400 })

  const { data: survey, error } = await supabaseServer
    .from("surveys")
    .select("id, qr_slug")
    .or(`id.eq.${idOrSlug},qr_slug.eq.${idOrSlug}`)
    .limit(1)
    .maybeSingle()

  if (error || !survey) {
    return NextResponse.json({ error: "survey not found" }, { status: 404 })
  }

  const slug = survey.qr_slug || survey.id
  const surveyUrl = buildSurveyUrl(request, slug)

  const size = Math.min(Math.max(Number(new URL(request.url).searchParams.get("size")) || 320, 120), 800)
  const qrProvider = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(surveyUrl)}`

  // Redirigimos al PNG del proveedor externo
  return NextResponse.redirect(qrProvider, { status: 302 })
}
