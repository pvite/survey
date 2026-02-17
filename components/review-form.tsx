"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ReviewForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    feedback: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="animate-fade-in text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-900">¡Gracias!</p>
        <p className="mt-2 text-sm text-gray-600">Su comentario ha sido enviado.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-2 text-center text-xl font-semibold text-gray-900">
        Lamentamos que su experiencia no haya sido perfecta
      </h2>
      <p className="mb-6 text-center text-sm text-gray-600">
        Ayúdenos a mejorar contándonos qué pasó. Nos pondremos en contacto.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feedback" className="sr-only">
            Comentario
          </label>
          <textarea
            id="feedback"
            required
            rows={4}
            placeholder="¿Qué podemos mejorar?"
            value={formData.feedback}
            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#007AFF] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
          />
        </div>

        <div>
          <label htmlFor="name" className="sr-only">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            placeholder="Nombre (opcional)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#007AFF] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
          />
        </div>

        <div>
          <label htmlFor="contact" className="sr-only">
            Email o Teléfono
          </label>
          <input
            type="text"
            id="contact"
            required
            placeholder="Email o teléfono"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#007AFF] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl bg-[#007AFF] py-6 text-base font-semibold text-white hover:bg-[#0051D5] active:scale-[0.98]"
        >
          Enviar Comentario
        </Button>
      </form>
    </div>
  )
}
