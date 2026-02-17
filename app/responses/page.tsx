"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from "lucide-react"

type DbResponse = {
  id: string
  display_id?: number | null
  survey_id: string
  rating: number
  comment?: string | null
  status?: string | null
  source?: string | null
  customer_full_name?: string | null
  customer_email?: string | null
  customer_phone?: string | null
  created_at?: string | null
}

type DbSurvey = {
  id: string
  name?: string | null
  internal_identifier?: string | null
}

const ITEMS_PER_PAGE = 20

export default function ResponsesPage() {
  const searchParams = useSearchParams()
  const surveyIdParam = searchParams.get("encuesta_id")
  const surveyParam = searchParams.get("survey")

  const [responses, setResponses] = useState<DbResponse[]>([])
  const [surveys, setSurveys] = useState<DbSurvey[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSurvey, setSelectedSurvey] = useState<string>(surveyParam || surveyIdParam || "all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [redirectFilter, setRedirectFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resResponses, resSurveys] = await Promise.all([
          fetch("/api/responses").then((r) => r.json()),
          fetch("/api/surveys").then((r) => r.json()),
        ])
        setResponses(resResponses?.data ?? [])
        setSurveys(resSurveys?.data ?? [])
      } catch (err) {
        console.error("Error fetching responses", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const uniqueSurveys = surveys.map((s) => ({
    id: s.id,
    name: s.name || "Encuesta",
    clientName: s.internal_identifier || "",
  }))

  const enrichedResponses = responses.map((r) => {
    const survey = surveys.find((s) => s.id === r.survey_id)
    const ref = r.display_id ? `RES-${String(r.display_id).padStart(4, "0")}` : r.id.slice(0, 8).toUpperCase()
    return {
      ...r,
      surveyName: survey?.name || "Encuesta",
      clientName: survey?.internal_identifier || "",
      refId: ref,
      redirected: (r.status || "").toUpperCase() === "REDIRECTED",
      timestamp: r.created_at || "",
    }
  })

  const filteredResponses = enrichedResponses.filter((response) => {
    const matchesSearch =
      response.surveyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (response.comment || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.refId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSurvey = selectedSurvey === "all" || response.survey_id === selectedSurvey

    const matchesRating = ratingFilter === "all" || response.rating?.toString() === ratingFilter

    const matchesRedirect =
      redirectFilter === "all" ||
      (redirectFilter === "redirected" && response.redirected) ||
      (redirectFilter === "captured" && !response.redirected)

    return matchesSearch && matchesSurvey && matchesRating && matchesRedirect
  })

  const sortedResponses = [...filteredResponses].sort((a, b) => {
    const aNum = Number.parseInt(a.refId.split("-")[1])
    const bNum = Number.parseInt(b.refId.split("-")[1])
    return sortOrder === "asc" ? aNum - bNum : bNum - aNum
  })

  const totalPages = Math.ceil(sortedResponses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedResponses = sortedResponses.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedSurvey, ratingFilter, redirectFilter])

  // Auto-select survey if coming from URL parameter
  useEffect(() => {
    if (surveyParam) {
      setSelectedSurvey(surveyParam)
    } else if (surveyIdParam) {
      setSelectedSurvey(surveyIdParam)
    }
  }, [surveyParam, surveyIdParam])

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportToCSV = () => {
    const headers = ["ID", "Ref", "Encuesta", "Cliente", "Calificación", "Comentario", "Redirigido", "Fecha", "Fuente"]
    const csvData = sortedResponses.map((r) => [
      r.id,
      r.refId,
      r.surveyName,
      r.clientName,
      r.rating,
      `"${r.comment}"`,
      r.redirected ? "Sí" : "No",
      formatDate(r.timestamp),
      r.source,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `respuestas-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const toggleExpand = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id)
  }

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-gray-500">
        Cargando respuestas...
      </main>
    )
  }

  if (!responses.length) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-gray-500">
        No hay respuestas aún.
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-light text-2xl text-gray-900">Respuestas</h1>
              <p className="mt-1 font-light text-gray-500 text-xs">
                {sortedResponses.length} de {responses.length} respuestas
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition-all hover:bg-gray-50 active:scale-95"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 rounded-lg border border-gray-200 bg-white py-1.5 pr-3 pl-8 font-light text-gray-900 text-xs outline-none transition-all placeholder:text-gray-400 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20"
              />
            </div>

            <select
              value={selectedSurvey}
              onChange={(e) => setSelectedSurvey(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-light text-gray-900 text-xs outline-none transition-all focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20"
            >
              <option value="all">Todas las encuestas</option>
              {uniqueSurveys.map((survey) => (
                <option key={survey.id} value={survey.id}>
                  {survey.name}
                </option>
              ))}
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-light text-gray-900 text-xs outline-none transition-all focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20"
            >
              <option value="all">Todas las estrellas</option>
              <option value="5">★★★★★</option>
              <option value="4">★★★★</option>
              <option value="3">★★★</option>
              <option value="2">★★</option>
              <option value="1">★</option>
            </select>

            <select
              value={redirectFilter}
              onChange={(e) => setRedirectFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-light text-gray-900 text-xs outline-none transition-all focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20"
            >
              <option value="all">Todos los estados</option>
              <option value="redirected">Redirigidos</option>
              <option value="captured">Capturados</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-[16px] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-gray-100 border-b bg-gray-50/50">
                  <th className="px-4 py-2.5 text-left">
                    <button
                      onClick={toggleSort}
                      className="inline-flex items-center gap-1 font-medium text-gray-600 text-xs transition-colors hover:text-gray-900"
                    >
                      ID
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-gray-600 text-xs">Fecha</th>
                  <th className="px-4 py-2.5 text-left font-medium text-gray-600 text-xs">Encuesta</th>
                  <th className="px-4 py-2.5 text-left font-medium text-gray-600 text-xs">Calificación</th>
                  <th className="px-4 py-2.5 text-left font-medium text-gray-600 text-xs">Estado</th>
                  <th className="px-4 py-2.5 text-left font-medium text-gray-600 text-xs">Fuente</th>
                  <th className="w-12 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedResponses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <p className="font-light text-gray-400 text-sm">No se encontraron respuestas</p>
                    </td>
                  </tr>
                ) : (
                  paginatedResponses.map((response) => (
                    <>
                      <tr
                        key={response.id}
                        className="border-gray-100 border-b transition-colors hover:bg-gray-50/50 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono font-medium text-[#007AFF] text-xs">{response.refId}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-light text-gray-600 text-xs">{formatDate(response.timestamp)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900 text-sm">{response.surveyName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3.5 w-3.5 ${star <= response.rating ? "text-[#FFB800]" : "text-gray-300"}`}
                                  fill={star <= response.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                            <span className="font-medium text-gray-700 text-xs">{response.rating}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${
                              response.redirected ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                            }`}
                          >
                            {response.redirected ? (
                              <>
                                <ExternalLink className="h-3 w-3" />
                                Redirigido
                              </>
                            ) : (
                              "Capturado"
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-700 text-xs">
                            {response.source}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleExpand(response.id)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            aria-label={expandedRowId === response.id ? "Ocultar comentario" : "Ver comentario"}
                          >
                            {expandedRowId === response.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedRowId === response.id && (
                        <tr className="border-gray-100 border-b bg-gray-50/30">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="rounded-lg bg-white p-4 shadow-sm">
                              <p className="mb-1 font-medium text-gray-600 text-xs">Comentario:</p>
                              <p className="font-light text-gray-800 text-sm leading-relaxed">{response.comment}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-gray-100 border-t bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-light text-gray-600 text-xs">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, sortedResponses.length)} de {sortedResponses.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page and adjacent pages
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg border px-2 text-xs transition-all ${
                          currentPage === page
                            ? "border-[#007AFF] bg-[#007AFF] font-medium text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-1 text-gray-400 text-xs">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {sortedResponses.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[12px] bg-white p-4 shadow-sm">
              <p className="font-light text-gray-500 text-xs">Promedio</p>
              <p className="mt-1 font-semibold text-2xl text-gray-900">
                {(sortedResponses.reduce((acc, r) => acc + r.rating, 0) / sortedResponses.length).toFixed(1)}
              </p>
            </div>
            <div className="rounded-[12px] bg-white p-4 shadow-sm">
              <p className="font-light text-gray-500 text-xs">Redirigidos</p>
              <p className="mt-1 font-semibold text-2xl text-green-600">
                {sortedResponses.filter((r) => r.redirected).length}
              </p>
            </div>
            <div className="rounded-[12px] bg-white p-4 shadow-sm">
              <p className="font-light text-gray-500 text-xs">Capturados</p>
              <p className="mt-1 font-semibold text-2xl text-orange-600">
                {sortedResponses.filter((r) => !r.redirected).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
