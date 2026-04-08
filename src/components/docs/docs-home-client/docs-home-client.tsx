"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, ChevronRight, Plus } from "lucide-react"
import { getRoute } from "@/config/routes"
import TagFilter from "@/components/docs/tag-filter/tag-filter"
import type { Tag } from "@/types/tag"
import type { DocsHomeClientProps } from "./docs-home-client.props"
import { docsHomeClientStyles } from "./docs-home-client.styles"

export default function DocsHomeClient({
  initialDocuments,
  categories,
  isAuthenticated,
}: DocsHomeClientProps) {
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
    const filtered = initialDocuments.filter((doc) => {
      if (!doc.document_tags || doc.document_tags.length === 0) return false

      const docTagIds = doc.document_tags.map((dt) => dt.tags.id)
      return selectedTags.some((selectedTag) =>
        docTagIds.includes(selectedTag.id),
      )
    })

    setFilteredDocuments(filtered)
    setIsLoading(false)
  }, [selectedTags, initialDocuments])

  const handleTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags)
  }

  return (
    <div className={docsHomeClientStyles.container}>
      {/* Hero Section */}
      <div className={docsHomeClientStyles.hero}>
        <h1 className={docsHomeClientStyles.heroTitle}>Documentation</h1>
        <p className={docsHomeClientStyles.heroDescription}>
          Find answers, learn about features, and discover best practices in our
          comprehensive documentation.
        </p>
      </div>

      {/* Categories Grid */}
      {categories && categories.length > 0 && (
        <section className={docsHomeClientStyles.section}>
          <h2 className={docsHomeClientStyles.sectionTitle}>
            Browse by Category
          </h2>
          <div className={docsHomeClientStyles.categoriesGrid}>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={getRoute.docsPage(`category/${category.slug}`)}
                className={docsHomeClientStyles.categoryCard}
              >
                <h3 className={docsHomeClientStyles.categoryTitle}>
                  {category.name}
                </h3>
                {category.description && (
                  <p className={docsHomeClientStyles.categoryDescription}>
                    {category.description}
                  </p>
                )}
                <p className={docsHomeClientStyles.categoryCount}>
                  {category.documents?.[0]?.count || 0} documents
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Documents Section */}
      <section className={docsHomeClientStyles.section}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <h2 className={docsHomeClientStyles.sectionTitle}>
            {selectedTags.length > 0 ? "Filtered Documents" : "Recent Updates"}
          </h2>
          {/* Tag Filter - positioned where it's most relevant */}
          <div className="sm:max-w-sm">
            <TagFilter selectedTags={selectedTags} onTagsChange={handleTagsChange} />
          </div>
        </div>

        {isLoading ? (
          <div className={docsHomeClientStyles.loading}>
            <div className={docsHomeClientStyles.spinner}></div>
            <span>Filtering documents...</span>
          </div>
        ) : filteredDocuments && filteredDocuments.length > 0 ? (
          <div className={docsHomeClientStyles.documentsGrid}>
            {filteredDocuments.map((doc) => (
              <Link
                key={doc.id}
                href={getRoute.docsPage(doc.slug)}
                className={docsHomeClientStyles.documentCard}
              >
                <div className={docsHomeClientStyles.documentContent}>
                  <div className={docsHomeClientStyles.documentInfo}>
                    <h3 className={docsHomeClientStyles.documentTitle}>
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className={docsHomeClientStyles.documentDescription}>
                        {doc.description}
                      </p>
                    )}

                    {/* Tags */}
                    {doc.document_tags && doc.document_tags.length > 0 && (
                      <div className={docsHomeClientStyles.documentTags}>
                        {doc.document_tags.slice(0, 3).map((dt) => (
                          <span
                            key={dt.tags.id}
                            className={docsHomeClientStyles.documentTag}
                          >
                            {dt.tags.name}
                          </span>
                        ))}
                        {doc.document_tags.length > 3 && (
                          <span
                            className={docsHomeClientStyles.documentTagMore}
                          >
                            +{doc.document_tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className={docsHomeClientStyles.documentMeta}>
                      {doc.categories && (
                        <span className={docsHomeClientStyles.documentCategory}>
                          {doc.categories.name}
                        </span>
                      )}
                      {doc.published_at && (
                        <time
                          dateTime={doc.published_at}
                          className={docsHomeClientStyles.documentDate}
                        >
                          {new Date(doc.published_at).toLocaleDateString()}
                        </time>
                      )}
                    </div>
                  </div>

                  <div className={docsHomeClientStyles.documentArrow}>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : selectedTags.length > 0 ? (
          /* No results for tag filter */
          <div className={docsHomeClientStyles.emptyState}>
            <FileText className={docsHomeClientStyles.emptyIcon} />
            <h3 className={docsHomeClientStyles.emptyTitle}>
              No documents found
            </h3>
            <p className={docsHomeClientStyles.emptyDescription}>
              No documents match the selected tags. Try removing some filters or
              browse by category.
            </p>
            <div className={docsHomeClientStyles.emptyActions}>
              {isAuthenticated && (
                <Link
                  href={getRoute.dashboard.documentsNew()}
                  className={docsHomeClientStyles.createButton}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Document
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* No documents at all */
          <div className={docsHomeClientStyles.emptyState}>
            <FileText className={docsHomeClientStyles.emptyIcon} />
            <h3 className={docsHomeClientStyles.emptyTitle}>
              No documentation yet
            </h3>
            <p className={docsHomeClientStyles.emptyDescription}>
              Get started by creating your first document.
            </p>
            <div className={docsHomeClientStyles.emptyActions}>
              {isAuthenticated ? (
                <Link
                  href={getRoute.dashboard.documentsNew()}
                  className={docsHomeClientStyles.createButton}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Document
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className={docsHomeClientStyles.signInButton}
                >
                  Sign In to Create Documents
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
