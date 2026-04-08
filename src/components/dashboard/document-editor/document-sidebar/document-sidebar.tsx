"use client"

import { Eye } from "lucide-react"
import { DocumentStatus } from "@/types/document"
import { documentSidebarStyles } from "./document-sidebar.styles"
import type { Category } from "../document-editor.props"
import MarkdownHelp from "../markdown-help/markdown-help"
import type { DocumentSidebarProps } from "./document-sidebar.props"

export default function DocumentSidebar({
  formData,
  categories,
  onInputChange,
}: DocumentSidebarProps) {
  return (
    <div className={documentSidebarStyles.sidebar}>
      {/* Category */}
      <div className={documentSidebarStyles.sidebarCard}>
        <div className={documentSidebarStyles.sidebarHeader}>
          <Eye className={documentSidebarStyles.sidebarIcon} />
          <h3 className={documentSidebarStyles.sidebarTitle}>Category</h3>
        </div>
        <select
          value={formData.category_id || ""}
          onChange={(e) => onInputChange("category_id", e.target.value || null)}
          className={documentSidebarStyles.select}
        >
          <option value="">Select a category...</option>
          {categories.map((category: Category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
