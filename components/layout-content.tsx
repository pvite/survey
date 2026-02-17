"use client"

import { useSidebar } from "./sidebar-provider"
import type { ReactNode } from "react"

export function LayoutContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className={`transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
      {children}
    </div>
  )
}
