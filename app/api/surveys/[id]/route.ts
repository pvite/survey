import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // Tomamos id desde params o desde la URL como respaldo.
  const url = new URL(request.url)
  const idFromPath =
    params?.id ||
    url.searchParams.get("id") ||
    url.pathname.split("/").filter(Boolean).pop() ||
    ""
  const body = await request.json().catch(() => ({}))

  const id = body?.id || idFromPath
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

  const { status } = body ?? {}

  if (!status) return NextResponse.json({ error: "status is required" }, { status: 400 })

  const { data, error } = await supabaseServer
    .from("surveys")
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    // Si la columna status no existe, degradamos a usar filter_enabled como switch on/off
    if ((error as any).code === "42703") {
      const asBool = status === "live"
      const { data: dataFallback, error: err2 } = await supabaseServer
        .from("surveys")
        .update({ filter_enabled: asBool })
        .eq("id", id)
        .select()
        .single()
      if (err2) return NextResponse.json({ error: err2.message }, { status: 500 })
      return NextResponse.json({ data: dataFallback })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
