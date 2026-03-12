"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Share2,
  Star,
  MessageSquare,
  Copy,
  Check,
  QrCode,
  X,
  Printer,
  ArrowRight,
} from "lucide-react"

/* ── Datos mock ── */
const surveys = [
  {
    id: "1",
    name: "Satisfaccion Cliente - Centro",
    status: "live" as const,
    responses: 142,
    avgRating: 4.6,
    minStars: 4,
    redirectUrl: "google.com/business/napoles",
    link: "https://reviews.app/s/satisfaccion-cliente",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Feedback Delivery",
    status: "frozen" as const,
    responses: 87,
    avgRating: 3.8,
    minStars: 4,
    redirectUrl: "google.com/business/delivery",
    link: "https://reviews.app/s/feedback-delivery",
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    name: "Nuevo Local - Providencia",
    status: "live" as const,
    responses: 0,
    avgRating: 0,
    minStars: 4,
    redirectUrl: "google.com/business/providencia",
    link: "https://reviews.app/s/nuevo-local-providencia",
    createdAt: "2025-02-16",
  },
]

/* Datos de impacto mock */
const impactData = {
  "1": { todayRedirects: 5, weekRedirects: 23, totalRedirects: 89, todayResponses: 8 },
  "2": { todayRedirects: 0, weekRedirects: 12, totalRedirects: 45, todayResponses: 2 },
  "3": { todayRedirects: 0, weekRedirects: 0, totalRedirects: 0, todayResponses: 0 },
} as Record<string, { todayRedirects: number; weekRedirects: number; totalRedirects: number; todayResponses: number }>

const MAX_ACTIVE_SURVEYS = 3

function getAvgColor(avg: number) {
  if (avg >= 4) return "text-emerald-600"
  if (avg >= 3) return "text-amber-600"
  return "text-rose-600"
}

/* Google icon SVG inline */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

