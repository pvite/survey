"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Star, Check, ArrowLeft, QrCode, Copy, MessageSquare } from "lucide-react"

export default function AdminPage() {
  const [formData, setFormData] = useState({
    surveyName: "",
    enableFilter: true,
    redirectUrl: "",
    positiveThreshold: "4-5",
    publicTitle: "Que tan satisfecho estas con tu experiencia?",
    publicInstruction: "Toca una estrella para calificar",
    positiveMessage: "Gracias! Tu opinion nos ayuda mucho.",
    negativeMessage: "Lamentamos que tu experiencia no haya sido perfecta. Cuentanos que paso.",
  })

  const [created, setCreated] = useState(false)
  const [previewRating, setPreviewRating] = useState<number | null>(null)
  const [previewHover, setPreviewHover] = useState<number | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const threshold = formData.positiveThreshold === "5" ? 5 : 4
  const surveySlug = formData.surveyName.toLowerCase().replace(/\s+/g, "-") || "nueva-encuesta"
  const surveyUrl = `https://reviews.app/s/${surveySlug}`

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.surveyName.trim()) {
      setStatusMessage("Por favor ingresa un nombre para la encuesta")
      setTimeout(() => setStatusMessage(null), 3000)
      return
    }
    setStatusMessage("Encuesta creada exitosamente")
    setTimeout(() => {
      setCreated(true)
    }, 800)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  /* Post-creacion */
  if (created) {
    return (
      <main className="min-h-screen bg-[#f8fafc] p-6 pb-32 md:pb-6">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-7 w-7 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Encuesta creada</h1>
            <p className="mt-1 text-sm text-gray-500">{formData.surveyName}</p>
          </div>

          <div className="space-y-3">
            <div className="rounded-[16px] bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">Enlace de la encuesta</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 truncate rounded-[12px] bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
                  {surveyUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`flex h-11 w-11 items-center justify-center rounded-[12px] transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    copiedLink
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-2 rounded-[16px] bg-white p-5 shadow-sm transition-all hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                  <Copy className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">Copiar</span>
              </button>

              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Queremos conocer tu opinion: ${surveyUrl}`)}`, "_blank")}
                className="flex flex-col items-center gap-2 rounded-[16px] bg-white p-5 shadow-sm transition-all hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">WhatsApp</span>
              </button>

              <button className="flex flex-col items-center gap-2 rounded-[16px] bg-white p-5 shadow-sm transition-all hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
                  <QrCode className="h-5 w-5 text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">Ver QR</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href="/"
              className="flex flex-1 items-center justify-center rounded-[12px] border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Ir a Encuestas
            </Link>
            <Link
              href="/"
              className="flex flex-1 items-center justify-center rounded-[12px] bg-emerald-600 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Ir a Inicio
            </Link>
          </div>
        </div>
      </main>
    )
  }

  /* Editor principal */
  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 pb-32 md:pb-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-gray-200 bg-white text-gray-500 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Nueva Encuesta</h1>
            <p className="text-sm leading-relaxed text-gray-500">Edita directamente sobre la tarjeta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre de la encuesta - campo minimal */}
          <div className="mb-4">
            <input
              type="text"
              value={formData.surveyName}
              onChange={(e) => handleChange("surveyName", e.target.value)}
              placeholder="Nombre de la encuesta (ej: Satisfaccion Centro)"
              className="w-full rounded-[12px] border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              style={{ lineHeight: 1.5 }}
            />
          </div>

          {/* Tarjeta de encuesta - Editor principal */}
          <div className="overflow-hidden rounded-[16px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            {/* Barra superior estilo mobile */}
            <div className="flex items-center justify-center border-b border-gray-100 py-3">
              <div className="h-1 w-10 rounded-full bg-gray-200" />
            </div>

            <div className="px-6 py-8 md:px-10 md:py-10">
              {/* Logo */}
              <div className="mb-8 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[14px] bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                  <span className="text-3xl font-bold text-white">R</span>
                </div>
              </div>

              {/* Titulo editable in-situ */}
              <div className="group mb-2">
                <input
                  type="text"
                  value={formData.publicTitle}
                  onChange={(e) => handleChange("publicTitle", e.target.value)}
                  className="w-full border-2 border-transparent bg-transparent text-center text-xl font-light text-gray-900 transition-all placeholder:text-gray-300 hover:border-dashed hover:border-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-0"
                  style={{ lineHeight: 1.5 }}
                />
              </div>

              {/* Instruccion editable in-situ */}
              <div className="group mb-8">
                <input
                  type="text"
                  value={formData.publicInstruction}
                  onChange={(e) => handleChange("publicInstruction", e.target.value)}
                  className="w-full border-2 border-transparent bg-transparent text-center text-sm text-gray-500 transition-all placeholder:text-gray-300 hover:border-dashed hover:border-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-0"
                  style={{ lineHeight: 1.5 }}
                />
              </div>

              {/* Estrellas - fijas y prominentes */}
              <div className="mb-6 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setPreviewRating(starValue)}
                    onMouseEnter={() => setPreviewHover(starValue)}
                    onMouseLeave={() => setPreviewHover(null)}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    aria-label={`Calificar ${starValue} estrella${starValue > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={32}
                      className={`transition-all duration-150 ${
                        (previewHover !== null && starValue <= previewHover) ||
                        (previewRating !== null && starValue <= previewRating)
                          ? "fill-amber-400 stroke-amber-400"
                          : "fill-none stroke-gray-300"
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>

              {/* Resultado del preview */}
              {previewRating && (
                <div className="animate-fade-in mt-4 rounded-[12px] bg-gray-50 p-5 text-center">
                  {previewRating >= threshold ? (
                    <>
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-6 w-6 text-emerald-600" />
                      </div>
                      <input
                        type="text"
                        value={formData.positiveMessage}
                        onChange={(e) => handleChange("positiveMessage", e.target.value)}
                        className="w-full border-2 border-transparent bg-transparent text-center text-sm font-medium text-emerald-700 transition-all hover:border-dashed hover:border-emerald-300 focus:border-emerald-500 focus:outline-none"
                      />
                      {formData.enableFilter && (
                        <p className="mt-2 text-xs text-gray-400">
                          Redirige a Google para dejar resena publica
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={formData.negativeMessage}
                        onChange={(e) => handleChange("negativeMessage", e.target.value)}
                        className="w-full border-2 border-transparent bg-transparent text-center text-sm font-medium text-gray-700 transition-all hover:border-dashed hover:border-gray-300 focus:border-emerald-500 focus:outline-none"
                      />
                      <div className="mt-4 rounded-[10px] border border-gray-200 bg-white px-3 py-2.5">
                        <p className="text-left text-xs text-gray-400">Escribe tu comentario aqui...</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {!previewRating && (
                <p className="mt-4 text-center text-xs text-gray-300">
                  Toca una estrella para previsualizar el flujo
                </p>
              )}
            </div>
          </div>

          {/* Configuracion compacta */}
          <div className="mt-5 rounded-[16px] border border-gray-100 bg-white p-5">
            <div className="space-y-4">
              {/* Toggle filtro */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Filtrar antes de redirigir</p>
                  <p className="text-xs text-gray-400">Solo calificaciones altas van a Google</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("enableFilter", !formData.enableFilter)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    formData.enableFilter ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={formData.enableFilter}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      formData.enableFilter ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* URL + Umbral (condicional) */}
              {formData.enableFilter && (
                <>
                  <div className="border-t border-gray-100 pt-4">
                    <label htmlFor="redirectUrl" className="mb-1.5 block text-sm font-medium text-gray-700">
                      URL de Google Business
                    </label>
                    <input
                      type="url"
                      id="redirectUrl"
                      value={formData.redirectUrl}
                      onChange={(e) => handleChange("redirectUrl", e.target.value)}
                      className="w-full rounded-[10px] border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="https://g.co/kgs/..."
                      style={{ lineHeight: 1.5 }}
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">Umbral de redireccion</p>
                    <div className="flex gap-3">
                      <label className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-gray-200 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-emerald-500">
                        <input
                          type="radio"
                          name="positiveThreshold"
                          value="4-5"
                          checked={formData.positiveThreshold === "4-5"}
                          onChange={(e) => handleChange("positiveThreshold", e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-sm text-gray-700">4 y 5 estrellas</span>
                      </label>
                      <label className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-gray-200 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-emerald-500">
                        <input
                          type="radio"
                          name="positiveThreshold"
                          value="5"
                          checked={formData.positiveThreshold === "5"}
                          onChange={(e) => handleChange("positiveThreshold", e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-sm text-gray-700">Solo 5 estrellas</span>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Estado de mensaje */}
          {statusMessage && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 rounded-[12px] bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700"
            >
              {statusMessage}
            </div>
          )}

          {/* Boton crear */}
          <button
            type="submit"
            className="mt-5 flex h-12 w-full items-center justify-center rounded-[12px] bg-emerald-600 text-base font-semibold text-white transition-all hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Crear Encuesta
          </button>
        </form>
      </div>
    </main>
  )
}
