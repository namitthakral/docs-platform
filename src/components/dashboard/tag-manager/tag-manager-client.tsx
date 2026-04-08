"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Tag as TagIcon } from "lucide-react"
import { useTags } from "@/hooks/use-tags"
import {
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "@/hooks/use-tag-mutations"
import TagSkeleton from "@/components/shared/tag-skeleton/tag-skeleton"
import { tagManagerStyles } from "./tag-manager.styles"
import ConfirmationDialog from "@/components/shared/confirmation-dialog/confirmation-dialog"

export default function TagManagerClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingTag, setEditingTag] = useState<{
    id: string
    name: string
  } | null>(null)
  const [newTagName, setNewTagName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    tag: { id: string; name: string } | null
  }>({ isOpen: false, tag: null })

  const { tags, isLoading } = useTags({
    search: searchQuery,
    withCounts: true,
  })

  const createTagMutation = useCreateTag()
  const updateTagMutation = useUpdateTag()
  const deleteTagMutation = useDeleteTag()

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    setError(null)
    try {
      await createTagMutation.mutateAsync({ name: newTagName.trim() })
      setNewTagName("")
      setIsCreating(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tag")
    }
  }

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.name.trim()) return

    setError(null)
    try {
      await updateTagMutation.mutateAsync({
        id: editingTag.id,
        name: editingTag.name.trim(),
      })
      setEditingTag(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tag")
    }
  }

  const handleDeleteTag = (id: string, name: string) => {
    setDeleteDialog({ isOpen: true, tag: { id, name } })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.tag) return

    setError(null)
    try {
      await deleteTagMutation.mutateAsync(deleteDialog.tag.id)
      setDeleteDialog({ isOpen: false, tag: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tag")
      setDeleteDialog({ isOpen: false, tag: null })
    }
  }

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, tag: null })
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: "create" | "edit") => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (action === "create") {
        handleCreateTag()
      } else {
        handleUpdateTag()
      }
    } else if (e.key === "Escape") {
      if (action === "create") {
        setIsCreating(false)
        setNewTagName("")
      } else {
        setEditingTag(null)
      }
    }
  }

  return (
    <div className={tagManagerStyles.container}>
      {/* Desktop Header */}
      <div className={tagManagerStyles.desktopHeader}>
        <div className={tagManagerStyles.headerContent}>
          <h1 className={tagManagerStyles.pageTitle}>Tags</h1>
          <p className={tagManagerStyles.pageDescription}>
            Create and manage tags to organize your documentation content
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
          className={tagManagerStyles.createButton}
        >
          <Plus className={tagManagerStyles.createIcon} />
          Create Tag
        </button>
      </div>

      {/* Mobile Header */}
      <div className={tagManagerStyles.mobileHeader}>
        <div className={tagManagerStyles.headerContent}>
          <h1 className={tagManagerStyles.pageTitle}>Tags</h1>
          <p className={tagManagerStyles.pageDescription}>
            Create and manage tags to organize your documentation content
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
          className={tagManagerStyles.mobileCreateButton}
        >
          <Plus className={tagManagerStyles.createIcon} />
          Create Tag
        </button>
      </div>

      {/* Search Section */}
      <div className={tagManagerStyles.searchContainer}>
        <Search className={tagManagerStyles.searchIcon} />
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={tagManagerStyles.searchInput}
        />
      </div>

      {/* Error Message */}
      {error && <div className={tagManagerStyles.error}>{error}</div>}

      {/* Create Tag Form */}
      {isCreating && (
        <div className={tagManagerStyles.createForm}>
          <input
            type="text"
            placeholder="Enter tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "create")}
            className={tagManagerStyles.createInput}
            autoFocus
          />
          <div className={tagManagerStyles.createActions}>
            <button
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || createTagMutation.isPending}
              className={tagManagerStyles.saveButton}
            >
              {createTagMutation.isPending ? "Creating..." : "Create"}
            </button>
            <button
              onClick={() => {
                setIsCreating(false)
                setNewTagName("")
              }}
              className={tagManagerStyles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tags List */}
      <div className={tagManagerStyles.content}>
        {tags.length === 0 && !isLoading ? (
          <div className={tagManagerStyles.empty}>
            <TagIcon className={tagManagerStyles.emptyIcon} />
            <h3 className={tagManagerStyles.emptyTitle}>
              {searchQuery ? "No tags found" : "No tags yet"}
            </h3>
            <p className={tagManagerStyles.emptyDescription}>
              {searchQuery
                ? `No tags match "${searchQuery}"`
                : "Create your first tag to start organizing your content"}
            </p>
          </div>
        ) : isLoading ? (
          <TagSkeleton count={6} />
        ) : (
          <div className={tagManagerStyles.tagsList}>
            {tags.map((tag) => (
              <div key={tag.id} className={tagManagerStyles.tagItem}>
                {editingTag?.id === tag.id ? (
                  <div className={tagManagerStyles.editForm}>
                    <input
                      type="text"
                      value={editingTag.name}
                      onChange={(e) =>
                        setEditingTag({ ...editingTag, name: e.target.value })
                      }
                      onKeyDown={(e) => handleKeyDown(e, "edit")}
                      className={tagManagerStyles.editInput}
                      autoFocus
                    />
                    <div className={tagManagerStyles.editActions}>
                      <button
                        onClick={handleUpdateTag}
                        disabled={
                          !editingTag.name.trim() || updateTagMutation.isPending
                        }
                        className={tagManagerStyles.saveButton}
                      >
                        {updateTagMutation.isPending ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingTag(null)}
                        className={tagManagerStyles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={tagManagerStyles.tagContent}>
                    <div className={tagManagerStyles.tagInfo}>
                      <div className={tagManagerStyles.tagName}>{tag.name}</div>
                      <div className={tagManagerStyles.tagUsage}>
                        {tag.usage_count || 0} document
                        {(tag.usage_count || 0) !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className={tagManagerStyles.tagActions}>
                      <button
                        onClick={() =>
                          setEditingTag({ id: tag.id, name: tag.name })
                        }
                        className={tagManagerStyles.editButton}
                        title="Edit tag"
                      >
                        <Edit className={tagManagerStyles.actionIcon} />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id, tag.name)}
                        disabled={
                          deleteTagMutation.isPending ||
                          (tag.usage_count || 0) > 0
                        }
                        className={tagManagerStyles.deleteButton}
                        title={
                          (tag.usage_count || 0) > 0
                            ? "Cannot delete tag that is in use"
                            : "Delete tag"
                        }
                      >
                        <Trash2 className={tagManagerStyles.actionIcon} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Tag"
        message={
          deleteDialog.tag
            ? `Are you sure you want to delete the tag "${deleteDialog.tag.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteTagMutation.isPending}
      />
    </div>
  )
}
