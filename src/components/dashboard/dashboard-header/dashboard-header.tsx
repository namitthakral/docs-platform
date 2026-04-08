"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ExternalLink, Menu } from "lucide-react"
import type { DashboardHeaderProps } from "./dashboard-header.props"
import { dashboardHeaderStyles } from "./dashboard-header.styles"
import { getRoute } from "@/config/routes"
import UnifiedSearchModal from "../../shared/unified-search-modal/unified-search-modal"

export default function DashboardHeader({ onMobileMenuToggle }: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  // Global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className={dashboardHeaderStyles.header}>
      <div className={dashboardHeaderStyles.container}>
        <div className={dashboardHeaderStyles.content}>
          <div className={dashboardHeaderStyles.leftSection}>
            {/* Mobile Menu Button */}
            {onMobileMenuToggle && (
              <button
                onClick={onMobileMenuToggle}
                className={dashboardHeaderStyles.mobileMenuButton}
              >
                <Menu className={dashboardHeaderStyles.mobileMenuIcon} />
              </button>
            )}
            
            <Link
              href={getRoute.dashboard.home()}
              className={dashboardHeaderStyles.logo}
            >
              Documentation Platform
            </Link>
          </div>

          <div className={dashboardHeaderStyles.rightSection}>
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className={dashboardHeaderStyles.searchButton}
              title="Search (⌘K)"
            >
              <Search className={dashboardHeaderStyles.searchIcon} />
              <span className={dashboardHeaderStyles.searchText}>Search...</span>
              <kbd className={dashboardHeaderStyles.searchKbd}>
                ⌘K
              </kbd>
            </button>

            {/* Public Docs Link */}
            <Link
              href={getRoute.docs()}
              target="_blank"
              className={dashboardHeaderStyles.publicDocsLink}
              title="View Public Docs"
            >
              <ExternalLink className={dashboardHeaderStyles.publicDocsIcon} />
              <span className={dashboardHeaderStyles.publicDocsText}>Public Docs</span>
            </Link>
          </div>
        </div>
      </div>
      
      <UnifiedSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} mode="dashboard" />
    </header>
  )
}
