"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Tag } from "lucide-react"
import { generateSlug } from "@/lib/helpers"
import { CategoryWithDocumentCount } from "@/types/category"
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-category-mutations"
import type {
  CategoriesManagerProps,
  CategoryFormData,
} from "./categories-manager.props"
import { categoriesManagerStyles } from "./categories-manager.styles"
import ConfirmationDialog from "@/components/shared/confirmation-dialog/confirmation-dialog"

export default function CategoriesManager({
  categories,
  externalShowForm = false,
  onCloseForm,
}: CategoriesManagerProps) {
  const [showForm, setShowForm] = useState(false)

  // Use external form control if provided
  const isFormVisible = externalShowForm || showForm
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithDocumentCount | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    parent_id: null,
  })
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    category: CategoryWithDocumentCount | null
  }>({
    isOpen: false,
    category: null,
  })

  const router = useRouter()

  // Mutation hooks
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const deleteCategoryMutation = useDeleteCategory()

  // Loading state from mutations
  const loading =
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending ||
    deleteCategoryMutation.isPending

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      parent_id: null,
    })
    setEditingCategory(null)
    setIsSlugManuallyEdited(false)
    setShowForm(false)
    onCloseForm?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const categoryData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.name),
    }

    if (editingCategory) {
      // Update existing category
      updateCategoryMutation.mutate(
        {
          id: editingCategory.id,
          ...categoryData,
        },
        {
          onSuccess: (response) => {
            resetForm()
            router.refresh()
          },
          onError: (error: Error) => {
            console.error("Error updating category:", error)
          },
        },
      )
    } else {
      // Create new category
      createCategoryMutation.mutate(categoryData, {
        onSuccess: (response) => {
          resetForm()
          router.refresh()
        },
        onError: (error: Error) => {
          console.error("Error creating category:", error)
        },
      })
    }
  }

  const handleEdit = (category: CategoryWithDocumentCount) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parent_id: category.parent_id,
    })
    setEditingCategory(category)
    setIsSlugManuallyEdited(true) // When editing, consider slug as manually set
    setShowForm(true)
  }

  const handleDelete = (category: CategoryWithDocumentCount) => {
    setDeleteDialog({ isOpen: true, category })
  }

  const confirmDelete = () => {
    if (!deleteDialog.category) return

    const documentCount = deleteDialog.category.documents?.[0]?.count || 0
    
    // Check if this category has subcategories
    const hasSubcategories = categories.some(cat => cat.parent_id === deleteDialog.category?.id)
    
    // If category has documents or subcategories, just close the dialog (this is an info dialog)
    if (documentCount > 0 || hasSubcategories) {
      setDeleteDialog({ isOpen: false, category: null })
      return
    }

    // Otherwise, proceed with deletion
    deleteCategoryMutation.mutate(deleteDialog.category.id, {
      onSuccess: () => {
        router.refresh()
        setDeleteDialog({ isOpen: false, category: null })
      },
      onError: (error) => {
        console.error("Error deleting category:", error)
        setDeleteDialog({ isOpen: false, category: null })
      },
    })
  }

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, category: null })
  }

  return (
    <div className={categoriesManagerStyles.container}>
      {/* Category Form */}
      {isFormVisible && (
        <div className={categoriesManagerStyles.formContainer}>
          <h3 className={categoriesManagerStyles.formTitle}>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className={categoriesManagerStyles.formGrid}
          >
            <div className={categoriesManagerStyles.formGridCols}>
              <div className={categoriesManagerStyles.inputGroup}>
                <label
                  htmlFor="name"
                  className={categoriesManagerStyles.inputLabel}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: isSlugManuallyEdited ? prev.slug : generateSlug(e.target.value),
                    }))
                  }}
                  className={categoriesManagerStyles.textInput}
                  placeholder="Category name"
                  required
                />
              </div>

              <div className={categoriesManagerStyles.inputGroup}>
                <label
                  htmlFor="slug"
                  className={categoriesManagerStyles.inputLabel}
                >
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    setIsSlugManuallyEdited(true)
                  }}
                  className={categoriesManagerStyles.textInput}
                  placeholder="category-slug"
                />
              </div>
            </div>

            <div className={categoriesManagerStyles.inputGroup}>
              <label
                htmlFor="description"
                className={categoriesManagerStyles.inputLabel}
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={categoriesManagerStyles.textarea}
                placeholder="Brief description of this category"
              />
            </div>

            <div className={categoriesManagerStyles.buttonGroup}>
              <button
                type="button"
                onClick={resetForm}
                className={categoriesManagerStyles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={categoriesManagerStyles.submitButton}
              >
                {loading ? "Saving..." : editingCategory ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className={categoriesManagerStyles.tableContainer}>
        {categories.length === 0 ? (
          <div className={categoriesManagerStyles.emptyContainer}>
            <Tag className={categoriesManagerStyles.emptyIcon} />
            <h3 className={categoriesManagerStyles.emptyTitle}>
              No categories
            </h3>
            <p className={categoriesManagerStyles.emptyDescription}>
              Get started by creating your first category.
            </p>
          </div>
        ) : (
          <table className={categoriesManagerStyles.table}>
            <thead className={categoriesManagerStyles.tableHead}>
              <tr>
                <th className={categoriesManagerStyles.headerCellCenter}>Name</th>
                <th className={categoriesManagerStyles.headerCellCenter}>Slug</th>
                <th className={categoriesManagerStyles.headerCellCenter}>
                  Documents
                </th>
                <th className={categoriesManagerStyles.headerCellRight}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={categoriesManagerStyles.tableBody}>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className={categoriesManagerStyles.tableRow}
                >
                  <td className={categoriesManagerStyles.cellCenter}>
                    <div>
                      <div className={categoriesManagerStyles.categoryName}>
                        {category.name}
                      </div>
                      {category.description && (
                        <div
                          className={
                            categoriesManagerStyles.categoryDescription
                          }
                        >
                          {category.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td
                    className={`${categoriesManagerStyles.cellCenter} ${categoriesManagerStyles.categorySlug}`}
                  >
                    /{category.slug}
                  </td>
                  <td
                    className={`${categoriesManagerStyles.cellCenter} ${categoriesManagerStyles.documentCount}`}
                  >
                    {category.documents?.[0]?.count || 0} documents
                  </td>
                  <td className={categoriesManagerStyles.cellRight}>
                    <button
                      onClick={() => handleEdit(category)}
                      className={categoriesManagerStyles.editButton}
                      title="Edit category"
                    >
                      <Edit className={categoriesManagerStyles.actionIcon} />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      disabled={loading}
                      className={categoriesManagerStyles.deleteButton}
                      title="Delete category"
                    >
                      <Trash2 className={categoriesManagerStyles.actionIcon} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={
          deleteDialog.category
            ? (() => {
                const documentCount = deleteDialog.category.documents?.[0]?.count || 0
                const hasSubcategories = categories.some(cat => cat.parent_id === deleteDialog.category?.id)
                const subcategoryCount = categories.filter(cat => cat.parent_id === deleteDialog.category?.id).length
                
                if (documentCount > 0 && hasSubcategories) {
                  return `Cannot delete category "${deleteDialog.category.name}" because it contains ${documentCount} document(s) and has ${subcategoryCount} subcategory(ies). Please move or delete them first.`
                } else if (documentCount > 0) {
                  return `Cannot delete category "${deleteDialog.category.name}" because it contains ${documentCount} document(s). Please move or delete the documents first.`
                } else if (hasSubcategories) {
                  return `Cannot delete category "${deleteDialog.category.name}" because it has ${subcategoryCount} subcategory(ies). Please move or delete the subcategories first.`
                }
                return `Are you sure you want to delete "${deleteDialog.category.name}"? This action cannot be undone.`
              })()
            : ""
        }
        confirmText={
          deleteDialog.category && 
          ((deleteDialog.category.documents?.[0]?.count || 0) > 0 || 
           categories.some(cat => cat.parent_id === deleteDialog.category?.id))
            ? "OK"
            : "Delete"
        }
        cancelText={
          deleteDialog.category && 
          ((deleteDialog.category.documents?.[0]?.count || 0) > 0 || 
           categories.some(cat => cat.parent_id === deleteDialog.category?.id))
            ? undefined
            : "Cancel"
        }
        variant={
          deleteDialog.category && 
          ((deleteDialog.category.documents?.[0]?.count || 0) > 0 || 
           categories.some(cat => cat.parent_id === deleteDialog.category?.id))
            ? "warning"
            : "danger"
        }
        isLoading={deleteCategoryMutation.isPending}
      />
    </div>
  )
}
