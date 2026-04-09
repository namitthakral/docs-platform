"use client"

import { useState, useMemo } from "react"
import { Search, X, FileText, Plus } from "lucide-react"
import Link from "next/link"
import DocumentsTable from "@/components/dashboard/documents-table/documents-table"
import TableSkeleton from "@/components/shared/table-skeleton/table-skeleton"
import { documentsPageClientStyles } from "./documents-page-client.styles"
import { useDocuments } from "@/hooks/use-documents"
import { getRoute } from "@/config/routes"

export default function DocumentsPageClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const { documents, isLoading, isError, error } = useDocuments()

  // Filter documents based on search query
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) {
      return documents
    }

    const query = searchQuery.toLowerCase()
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.categories?.name?.toLowerCase().includes(query),
    )
  }, [documents, searchQuery])

  if (isError) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className={documentsPageClientStyles.desktopHeader}>
          <div className={documentsPageClientStyles.headerContent}>
            <h1 className={documentsPageClientStyles.title}>Documents</h1>
            <p className={documentsPageClientStyles.description}>Manage your documentation content</p>
          </div>
          <Link
            href={getRoute.dashboard.documentsNew()}
            className={documentsPageClientStyles.createButton}
          >
            <Plus className={documentsPageClientStyles.createIcon} />
            Create Document
          </Link>
        </div>

        <div className={documentsPageClientStyles.errorContainer}>
          <div className={documentsPageClientStyles.errorContent}>
            <p className={documentsPageClientStyles.errorTitle}>Error loading documents</p>
            <p className={documentsPageClientStyles.errorMessage}>
              {error?.message || "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Desktop Header */}
      <div className={documentsPageClientStyles.desktopHeader}>
        <div className={documentsPageClientStyles.headerContent}>
          <h1 className={documentsPageClientStyles.title}>Documents</h1>
          <p className={documentsPageClientStyles.description}>Manage your documentation content</p>
        </div>
        <Link
          href={getRoute.dashboard.documentsNew()}
          className={documentsPageClientStyles.createButton}
        >
          <Plus className={documentsPageClientStyles.createIcon} />
          Create Document
        </Link>
      </div>

      {/* Mobile Header */}
      <div className={documentsPageClientStyles.mobileHeader}>
        <div className={documentsPageClientStyles.headerContent}>
          <h1 className={documentsPageClientStyles.title}>Documents</h1>
          <p className={documentsPageClientStyles.description}>Manage your documentation content</p>
        </div>
        <Link
          href={getRoute.dashboard.documentsNew()}
          className={documentsPageClientStyles.mobileCreateButton}
        >
          <Plus className={documentsPageClientStyles.createIcon} />
          Create Document
        </Link>
      </div>

      {documents.length === 0 && !isLoading ? (
        <div className={documentsPageClientStyles.emptyContainer}>
          <FileText className={documentsPageClientStyles.emptyIcon} />
          <h3 className={documentsPageClientStyles.emptyTitle}>
            No documents yet
          </h3>
          <p className={documentsPageClientStyles.emptyDescription}>
            Get started by creating your first document.
          </p>
        </div>
      ) : (
        <div className={documentsPageClientStyles.container}>
          {/* Search Input */}
          <div className={documentsPageClientStyles.searchContainer}>
            <div className={documentsPageClientStyles.searchIconContainer}>
              <Search className={documentsPageClientStyles.searchIcon} />
            </div>
            <input
              type="text"
              placeholder="Search documents by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={documentsPageClientStyles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={documentsPageClientStyles.clearButton}
              >
                <X className={documentsPageClientStyles.clearIcon} />
              </button>
            )}
          </div>

          {/* Results Info */}
          {searchQuery && (
            <div className={documentsPageClientStyles.resultsText}>
              {filteredDocuments.length === 0
                ? `No documents found for "${searchQuery}"`
                : `${filteredDocuments.length} document${filteredDocuments.length === 1 ? "" : "s"} found for "${searchQuery}"`}
            </div>
          )}

          {/* Documents Table */}
          {isLoading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : (
            <DocumentsTable documents={filteredDocuments} />
          )}
        </div>
      )}
    </div>
  )
}
