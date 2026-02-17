// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4"
import QRCode from "https://esm.sh/qrcode@1.5.3"

// Built-in envs: SUPABASE_URL (provided by platform) and custom SERVICE_ROLE_KEY, SITE_URL set as secrets.
const supabaseUrl = Deno.env.get("SUPABASE_URL")
const serviceRole = Deno.env.get("SERVICE_ROLE_KEY") // set via `supabase secrets set SERVICE_ROLE_KEY=...`
const publicSite = Deno.env.get("SITE_URL") || Deno.env.get("PUBLIC_SITE_URL") // allow either name

if (!supabaseUrl || !serviceRole) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY")
}

const supabase = createClient(supabaseUrl!, serviceRole!)

function buildSurveyUrl(slug: string) {
  const base = publicSite || supabaseUrl || ""
  return `${base.replace(/\/$/, "")}/s/${slug}`
}

serve(async (req) => {
  const url = new URL(req.url)
  const slug = url.searchParams.get("slug") || url.searchParams.get("id")
  if (!slug) return new Response("slug required", { status: 400 })

  const format = (url.searchParams.get("format") || "png").toLowerCase()
  const size = Math.min(Math.max(Number(url.searchParams.get("size")) || 320, 120), 800)

  const { data: survey, error } = await supabase
    .from("surveys")
    .select("id, short_url, qr_slug")
    .or(`short_url.eq.${slug},qr_slug.eq.${slug},id.eq.${slug}`)
    .limit(1)
    .maybeSingle()

  if (error || !survey) return new Response("not found", { status: 404 })

  const finalSlug = survey.short_url || survey.qr_slug || survey.id
  const target = buildSurveyUrl(finalSlug)

  try {
    if (format === "svg") {
      const svg = await QRCode.toString(target, { type: "svg", margin: 1, width: size })
      return new Response(svg, { status: 200, headers: { "Content-Type": "image/svg+xml" } })
    }
    const png = await QRCode.toBuffer(target, { type: "png", margin: 1, width: size })
    return new Response(png, { status: 200, headers: { "Content-Type": "image/png" } })
  } catch (e: any) {
    return new Response(e?.message ?? "qr error", { status: 500 })
  }
})
