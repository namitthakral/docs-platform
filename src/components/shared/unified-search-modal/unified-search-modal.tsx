"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import {
  useUnifiedSearch,
  type DashboardSearchResult,
  type UnifiedSearchResult,
} from "@/hooks/use-unified-search"
import type { SearchResult } from "@/types/search"
import type { UnifiedSearchModalProps } from './unified-search-modal.props'
import { unifiedSearchModalStyles } from './unified-search-modal.styles'

// Type guard functions
function isPublicSearchResult(
  result: UnifiedSearchResult,
): result is SearchResult {
  return "relevance" in result
}

function isDashboardSearchResult(
  result: UnifiedSearchResult,
): result is DashboardSearchResult {
  return "updated_at" in result && "status" in result
}


export default function UnifiedSearchModal({
  isOpen,
  onClose,
  mode,
}: UnifiedSearchModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Use unified search hook
  const { query, setQuery, results, isLoading } = useUnifiedSearch({
    mode,
    debounceMs: 300,
    enabled: isOpen,
    minQueryLength: 3,
  })

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (results[selectedIndex]) {
          const result = results[selectedIndex]
          // Always navigate to view page, regardless of mode
          const slug = result.category?.slug
            ? `${result.category.slug}/${result.slug}`
            : result.slug
          window.location.href = `/docs/${slug}`
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, results, selectedIndex, mode])

  if (!isOpen) return null

  const getResultUrl = (result: any) => {
    if (mode === 'dashboard') {
      // For dashboard mode, link to the edit page
      return `/dashboard/documents/${result.id}`
    } else {
      // For public mode, link to the public view page
      const slug = result.category?.slug
        ? `${result.category.slug}/${result.slug}`
        : result.slug
      return `/docs/${slug}`
    }
  }

  const placeholder = "Search documentation..."

  const actionText = "Open"

  return (
    <div className={unifiedSearchModalStyles.overlay}>
      <div className={unifiedSearchModalStyles.backdrop} onClick={onClose} />
      <div className={unifiedSearchModalStyles.container}>
        <div className={unifiedSearchModalStyles.modal}>
          {/* Search Input */}
          <div className={unifiedSearchModalStyles.inputSection}>
            <div className={unifiedSearchModalStyles.inputContainer}>
              <div className={unifiedSearchModalStyles.searchIcon}>
                <Search className={unifiedSearchModalStyles.searchIconSvg} />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={unifiedSearchModalStyles.input}
              />
            </div>
          </div>

          {/* Results */}
          <div className={unifiedSearchModalStyles.resultsContainer}>
            {isLoading && query.length >= 3 && (
              <div className={unifiedSearchModalStyles.loadingContainer}>
                <div className={unifiedSearchModalStyles.loadingContent}>
                  <div className={unifiedSearchModalStyles.spinner}></div>
                  <span className={unifiedSearchModalStyles.loadingText}>Searching...</span>
                </div>
              </div>
            )}

            {!isLoading && query.length >= 3 && results.length === 0 && (
              <div className={unifiedSearchModalStyles.emptyContainer}>
                <p className={unifiedSearchModalStyles.emptyText}>
                  No documents found for "{query}"
                </p>
              </div>
            )}

            {query.length < 3 && (
              <div className={unifiedSearchModalStyles.minQueryContainer}>
                <p className={unifiedSearchModalStyles.minQueryText}>
                  Type at least 3 characters to search
                </p>
              </div>
            )}

            {results.map((result, index) => (
              <Link
                key={result.id}
                href={getResultUrl(result)}
                onClick={onClose}
                className={`${unifiedSearchModalStyles.resultLink} ${
                  index === selectedIndex ? unifiedSearchModalStyles.resultLinkSelected : ""
                }`}
              >
                <div className={unifiedSearchModalStyles.resultContent}>
                  <div className={unifiedSearchModalStyles.resultMain}>
                    <div className={unifiedSearchModalStyles.resultHeader}>
                      <h3 className={unifiedSearchModalStyles.resultTitle}>
                        {result.title}
                      </h3>
                      {isDashboardSearchResult(result) && (
                        <span
                          className={`${unifiedSearchModalStyles.statusBadge} ${
                            result.status === "published"
                              ? unifiedSearchModalStyles.statusPublished
                              : unifiedSearchModalStyles.statusDraft
                          }`}
                        >
                          {result.status}
                        </span>
                      )}
                    </div>

                    {result.category && (
                      <p className={unifiedSearchModalStyles.categoryText}>
                        in {result.category.name}
                      </p>
                    )}

                    {isPublicSearchResult(result) && result.snippet && (
                      <div
                        className={unifiedSearchModalStyles.snippetContainer}
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                      />
                    )}

                    {isDashboardSearchResult(result) && result.snippet && (
                      <div
                        className={unifiedSearchModalStyles.snippetContainer}
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                      />
                    )}

                    {result.description &&
                      !isPublicSearchResult(result) &&
                      !result.snippet && (
                        <p className={unifiedSearchModalStyles.descriptionText}>
                          {result.description}
                        </p>
                      )}
                  </div>
                  <div className={unifiedSearchModalStyles.resultMeta}>
                    {isPublicSearchResult(result) && result.relevance && (
                      <span className={unifiedSearchModalStyles.relevanceText}>
                        {Math.min(100, Math.round(result.relevance * 100))}%
                        match
                      </span>
                    )}
                    {isDashboardSearchResult(result) && (
                      <span className={unifiedSearchModalStyles.dateText}>
                        {new Date(result.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer with keyboard shortcuts */}
          <div className={unifiedSearchModalStyles.footer}>
            <div className={unifiedSearchModalStyles.footerContent}>
              <div className={unifiedSearchModalStyles.shortcuts}>
                <span className={unifiedSearchModalStyles.shortcut}>
                  <kbd className={unifiedSearchModalStyles.kbd}>
                    ↑↓
                  </kbd>
                  Navigate
                </span>
                <span className={unifiedSearchModalStyles.shortcut}>
                  <kbd className={unifiedSearchModalStyles.kbd}>
                    Enter
                  </kbd>
                  {actionText}
                </span>
                <span className={unifiedSearchModalStyles.shortcut}>
                  <kbd className={unifiedSearchModalStyles.kbd}>
                    Esc
                  </kbd>
                  Close
                </span>
              </div>
              {results.length > 0 && (
                <span className={unifiedSearchModalStyles.resultsCount}>
                  {results.length} result{results.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
