import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const url = new URL(request.url)
  const idFromPath = params?.id || url.searchParams.get("id") || url.pathname.split("/").filter(Boolean).pop() || ""
  const id = idFromPath || (await request.json().catch(() => ({ id: "" }))).id

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

  // source opcional para distinguir QR/link/etc
  const source = url.searchParams.get("source") || "LINK"

  const { error } = await supabaseServer.from("survey_opens").insert({ survey_id: id, source })

  // Si la tabla no existe aún, no rompemos el flujo
  if (error && (error as any).code !== "42P01") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
