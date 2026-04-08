"use client"

import { ReactNode } from "react"
import { X } from "lucide-react"
import { unifiedNavigationStyles } from "./unified-navigation.styles"

interface MobileNavigationOverlayProps {
  children: ReactNode
  isOpen?: boolean
  onClose?: () => void
  title?: string
  className?: string
}

export function MobileNavigationOverlay({
  children,
  isOpen = true,
  onClose,
  title = "Navigation",
  className = ""
}: MobileNavigationOverlayProps) {
  if (!isOpen) return null

  return (
    <div className={unifiedNavigationStyles.mobile.overlay.container}>
      {/* Backdrop */}
      <div 
        className={unifiedNavigationStyles.mobile.overlay.backdrop}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`${unifiedNavigationStyles.mobile.overlay.sidebar} ${className}`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className={unifiedNavigationStyles.mobile.header.container}>
            <div className={unifiedNavigationStyles.mobile.header.content}>
              <h2 className={unifiedNavigationStyles.mobile.header.title}>
                {title}
              </h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className={unifiedNavigationStyles.mobile.header.closeButton}
                >
                  <X className={unifiedNavigationStyles.mobile.header.closeIcon} />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Content - Full height with padding */}
          <div className={`${unifiedNavigationStyles.mobile.nav} flex-1 overflow-y-auto`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}