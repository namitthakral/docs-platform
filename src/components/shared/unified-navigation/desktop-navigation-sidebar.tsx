"use client"

import { ReactNode } from "react"
import { unifiedNavigationStyles } from "./unified-navigation.styles"

interface DesktopNavigationSidebarProps {
  children: ReactNode
  className?: string
}

export function DesktopNavigationSidebar({
  children,
  className = ""
}: DesktopNavigationSidebarProps) {
  return (
    <div className={`${unifiedNavigationStyles.desktop.container} ${className}`}>
      <div className={`${unifiedNavigationStyles.desktop.nav} h-full`}>
        {children}
      </div>
    </div>
  )
}