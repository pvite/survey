"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, MessageSquare, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useSidebar } from "./sidebar-provider"

const navigation = [
  { name: "Encuestas", href: "/", icon: ClipboardList },
  { name: "Respuestas", href: "/responses", icon: MessageSquare },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed } = useSidebar()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen border-r border-gray-200 bg-white transition-all duration-300 md:block ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm">
              <span className="text-xl font-bold text-white">7</span>
            </div>
            {!isCollapsed && <span className="ml-3 text-lg font-semibold text-gray-900">Review Gate</span>}
          </div>

          {/* CTA Crear encuesta */}
          <div className="px-3 pt-4 pb-2">
            <Link
              href="/admin"
              className={`flex items-center gap-2 rounded-xl border border-[#007AFF]/20 bg-[#007AFF]/5 px-3 py-2.5 text-sm font-medium text-[#007AFF] transition-all hover:bg-[#007AFF]/10 active:scale-[0.98] ${
                isCollapsed ? "justify-center" : ""
              }`}
              title={isCollapsed ? "Crear encuesta" : undefined}
            >
              <Plus size={18} strokeWidth={2.5} />
              {!isCollapsed && <span>Crear encuesta</span>}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive ? "bg-[#007AFF]/10 text-[#007AFF]" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon size={20} strokeWidth={2} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Collapse Toggle */}
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex w-full items-center justify-center rounded-lg bg-gray-50 py-2.5 text-gray-700 transition-all hover:bg-gray-100"
              title={isCollapsed ? "Expandir" : "Colapsar"}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="border-t border-gray-200 p-4">
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-xs font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@reviewgate.com</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition-colors ${
                  isActive ? "text-[#007AFF]" : "text-gray-400"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
          <Link
            href="/admin"
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition-colors ${
              pathname === "/admin" ? "text-[#007AFF]" : "text-gray-400"
            }`}
          >
            <Plus size={22} strokeWidth={pathname === "/admin" ? 2.5 : 2} />
            <span className={`text-[10px] ${pathname === "/admin" ? "font-semibold" : "font-medium"}`}>
              Crear
            </span>
          </Link>
        </div>
        {/* Safe area bottom for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  )
}
