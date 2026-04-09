"use client"

import { Eye } from "lucide-react"
import { DocumentStatus } from "@/types/document"
import { documentSidebarStyles } from "./document-sidebar.styles"
import type { Category } from "../document-editor.props"
import MarkdownHelp from "../markdown-help/markdown-help"
import type { DocumentSidebarProps } from "./document-sidebar.props"
import Dropdown from "@/components/shared/dropdown/dropdown"

export default function DocumentSidebar({
  formData,
  categories,
  onInputChange,
}: DocumentSidebarProps) {
  // Find selected category for display
  const selectedCategory = categories.find(cat => cat.id === formData.category_id)
  return (
    <div className={documentSidebarStyles.sidebar}>
      {/* Category */}
      <div className={documentSidebarStyles.sidebarCard}>
        <div className={documentSidebarStyles.sidebarHeader}>
          <Eye className={documentSidebarStyles.sidebarIcon} />
          <h3 className={documentSidebarStyles.sidebarTitle}>Category</h3>
        </div>
        <Dropdown
          trigger={selectedCategory ? selectedCategory.name : "Select a category..."}
          placeholder="Select a category..."
        >
          {/* Clear selection option */}
          <button
            onClick={() => onInputChange("category_id", null)}
            className={`${documentSidebarStyles.dropdownOption} ${
              !formData.category_id ? documentSidebarStyles.dropdownOptionSelected : documentSidebarStyles.dropdownOptionDefault
            }`}
          >
            <span>No category</span>
            {!formData.category_id && <span className={documentSidebarStyles.checkmark}>✓</span>}
          </button>
          
          {/* Category options */}
          {categories.map((category: Category) => (
            <button
              key={category.id}
              onClick={() => onInputChange("category_id", category.id)}
              className={`${documentSidebarStyles.dropdownOption} ${
                formData.category_id === category.id ? documentSidebarStyles.dropdownOptionSelected : documentSidebarStyles.dropdownOptionDefault
              }`}
            >
              <span>{category.name}</span>
              {formData.category_id === category.id && <span className={documentSidebarStyles.checkmark}>✓</span>}
            </button>
          ))}
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
              checked={formData.status === DocumentStatus.DRAFT}
              onChange={(e) =>
                onInputChange("status", e.target.value as DocumentStatus)
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
              checked={formData.status === DocumentStatus.PUBLISHED}
              onChange={(e) =>
                onInputChange("status", e.target.value as DocumentStatus)
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
