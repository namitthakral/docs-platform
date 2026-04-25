"use client"

import { Eye } from "lucide-react"
import { useController } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { DocumentStatus } from "@/types/document"
import { Category } from "@/types/document-editor"
import { documentSidebarStyles } from "./document-sidebar.styles"
import MarkdownHelp from "../markdown-help/markdown-help"
import Dropdown from "@/components/shared/dropdown/dropdown"
import { queryKeys } from "@/lib/query-keys"
import { getRoute } from "@/config/routes"
import type { DocumentSidebarProps } from "./document-sidebar.props"

export default function DocumentSidebar({ control }: DocumentSidebarProps) {
  // Use controllers for form fields this component manages
  const { field: statusField } = useController({
    control,
    name: "status",
  })

  const { field: categoryField } = useController({
    control,
    name: "category_id",
  })

  // Query for categories
  const { data: categoriesResponse } = useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: async () => {
      const response = await fetch(getRoute.api.categories())
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()
      return data as { categories: Category[] }
    },
  })

  const categories = categoriesResponse?.categories || []

  // Find selected category for display
  const selectedCategory = categories?.find(
    (cat) => cat.id === categoryField.value,
  )

  return (
    <div className={documentSidebarStyles.sidebar}>
      {/* Category */}
      <div className={documentSidebarStyles.sidebarCard}>
        <div className={documentSidebarStyles.sidebarHeader}>
          <Eye className={documentSidebarStyles.sidebarIcon} />
          <h3 className={documentSidebarStyles.sidebarTitle}>Category</h3>
        </div>
        <Dropdown
          trigger={
            selectedCategory ? selectedCategory.name : "Select a category..."
          }
          placeholder="Select a category..."
        >
          {/* Clear selection option */}
          <button
            onClick={() => categoryField.onChange(null)}
            className={`${documentSidebarStyles.dropdownOption} ${
              !categoryField.value
                ? documentSidebarStyles.dropdownOptionSelected
                : documentSidebarStyles.dropdownOptionDefault
            }`}
          >
            <span>No category</span>
            {!categoryField.value && (
              <span className={documentSidebarStyles.checkmark}>✓</span>
            )}
          </button>

          {/* Category options */}
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => categoryField.onChange(category.id)}
              className={`${documentSidebarStyles.dropdownOption} ${
                categoryField.value === category.id
                  ? documentSidebarStyles.dropdownOptionSelected
                  : documentSidebarStyles.dropdownOptionDefault
              }`}
            >
              <span>{category.name}</span>
              {categoryField.value === category.id && (
                <span className={documentSidebarStyles.checkmark}>✓</span>
              )}
            </button>
          )) || []}
        </Dropdown>
        <p className={documentSidebarStyles.helperText}>
          Choose a category to help organize your documentation.
        </p>
      </div>

      {/* Status */}
      <div className={documentSidebarStyles.sidebarCard}>
        <div className={documentSidebarStyles.sidebarHeader}>
          <Eye className={documentSidebarStyles.sidebarIcon} />
          <h3 className={documentSidebarStyles.sidebarTitle}>
            Publication Status
          </h3>
        </div>
        <div className={documentSidebarStyles.statusOptions}>
          <label className={documentSidebarStyles.statusOption}>
            <input
              type="radio"
              name="status"
              value={DocumentStatus.DRAFT}
              checked={statusField.value === DocumentStatus.DRAFT}
              onChange={(e) =>
                statusField.onChange(e.target.value as DocumentStatus)
              }
              className={documentSidebarStyles.statusRadio}
            />
            <div>
              <span className={documentSidebarStyles.statusLabel}>Draft</span>
              <p className={documentSidebarStyles.statusDescription}>
                Only visible to you
              </p>
            </div>
          </label>
          <label className={documentSidebarStyles.statusOption}>
            <input
              type="radio"
              name="status"
              value={DocumentStatus.PUBLISHED}
              checked={statusField.value === DocumentStatus.PUBLISHED}
              onChange={(e) =>
                statusField.onChange(e.target.value as DocumentStatus)
              }
              className={documentSidebarStyles.statusRadio}
            />
            <div>
              <span className={documentSidebarStyles.statusLabel}>
                Published
              </span>
              <p className={documentSidebarStyles.statusDescription}>
                Visible to everyone
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Markdown Help */}
      <MarkdownHelp />
    </div>
  )
}
