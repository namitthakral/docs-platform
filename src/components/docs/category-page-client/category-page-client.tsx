'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Calendar, RefreshCw, ChevronRight, ArrowLeft, Plus, X } from 'lucide-react'
import { getRoute } from '@/config/routes'
import TagFilter from '@/components/docs/tag-filter/tag-filter'
import Breadcrumbs from '@/components/shared/breadcrumbs/breadcrumbs'
import type { Tag } from '@/types/tag'
import type { CategoryPageClientProps } from './category-page-client.props'
import { categoryPageClientStyles } from './category-page-client.styles'

export default function CategoryPageClient({ 
  category,
  initialDocuments,
  breadcrumbs,
  isAuthenticated
}: CategoryPageClientProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState(initialDocuments)
  const [isLoading, setIsLoading] = useState(false)

  // Filter documents when tags change
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredDocuments(initialDocuments)
      return
    }

    setIsLoading(true)
    
    // Filter documents that have at least one of the selected tags
    const filtered = initialDocuments.filter(doc => {
      if (!doc.document_tags || doc.document_tags.length === 0) return false
      
      const docTagIds = doc.document_tags.map(dt => dt.tags.id)
      return selectedTags.some(selectedTag => docTagIds.includes(selectedTag.id))
    })
    
    setFilteredDocuments(filtered)
    setIsLoading(false)
  }, [selectedTags, initialDocuments])

  const handleTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags)
  }

  return (
    <div className={categoryPageClientStyles.container}>
      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} currentTitle={category.name} />

      {/* Category Header */}
      <div className={categoryPageClientStyles.header}>
        <h1 className={categoryPageClientStyles.title}>
          {category.name}
        </h1>

        {category.description && (
          <p className={categoryPageClientStyles.description}>
            {category.description}
          </p>
        )}

        <div className={categoryPageClientStyles.meta}>
          <FileText className="w-4 h-4 mr-1" />
          {initialDocuments?.length || 0}{" "}
          {initialDocuments?.length === 1 ? "document" : "documents"}
        </div>
      </div>

      {/* Documents List */}
      {isLoading ? (
        <div className={categoryPageClientStyles.loading}>
          <div className={categoryPageClientStyles.spinner}></div>
          <span>Filtering documents...</span>
        </div>
      ) : filteredDocuments && filteredDocuments.length > 0 ? (
        <div className={categoryPageClientStyles.documentsSection}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <h2 className={categoryPageClientStyles.documentsTitle}>
              {selectedTags.length > 0 ? 'Filtered Documents' : 'All Documents'}
            </h2>
            {/* Tag Filter - positioned where it's most relevant */}
            <div className="sm:max-w-sm">
              <TagFilter selectedTags={selectedTags} onTagsChange={handleTagsChange} />
            </div>
          </div>

          <div className={categoryPageClientStyles.documentsGrid}>
            {filteredDocuments.map((doc) => (
              <Link
                key={doc.id}
                href={getRoute.docsPage(doc.slug)}
                prefetch={true}
                className={categoryPageClientStyles.documentCard}
              >
                <div className={categoryPageClientStyles.documentContent}>
                  <div className={categoryPageClientStyles.documentInfo}>
                    <h3 className={categoryPageClientStyles.documentTitle}>
                      {doc.title}
                    </h3>

                    {doc.description && (
                      <p className={categoryPageClientStyles.documentDescription}>
                        {doc.description}
                      </p>
                    )}

                    {/* Tags */}
                    {doc.document_tags && doc.document_tags.length > 0 && (
                      <div className={categoryPageClientStyles.documentTags}>
                        {doc.document_tags.slice(0, 3).map((dt) => (
                          <span key={dt.tags.id} className={categoryPageClientStyles.documentTag}>
                            {dt.tags.name}
                          </span>
                        ))}
                        {doc.document_tags.length > 3 && (
                          <span className={categoryPageClientStyles.documentTagMore}>
                            +{doc.document_tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className={categoryPageClientStyles.documentMeta}>
                      {doc.published_at && (
                        <div className={categoryPageClientStyles.documentDate}>
                          <Calendar className="w-3 h-3 mr-1" />
                          Published{" "}
                          {new Date(doc.published_at).toLocaleDateString()}
                        </div>
                      )}

                      {doc.updated_at &&
                        doc.updated_at !== doc.published_at && (
                          <div className={categoryPageClientStyles.documentDate}>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Updated{" "}
                            {new Date(doc.updated_at).toLocaleDateString()}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className={categoryPageClientStyles.documentArrow}>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : selectedTags.length > 0 ? (
        /* No results for tag filter */
        <div className={categoryPageClientStyles.documentsSection}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <h2 className={categoryPageClientStyles.documentsTitle}>
              Filtered Documents
            </h2>
            {/* Keep Tag Filter visible so users can clear filters */}
            <div className="sm:max-w-sm">
              <TagFilter selectedTags={selectedTags} onTagsChange={handleTagsChange} />
            </div>
          </div>
          
          <div className={categoryPageClientStyles.emptyState}>
            <FileText className={categoryPageClientStyles.emptyIcon} />
            <h3 className={categoryPageClientStyles.emptyTitle}>
              No documents found
            </h3>
            <p className={categoryPageClientStyles.emptyDescription}>
              No documents in this category match the selected tags. Try removing some filters or clearing all filters above.
            </p>
            <div className={categoryPageClientStyles.emptyActions}>
              <button
                onClick={() => setSelectedTags([])}
                className={`${categoryPageClientStyles.backButton} mr-3`}
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </button>
              {isAuthenticated && (
                <Link
                  href={getRoute.dashboard.documentsNew()}
                  className={categoryPageClientStyles.createButton}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Document
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className={categoryPageClientStyles.emptyState}>
          <FileText className={categoryPageClientStyles.emptyIcon} />
          <h3 className={categoryPageClientStyles.emptyTitle}>
            No documents yet
          </h3>
          <p className={categoryPageClientStyles.emptyDescription}>
            There are no published documents in the {category.name} category
            yet. Check back later for new content.
          </p>
          <div className={categoryPageClientStyles.emptyActions}>
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  href={getRoute.dashboard.documentsNew()}
                  className={categoryPageClientStyles.createButton}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Document
                </Link>
                <Link
                  href={getRoute.docs()}
                  className={categoryPageClientStyles.backButton}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Documentation
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  className={categoryPageClientStyles.signInButton}
                >
                  Sign In to Create Documents
                </Link>
                <Link
                  href={getRoute.docs()}
                  className={categoryPageClientStyles.backButton}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Documentation
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}