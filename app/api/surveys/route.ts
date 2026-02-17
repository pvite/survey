import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET() {
  const { data, error } = await supabaseServer
    .from("surveys")
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
    name,
    redirect_url,
    rating_threshold = 4,
    filter_enabled = true,
    collect_name = false,
    collect_email = false,
    collect_phone = false,
    is_contact_required = false,
    title_text,
    instruction_text,
    thanks_message,
  } = body ?? {}

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }

  const baseSlug =
    body?.qr_slug ||
    name
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const qr_slug = await ensureUniqueSlug(baseSlug)

  const insertPayload = {
    name,
    qr_slug,
    status: "live",
    redirect_url,
    rating_threshold,
    filter_enabled,
    collect_name,
    collect_email,
    collect_phone,
    is_contact_required,
    title_text,
    instruction_text,
    thanks_message,
  }

  let { data, error } = await supabaseServer.from("surveys").insert(insertPayload).select().single()

  // Si la columna status no existe aún, reintenta sin status.
  if (error && (error as any).code === "42703") {
    const fallbackPayload = { ...insertPayload }
    delete (fallbackPayload as any).status
    ;({ data, error } = await supabaseServer.from("surveys").insert(fallbackPayload).select().single())
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let candidate = base || crypto.randomUUID().slice(0, 8)
  let suffix = 0

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await supabaseServer
      .from("surveys")
      .select("id")
      .eq("qr_slug", candidate)
      .maybeSingle()

    if (error) {
      // si falla la consulta, devolvemos el base para no bloquear
      return candidate
    }

    if (!data) return candidate

    suffix += 1
    candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`.replace(/-+/g, "-")
  }
}
