"use client"

import Link from "next/link"
import { ChevronRight, FileText, Folder, BookOpen, Tag } from "lucide-react"
import { cn } from "@/lib/helpers"
import { getRoute, routeUtils } from "@/config/routes"
import { DynamicNavigationConfig, UseNavigationReturn, Document } from "./unified-navigation.props"
import { unifiedNavigationStyles } from "./unified-navigation.styles"

interface DynamicNavigationItemsProps {
  config: DynamicNavigationConfig
  navigation: UseNavigationReturn
  pathname: string
  onNavigate?: () => void
  styles: typeof unifiedNavigationStyles
}

export function DynamicNavigationItems({
  config,
  navigation,
  pathname,
  onNavigate,
  styles
}: DynamicNavigationItemsProps) {
  const { categories = [], showCounts = true, expandable = true } = config
  const { documents, expandedCategories } = navigation.state
  const { toggleCategory } = navigation.actions

  // Group documents by category
  const documentsByCategory = documents.reduce(
    (acc, doc) => {
      const categoryId = doc.category_id || "uncategorized"
      if (!acc[categoryId]) {
        acc[categoryId] = []
      }
      acc[categoryId].push(doc)
      return acc
    },
    {} as Record<string, Document[]>
  )

  return (
    <div className="space-y-4">
      {/* All Documents Link */}
      <div>
        <Link
          href={getRoute.docs()}
          onClick={onNavigate}
          className={cn(
            styles.specialLink.base,
            pathname === getRoute.docs()
              ? styles.specialLink.active
              : styles.specialLink.inactive
          )}
        >
          <BookOpen className={styles.category.icon} />
          All Documentation
        </Link>
      </div>

      {/* Categories and Documents */}
      {categories.map((category) => {
        const categoryDocs = documentsByCategory[category.id] || []
        const isExpanded = expandedCategories.has(category.id)
        const hasDocuments = categoryDocs.length > 0

        return (
          <div key={category.id}>
            <button
              onClick={() => hasDocuments && expandable && toggleCategory(category.id)}
              className={cn(
                styles.category.button.base,
                hasDocuments && expandable
                  ? styles.category.button.withDocs
                  : styles.category.button.withoutDocs
              )}
            >
              <div className="flex items-center">
                <Tag className={styles.category.icon} />
                <span>{category.name}</span>
                {showCounts && (
                  <span className={styles.category.count}>
                    ({categoryDocs.length})
                  </span>
                )}
              </div>
              {hasDocuments && expandable && (
                <ChevronRight
                  className={cn(
                    styles.category.expandIcon.base,
                    isExpanded ? styles.category.expandIcon.expanded : ""
                  )}
                />
              )}
            </button>

            {hasDocuments && (!expandable || isExpanded) && (
              <div className={styles.documents.list}>
                {categoryDocs.map((doc) => (
                  <Link
                    key={doc.id}
                    href={getRoute.docsPage(doc.slug)}
                    onClick={onNavigate}
                    className={cn(
                      styles.documents.link.base,
                      routeUtils.isActive(pathname, getRoute.docsPage(doc.slug))
                        ? styles.documents.link.active
                        : styles.documents.link.inactive
                    )}
                  >
                    <FileText className={styles.documents.icon} />
                    {doc.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Uncategorized Documents */}
      {documentsByCategory.uncategorized && documentsByCategory.uncategorized.length > 0 && (
        <div>
          <button
            onClick={() => expandable && toggleCategory("uncategorized")}
            className={cn(
              styles.category.button.base,
              styles.category.button.withDocs
            )}
          >
            <div className="flex items-center">
              <Folder className={styles.category.icon} />
              <span>Other</span>
              {showCounts && (
                <span className={styles.category.count}>
                  ({documentsByCategory.uncategorized.length})
                </span>
              )}
            </div>
            {expandable && (
              <ChevronRight
                className={cn(
                  styles.category.expandIcon.base,
                  expandedCategories.has("uncategorized") ? styles.category.expandIcon.expanded : ""
                )}
              />
            )}
          </button>

          {(!expandable || expandedCategories.has("uncategorized")) && (
            <div className={styles.documents.list}>
              {documentsByCategory.uncategorized.map((doc) => (
                <Link
                  key={doc.id}
                  href={getRoute.docsPage(doc.slug)}
                  onClick={onNavigate}
                  className={cn(
                    styles.documents.link.base,
                    routeUtils.isActive(pathname, getRoute.docsPage(doc.slug))
                      ? styles.documents.link.active
                      : styles.documents.link.inactive
                  )}
                >
                  <FileText className={styles.documents.icon} />
                  {doc.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}