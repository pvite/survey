"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronDown, ChevronUp, ArrowLeft, Star, Check } from "lucide-react"

/* Mock: encuestas existentes */
const existingSurveys: Record<string, {
  surveyName: string
  enableFilter: boolean
  redirectUrl: string
  positiveThreshold: string
  logoType: string
  publicTitle: string
  publicInstruction: string
  positiveMessage: string
  negativeMessage: string
  feedbackFormTitle: string
  feedbackPlaceholder: string
  status: string
}> = {
  "1": {
    surveyName: "Satisfaccion Cliente - Centro",
    enableFilter: true,
    redirectUrl: "https://g.co/kgs/EjemploGoogle",
    positiveThreshold: "4-5",
    logoType: "default",
    publicTitle: "Que tan satisfecho esta con su experiencia?",
    publicInstruction: "Toque una estrella para calificar",
    positiveMessage: "Gracias! Su opinion nos ayuda mucho.",
    negativeMessage: "Lamentamos que su experiencia no haya sido perfecta",
    feedbackFormTitle: "Ayudenos a mejorar contandonos que paso.",
    feedbackPlaceholder: "Que podemos mejorar?",
    status: "live",
  },
  "2": {
    surveyName: "Feedback Sucursal Norte",
    enableFilter: true,
    redirectUrl: "https://g.co/kgs/Norte",
    positiveThreshold: "4-5",
    logoType: "client",
    publicTitle: "Como fue tu visita hoy?",
    publicInstruction: "Tu opinion nos importa",
    positiveMessage: "Muchas gracias por tu tiempo!",
    negativeMessage: "Sentimos mucho que no haya sido una buena experiencia",
    feedbackFormTitle: "Cuentanos que podemos hacer mejor.",
    feedbackPlaceholder: "Escribe tu comentario aqui...",
    status: "live",
  },
  "3": {
    surveyName: "Nuevo Local - Providencia",
    enableFilter: true,
    redirectUrl: "https://g.co/kgs/Providencia",
    positiveThreshold: "4-5",
    logoType: "default",
    publicTitle: "Que tan satisfecho esta con su experiencia?",
    publicInstruction: "Toque una estrella para calificar",
    positiveMessage: "Gracias! Su opinion nos ayuda mucho.",
    negativeMessage: "Lamentamos que su experiencia no haya sido perfecta",
    feedbackFormTitle: "Ayudenos a mejorar contandonos que paso.",
    feedbackPlaceholder: "Que podemos mejorar?",
    status: "live",
  },
}

