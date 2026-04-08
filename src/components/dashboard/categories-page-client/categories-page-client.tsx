"use client"

import { useState } from "react"
import { Plus, FolderOpen } from "lucide-react"
import CategoriesManager from "@/components/dashboard/categories-manager/categories-manager"
import TableSkeleton from "@/components/shared/table-skeleton/table-skeleton"
import { categoriesPageClientStyles } from "./categories-page-client.styles"
import { useCategories } from "@/hooks/use-categories"

export default function CategoriesPageClient() {
  const [showAddForm, setShowAddForm] = useState(false)
  const { categories, isLoading, isError, error } = useCategories({
    includePrivate: true,
    withCounts: true,
  })

  if (isError) {
    return (
      <div className={categoriesPageClientStyles.container}>
        <div className={categoriesPageClientStyles.errorContainer}>
          <div className={categoriesPageClientStyles.errorContent}>
            <p className={categoriesPageClientStyles.errorTitle}>Error loading categories</p>
            <p className={categoriesPageClientStyles.errorMessage}>
              {error?.message || "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={categoriesPageClientStyles.container}>
      {/* Desktop Header */}
      <div className={categoriesPageClientStyles.desktopHeader}>
        <div className={categoriesPageClientStyles.headerContent}>
          <h1 className={categoriesPageClientStyles.title}>Categories</h1>
          <p className={categoriesPageClientStyles.description}>
            Organize your documentation with categories
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className={categoriesPageClientStyles.addButton}
        >
          <Plus className={categoriesPageClientStyles.addIcon} />
          Add Category
        </button>
      </div>

      {/* Mobile Header */}
      <div className={categoriesPageClientStyles.mobileHeader}>
        <div className={categoriesPageClientStyles.mobileHeaderContent}>
          <h1 className={categoriesPageClientStyles.title}>Categories</h1>
          <p className={categoriesPageClientStyles.description}>
            Organize your documentation with categories
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className={categoriesPageClientStyles.mobileAddButton}
        >
          <Plus className={categoriesPageClientStyles.addIcon} />
          Add Category
        </button>
      </div>

      {categories.length === 0 && !isLoading ? (
        <div className={categoriesPageClientStyles.emptyContainer}>
          <FolderOpen className={categoriesPageClientStyles.emptyIcon} />
          <h3 className={categoriesPageClientStyles.emptyTitle}>
            No categories yet
          </h3>
          <p className={categoriesPageClientStyles.emptyDescription}>
            Get started by creating your first category to organize your
            documentation.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className={categoriesPageClientStyles.emptyButton}
          >
            <Plus className={categoriesPageClientStyles.addIcon} />
            Add Category
          </button>
        </div>
      ) : isLoading ? (
        <TableSkeleton rows={4} columns={4} />
      ) : (
        <CategoriesManager
          categories={categories}
          externalShowForm={showAddForm}
          onCloseForm={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}
