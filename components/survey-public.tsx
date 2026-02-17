"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Star, Loader2 } from "lucide-react"

type SurveyPublicProps = {
  survey: {
    id: string
    name: string
    qr_slug: string
    title_text?: string | null
    instruction_text?: string | null
    thanks_message?: string | null
    rating_threshold?: number | null
    filter_enabled?: boolean | null
    redirect_url?: string | null
    collect_name?: boolean | null
    collect_email?: boolean | null
    collect_phone?: boolean | null
    is_contact_required?: boolean | null
  }
}

export function SurveyPublic({ survey }: SurveyPublicProps) {
  const searchParams = useSearchParams()
  const sourceParam = useMemo(() => searchParams.get("source") || "LINK", [searchParams])

  const [rating, setRating] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [trackedOpen, setTrackedOpen] = useState(false)

  useEffect(() => {
    if (trackedOpen || !survey?.id) return
    setTrackedOpen(true)
    fetch(`/api/surveys/${survey.id}/open?source=${encodeURIComponent(sourceParam)}`, { method: "POST" }).catch(() => {
      /* ignore */
    })
  }, [survey?.id, trackedOpen, sourceParam])

  const requiredContact = survey.is_contact_required
  const needName = survey.collect_name
  const needEmail = survey.collect_email
  const needPhone = survey.collect_phone

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) {
      setError("Selecciona una calificación")
      return
    }
    if (requiredContact) {
      if ((needName && !name) || (needEmail && !email) || (needPhone && !phone)) {
        setError("Completa los datos requeridos")
        return
      }
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          survey_id: survey.id,
          rating,
          comment,
          source: sourceParam,
          customer_full_name: name || null,
          customer_email: email || null,
          customer_phone: phone || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "No se pudo enviar")

      if (json.redirect_url) {
        window.location.href = json.redirect_url
        return
      }
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-md w-full rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{survey.thanks_message || "¡Gracias por tu opinión!"}</h2>
        <p className="mt-2 text-sm text-gray-500">Tu feedback nos ayuda a mejorar.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md w-full rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
      <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-center">
        <div className="h-1 w-10 rounded-full bg-gray-200" />
      </div>

      <form className="px-6 py-8 space-y-5" onSubmit={onSubmit}>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-light leading-snug text-gray-900">{survey.title_text || survey.name}</h3>
          <p className="text-xs text-gray-500">{survey.instruction_text || "Toca una estrella para calificar"}</p>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(star)}
              className="transition-transform active:scale-95"
            >
              <Star
                className={`h-9 w-9 ${
                  (hover ?? rating ?? 0) >= star ? "fill-amber-400 text-amber-400" : "text-gray-200"
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
          placeholder="Cuéntanos más (opcional)"
          rows={3}
        />

        {(needName || needEmail || needPhone) && (
          <div className="space-y-3">
            {needName && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={requiredContact}
                placeholder="Nombre completo"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              />
            )}
            {needEmail && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={requiredContact}
                placeholder="Correo"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              />
            )}
            {needPhone && (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={requiredContact}
                placeholder="Teléfono"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              />
            )}
          </div>
        )}

        {error && <p className="text-sm text-rose-600 text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[#007AFF] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0051D5] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Enviar reseña
        </button>
      </form>
    </div>
  )
}