/* ── Survey Card (Rediseniada) ── */
function SurveyCard({
  survey,
  isActive,
  onClick,
  onQR,
}: {
  survey: (typeof surveys)[0]
  isActive: boolean
  onClick: () => void
  onQR: () => void
}) {
  const isLive = survey.status === "live"
  const hasResponses = survey.responses > 0
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(survey.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Queremos conocer tu opinion: ${survey.link}`)}`,
      "_blank"
    )
  }

  return (
    <motion.div
      onClick={onClick}
  className="relative w-full cursor-pointer select-none overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm"
      animate={{
        scale: isActive ? 1 : 0.95,
        opacity: isActive ? 1 : 0.55,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header: nombre + estado + google */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[15px] font-semibold text-gray-900">{survey.name}</h3>
              {survey.redirectUrl && (
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50" title="Redireccion a Google activada">
                  <GoogleIcon className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                isLive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {isLive ? (
                  <>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Live
                  </>
                ) : "Pausada"}
              </span>
              <span className="text-[11px] text-gray-400">
                {survey.responses} respuesta{survey.responses !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Promedio hero */}
        <div className="mt-4 flex items-end gap-3">
          {hasResponses ? (
            <>
              <span className={`text-5xl font-bold leading-none tracking-tight ${getAvgColor(survey.avgRating)}`}>
                {survey.avgRating}
              </span>
              <div className="mb-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.round(survey.avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold leading-none text-gray-200">--</span>
              <p className="mb-1 text-xs text-gray-400">Sin calificaciones</p>
            </div>
          )}
        </div>
      </div>

      {/* CTAs - solo visible cuando esta activa */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="border-t border-gray-100 px-5 py-3"
        >
          <div className="flex items-center gap-4">
            {/* QR */}
            <button
              onClick={(e) => { e.stopPropagation(); onQR() }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007AFF] text-white transition-all hover:bg-[#0051D5] active:scale-90"
              title="Ver QR"
            >
              <QrCode className="h-5 w-5" />
            </button>
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-white text-green-600 transition-all hover:bg-green-50 active:scale-90"
              title="Enviar por WhatsApp"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            {/* Copiar link */}
            <button
              onClick={handleCopy}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-90 ${
                copied
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
              title={copied ? "Copiado" : "Copiar enlace"}
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
          <Link
            href={`/responses?survey=${survey.id}`}
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-50 py-2.5 text-[13px] font-medium text-gray-500 transition-all hover:bg-gray-100 active:scale-95"
          >
            Ver respuestas
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}

/* ── QR Modal ── */
function QRModal({
  isOpen,
  onClose,
  survey,
}: {
  isOpen: boolean
  onClose: () => void
  survey: (typeof surveys)[0] | null
}) {
  return (
    <AnimatePresence>
      {isOpen && survey && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="w-full max-w-sm rounded-[24px] bg-white p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Codigo QR</h3>
                  <p className="text-sm text-gray-500">{survey.name}</p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="mb-6 flex justify-center">
                <div className="rounded-[20px] border border-gray-100 bg-[#F9FAFB] p-6">
                  <QrCode className="h-44 w-44 text-gray-800" strokeWidth={1} />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button className="flex-1 rounded-xl bg-[#007AFF] px-4 py-3 text-sm font-medium text-white hover:bg-[#0051D5]">
                  Descargar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Sharing Sheet (Drawer) ── */
function SharingSheet({
  isOpen,
  onClose,
  survey,
}: {
  isOpen: boolean
  onClose: () => void
  survey: (typeof surveys)[0] | null
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    if (survey) {
      navigator.clipboard.writeText(survey.link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [survey])

  return (
    <AnimatePresence>
      {isOpen && survey && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white shadow-2xl"
            style={{ maxHeight: "85vh" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-10 rounded-full bg-gray-300" />
            </div>

            <div className="overflow-y-auto px-6 pb-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Compartir Encuesta</h3>
                  <p className="text-sm text-gray-500">{survey.name}</p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* QR */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 25 }}
                className="mb-6 flex justify-center"
              >
                <div className="rounded-[20px] border border-gray-100 bg-[#F9FAFB] p-6">
                  <QrCode className="h-48 w-48 text-gray-800" strokeWidth={1} />
                </div>
              </motion.div>

              {/* Copiar enlace */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mb-4"
              >
                <button
                  onClick={handleCopy}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all ${
                    copied
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    copied ? "bg-emerald-500" : "bg-[#007AFF]"
                  }`}>
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                          <Check className="h-4 w-4 text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="h-4 w-4 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className={`text-sm font-medium ${copied ? "text-emerald-700" : "text-gray-900"}`}>
                      {copied ? "Enlace copiado" : "Copiar enlace"}
                    </p>
                    <p className="truncate text-[12px] text-gray-400">{survey.link}</p>
                  </div>
                </button>
              </motion.div>

              {/* Acciones */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="space-y-2"
              >
                <button
                  onClick={() => {
                    window.open(
                      `https://wa.me/56988090687?text=${encodeURIComponent(`Queremos conocer tu opinion: ${survey.link}`)}`,
                      "_blank"
                    )
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-left transition-all hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Enviar por WhatsApp</p>
                    <p className="text-[12px] text-gray-400">Abre conversacion con el enlace</p>
                  </div>
                </button>

                <button className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-left transition-all hover:bg-gray-50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800">
                    <Printer className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Imprimir para mesa</p>
                    <p className="text-[12px] text-gray-400">Genera un stand con el QR</p>
                  </div>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Pagina Principal ── */
export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [surveyList] = useState(surveys)
  const [sharingOpen, setSharingOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeSurvey = surveyList[activeIndex]
  const impact = activeSurvey ? impactData[activeSurvey.id] || { todayRedirects: 0, weekRedirects: 0, totalRedirects: 0, todayResponses: 0 } : { todayRedirects: 0, weekRedirects: 0, totalRedirects: 0, todayResponses: 0 }

  const getCardWidth = () => {
    if (!scrollRef.current) return 340
    const firstCard = scrollRef.current.querySelector("[data-survey-card]") as HTMLElement
    return firstCard ? firstCard.offsetWidth + 16 : 340
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    const scrollLeft = scrollRef.current.scrollLeft
    const cardWidth = getCardWidth()
    const newIndex = Math.round(scrollLeft / cardWidth)
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex <= surveyList.length) {
      setActiveIndex(Math.min(newIndex, surveyList.length - 1))
    }
  }

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return
    const cardWidth = getCardWidth()
    scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" })
    setActiveIndex(Math.min(index, surveyList.length - 1))
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-24 md:pb-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <p className="text-sm font-medium text-gray-400">Panel de control</p>
          <h1 className="text-2xl font-semibold text-gray-900">Tus Encuestas</h1>
        </div>

        {/* Survey Cards Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {surveyList.map((survey, i) => (
            <div key={survey.id} data-survey-card className="w-[calc(100vw-56px)] max-w-[340px] flex-shrink-0 snap-center md:w-[320px]">
              <SurveyCard
                survey={survey}
                isActive={i === activeIndex}
                onClick={() => scrollToCard(i)}
                onQR={() => setQrOpen(true)}
              />
            </div>
          ))}

          {/* Banner Asesoria Google Business Profile */}
          <div className="w-[calc(100vw-56px)] max-w-[340px] flex-shrink-0 snap-center md:w-[320px]">
            <div className="relative h-full overflow-hidden rounded-[20px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <GoogleIcon className="h-5 w-5" />
              </div>
              <h4 className="text-[15px] font-semibold text-gray-900 text-balance">
                Optimiza tu perfil de Google Business
              </h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">
                Agenda una asesoria gratuita para mejorar tu visibilidad y atraer mas clientes.
              </p>
              <a
                href="https://wa.me/56988090687?text=Hola%2C%20me%20interesa%20una%20asesor%C3%ADa%20de%20Google%20Business%20Profile"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#007AFF] px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#0051D5] active:scale-95"
              >
                Agendar asesoria
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 pb-5 pt-1">
          {[...surveyList, null].map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                if (i < surveyList.length) scrollToCard(i)
                else if (scrollRef.current) {
                  const cardWidth = getCardWidth()
                  scrollRef.current.scrollTo({ left: i * cardWidth, behavior: "smooth" })
                }
              }}
              className="h-1.5 rounded-full"
              animate={{
                width: i === activeIndex ? 20 : 6,
                backgroundColor: i === activeIndex ? "#007AFF" : "#D1D5DB",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          ))}
        </div>

        {/* Impacto del dia */}
        <div className="px-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-[16px] border border-gray-100 bg-white px-5 py-4"
          >
            {impact.todayRedirects > 0 || impact.todayResponses > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{"🔥"}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {impact.todayRedirects} redireccion{impact.todayRedirects !== 1 ? "es" : ""} a Google hoy
                  </p>
                  <p className="text-xs text-gray-400">
                    {impact.weekRedirects} esta semana {" · "} {impact.totalRedirects} en total
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{"👋"}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Comparte la encuesta para comenzar a redirigir clientes a Google
                  </p>
                  <p className="text-xs text-gray-400">
                    Cada escaneo del QR es una nueva oportunidad
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Acceso rapido */}
          <Link
            href={`/responses?survey=${activeSurvey?.id}`}
            className="flex items-center justify-between rounded-[16px] border border-gray-100 bg-white px-4 py-3 transition-all hover:border-[#007AFF]/20 hover:bg-blue-50/30 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <p className="text-sm font-medium text-gray-600">Ver actividad reciente</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-300" />
          </Link>
        </div>
      </div>

      {/* FAB Dual - QR (principal) + WhatsApp (secundario) */}
      <div className="fixed bottom-20 right-5 z-30 flex flex-col items-center gap-3 md:bottom-8 md:right-8">
        {/* Secundario: WhatsApp */}
        <motion.button
          onClick={() => {
            if (activeSurvey) {
              window.open(
                `https://wa.me/?text=${encodeURIComponent(`Queremos conocer tu opinion: ${activeSurvey.link}`)}`,
                "_blank"
              )
            }
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-green-200 bg-white shadow-md transition-colors hover:bg-green-50"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.08 }}
          title="Enviar por WhatsApp"
        >
          <MessageSquare className="h-5 w-5 text-green-600" />
        </motion.button>

        {/* Principal: Mostrar QR */}
        <motion.button
          onClick={() => setQrOpen(true)}
          className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#007AFF] shadow-lg shadow-blue-500/30"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          title="Mostrar QR"
        >
          <QrCode className="h-7 w-7 text-white" />
        </motion.button>
      </div>

      {/* Modals */}
      <QRModal isOpen={qrOpen} onClose={() => setQrOpen(false)} survey={activeSurvey} />
      <SharingSheet isOpen={sharingOpen} onClose={() => setSharingOpen(false)} survey={activeSurvey} />
    </main>
  )
}
