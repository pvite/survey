import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabaseServer } from "@/lib/supabase-server"
import { SurveyPublic } from "@/components/survey-public"

type Params = { slug: string }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const survey = await fetchSurvey(params.slug)
  if (!survey) return { title: "Encuesta" }
  return {
    title: survey.title_text || survey.name || "Encuesta",
    description: survey.instruction_text || "Califica tu experiencia",
  }
}

async function fetchSurvey(slug: string) {
  const { data, error } = await supabaseServer
    .from("surveys")
    .select("*")
    .or(`qr_slug.eq.${slug},id.eq.${slug}`)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Error fetching survey", error)
    return null
  }
  return data
}

export default async function PublicSurveyPage({ params }: { params: Params }) {
  const survey = await fetchSurvey(params.slug)
  if (!survey) return notFound()

  const isFrozen = (survey as any).status
    ? (survey as any).status !== "live"
    : (survey as any).filter_enabled === false

  if (isFrozen) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Encuesta pausada</h1>
          <p className="mt-2 text-sm text-gray-500">El link no está activo en este momento.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-10">
      <SurveyPublic survey={survey as any} />
    </main>
  )
}
