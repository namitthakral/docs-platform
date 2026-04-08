"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, Menu } from "lucide-react"
import UnifiedSearchModal from "../../shared/unified-search-modal/unified-search-modal"
import { getRoute } from "@/config/routes"
import { DocsHeaderProps } from "./docs-header.props"
import { docsHeaderStyles } from "./docs-header.styles"

export default function DocsHeader({ onMobileMenuToggle }: DocsHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  // Global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <header className={docsHeaderStyles.header}>
        <div className={docsHeaderStyles.container}>
          <div className={docsHeaderStyles.content}>
            <div className={docsHeaderStyles.leftSection}>
              {/* Mobile Menu Button - Left Side */}
              <button
                onClick={onMobileMenuToggle}
                className={docsHeaderStyles.mobileMenuButton}
              >
                <Menu className={docsHeaderStyles.mobileMenuIcon} />
              </button>

              {/* Back Button - All Screen Sizes */}
              <Link
                href={getRoute.home()}
                className={docsHeaderStyles.backLink}
              >
                ← <span className={docsHeaderStyles.backTextDesktop}>Back to Home</span><span className={docsHeaderStyles.backTextMobile}>Back</span>
              </Link>

              <Link
                href={getRoute.docs()}
                className={docsHeaderStyles.title}
              >
                Documentation
              </Link>
            </div>

            <div className={docsHeaderStyles.rightSection}>
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className={docsHeaderStyles.searchButton}
              >
                <Search className={docsHeaderStyles.searchIcon} />
                <span className={docsHeaderStyles.searchText}>Search docs...</span>
                <kbd className={docsHeaderStyles.searchKbd}>
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>
        </div>
      </header>

      <UnifiedSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        mode="public"
      />
    </>
  )
}