export default function EditSurveyPage() {
  const params = useParams()
  const id = params.id as string
  const survey = existingSurveys[id]

  const [formData, setFormData] = useState(
    survey || {
      surveyName: "",
      enableFilter: false,
      redirectUrl: "",
      positiveThreshold: "4-5",
      logoType: "default",
      publicTitle: "Que tan satisfecho esta con su experiencia?",
      publicInstruction: "Toque una estrella para calificar",
      positiveMessage: "Gracias! Su opinion nos ayuda mucho.",
      negativeMessage: "Lamentamos que su experiencia no haya sido perfecta",
      feedbackFormTitle: "Ayudenos a mejorar contandonos que paso.",
      feedbackPlaceholder: "Que podemos mejorar?",
      status: "live",
    }
  )

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [saved, setSaved] = useState(false)
  const [previewRating, setPreviewRating] = useState<number | null>(null)
  const [previewHover, setPreviewHover] = useState<number | null>(null)

  const threshold = formData.positiveThreshold === "5" ? 5 : 4

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    setSaved(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!survey) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F9FAFB] p-6">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Encuesta no encontrada</p>
          <Link href="/" className="mt-3 inline-block text-sm text-[#007AFF] hover:underline">
            Volver a Encuestas
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-6 pb-32 md:pb-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Editar Encuesta</h1>
            <p className="text-sm text-gray-500">{formData.surveyName}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Formulario (3 cols) */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-[20px] bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-base font-semibold text-gray-900">Configuracion</h2>

                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label htmlFor="surveyName" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Nombre de la Encuesta
                    </label>
                    <input
                      type="text"
                      id="surveyName"
                      required
                      value={formData.surveyName}
                      onChange={(e) => handleChange("surveyName", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                      placeholder="Ej: Satisfaccion Cliente Centro"
                    />
                  </div>

                  {/* Toggle filtro */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Filtrar resenas antes de redirigir
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleChange("enableFilter", !formData.enableFilter)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          formData.enableFilter ? "bg-[#007AFF]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                            formData.enableFilter ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm text-gray-600">{formData.enableFilter ? "Activado" : "Desactivado"}</span>
                    </div>
                  </div>

                  {/* URL + Umbral (condicional) */}
                  {formData.enableFilter && (
                    <>
                      <div>
                        <label htmlFor="redirectUrl" className="mb-1.5 block text-sm font-medium text-gray-700">
                          URL de Redireccion
                        </label>
                        <input
                          type="url"
                          id="redirectUrl"
                          required
                          value={formData.redirectUrl}
                          onChange={(e) => handleChange("redirectUrl", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                          placeholder="https://g.co/kgs/..."
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Umbral de Puntuacion
                        </label>
                        <div className="flex gap-4">
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              name="positiveThreshold"
                              value="4-5"
                              checked={formData.positiveThreshold === "4-5"}
                              onChange={(e) => handleChange("positiveThreshold", e.target.value)}
                              className="h-4 w-4 border-gray-300 text-[#007AFF] focus:ring-[#007AFF]"
                            />
                            <span className="text-sm text-gray-700">4 y 5 Estrellas</span>
                          </label>
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              name="positiveThreshold"
                              value="5"
                              checked={formData.positiveThreshold === "5"}
                              onChange={(e) => handleChange("positiveThreshold", e.target.value)}
                              className="h-4 w-4 border-gray-300 text-[#007AFF] focus:ring-[#007AFF]"
                            />
                            <span className="text-sm text-gray-700">Solo 5 Estrellas</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Logo */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Logo de Marca</label>
                    <div className="flex gap-4">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="logoType"
                          value="default"
                          checked={formData.logoType === "default"}
                          onChange={(e) => handleChange("logoType", e.target.value)}
                          className="h-4 w-4 border-gray-300 text-[#007AFF] focus:ring-[#007AFF]"
                        />
                        <span className="text-sm text-gray-700">Logo por Defecto</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="logoType"
                          value="client"
                          checked={formData.logoType === "client"}
                          onChange={(e) => handleChange("logoType", e.target.value)}
                          className="h-4 w-4 border-gray-300 text-[#007AFF] focus:ring-[#007AFF]"
                        />
                        <span className="text-sm text-gray-700">Logo de Cliente</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avanzado */}
              <div className="rounded-[20px] bg-white p-6 shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <h2 className="text-base font-semibold text-gray-900">Personalizacion de Textos</h2>
                  {showAdvanced ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="mt-5 space-y-4">
                    <div>
                      <label htmlFor="publicTitle" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Titulo de la Encuesta
                      </label>
                      <input
                        type="text"
                        id="publicTitle"
                        value={formData.publicTitle}
                        onChange={(e) => handleChange("publicTitle", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="publicInstruction" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Instruccion
                      </label>
                      <input
                        type="text"
                        id="publicInstruction"
                        value={formData.publicInstruction}
                        onChange={(e) => handleChange("publicInstruction", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="positiveMessage" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Mensaje de Agradecimiento
                      </label>
                      <input
                        type="text"
                        id="positiveMessage"
                        value={formData.positiveMessage}
                        onChange={(e) => handleChange("positiveMessage", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="negativeMessage" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Titulo de Feedback Interno
                      </label>
                      <input
                        type="text"
                        id="negativeMessage"
                        value={formData.negativeMessage}
                        onChange={(e) => handleChange("negativeMessage", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="feedbackFormTitle" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Subtitulo del Formulario
                      </label>
                      <textarea
                        id="feedbackFormTitle"
                        rows={2}
                        value={formData.feedbackFormTitle}
                        onChange={(e) => handleChange("feedbackFormTitle", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="feedbackPlaceholder" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Placeholder del Feedback
                      </label>
                      <input
                        type="text"
                        id="feedbackPlaceholder"
                        value={formData.feedbackPlaceholder}
                        onChange={(e) => handleChange("feedbackPlaceholder", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`w-full rounded-xl px-6 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                  saved
                    ? "bg-emerald-500 text-white"
                    : "bg-[#007AFF] text-white hover:bg-[#0051D5]"
                }`}
              >
                {saved ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4" />
                    Cambios guardados
                  </span>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </form>
          </div>

          {/* Preview (2 cols) */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Vista previa</p>

              <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
                {/* Header preview */}
                <div className="border-b border-gray-100 px-4 py-2.5">
                  <div className="mx-auto h-1 w-10 rounded-full bg-gray-200" />
                </div>

                <div className="px-6 py-8">
                  {/* Logo */}
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-md">
                      <span className="text-3xl font-bold text-white">
                        {formData.logoType === "client" ? "C" : "7"}
                      </span>
                    </div>
                  </div>

                  {/* Titulo */}
                  <h3 className="mb-2 text-center text-lg font-light leading-snug text-gray-900">
                    {formData.publicTitle}
                  </h3>
                  <p className="mb-6 text-center text-xs text-gray-500">
                    {formData.publicInstruction}
                  </p>

                  {/* Estrellas interactivas */}
                  <div className="mb-4 flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setPreviewRating(starValue)}
                        onMouseEnter={() => setPreviewHover(starValue)}
                        onMouseLeave={() => setPreviewHover(null)}
                        className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          size={32}
                          className={`transition-all duration-150 ${
                            (previewHover !== null && starValue <= previewHover) ||
                            (previewRating !== null && starValue <= previewRating)
                              ? "fill-[#007AFF] stroke-[#007AFF]"
                              : "fill-none stroke-[#007AFF]"
                          }`}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Resultado del preview */}
                  {previewRating && (
                    <div className="mt-4 rounded-xl bg-gray-50 p-4 text-center">
                      {previewRating >= threshold ? (
                        <>
                          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                            <Check className="h-5 w-5 text-emerald-600" />
                          </div>
                          <p className="text-sm font-medium text-emerald-700">
                            {formData.positiveMessage}
                          </p>
                          {formData.enableFilter && (
                            <p className="mt-1 text-[11px] text-gray-400">
                              Redirige a Google
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-gray-700">
                            {formData.negativeMessage}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {formData.feedbackFormTitle}
                          </p>
                          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-2">
                            <p className="text-left text-xs text-gray-300">{formData.feedbackPlaceholder}</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {!previewRating && (
                    <p className="mt-2 text-center text-[11px] text-gray-300">
                      Toca una estrella para ver el flujo
                    </p>
                  )}
                </div>
              </div>

              {/* Info de flujo */}
              <div className="mt-4 rounded-[16px] border border-gray-100 bg-white p-4">
                <p className="mb-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Flujo configurado</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                      {threshold}+
                    </span>
                    <span>
                      {formData.enableFilter ? "Redirige a Google" : "Sin redireccion"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                      {"<"}{threshold}
                    </span>
                    <span>Muestra formulario de feedback interno</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
