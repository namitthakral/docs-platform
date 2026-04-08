"use client"

import Link from "next/link"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { Eye, Edit, Trash2, FileText, Share } from "lucide-react"
import { formatRelativeTime } from "@/lib/helpers"
import { DocumentStatus } from "@/types/document"
import {
  useUpdateDocument,
  useDeleteDocument,
} from "@/hooks/use-document-mutations"
import { DocumentsTableProps, Document } from "./documents-table.props"
import { documentsTableStyles } from "./documents-table.styles"
import { getRoute } from "@/config/routes"
import ConfirmationDialog from "@/components/shared/confirmation-dialog/confirmation-dialog"

export default function DocumentsTable({ documents }: DocumentsTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    document: Document | null
  }>({
    isOpen: false,
    document: null,
  })
  const queryClient = useQueryClient()

  // Mutation hooks
  const updateDocumentMutation = useUpdateDocument()
  const deleteDocumentMutation = useDeleteDocument()

  const handleStatusToggle = async (doc: Document) => {
    setLoading(doc.id)

    const newStatus: DocumentStatus =
      doc.status === DocumentStatus.PUBLISHED
        ? DocumentStatus.DRAFT
        : DocumentStatus.PUBLISHED

    try {
      // Fetch the full document using queryClient.fetchQuery for better caching
      const fullDoc = await queryClient.fetchQuery({
        queryKey: queryKeys.documents.detail(doc.id),
        queryFn: async () => {
          const response = await fetch(getRoute.api.documents(doc.id))
          if (!response.ok) {
            throw new Error("Failed to fetch document")
          }
          const { document } = await response.json()
          return document
        },
        staleTime: 30 * 1000, // 30 seconds
      })

      updateDocumentMutation.mutate(
        {
          id: doc.id,
          title: fullDoc.title,
          slug: fullDoc.slug,
          content: fullDoc.content,
          description: fullDoc.description,
          category_id: fullDoc.category_id,
          status: newStatus,
        },
        {
          onSuccess: () => {
            setLoading(null)
          },
          onError: () => {
            setLoading(null)
          },
        },
      )
    } catch (error) {
      console.error("Error fetching document:", error)
      setLoading(null)
    }
  }

  const handleDelete = (doc: Document) => {
    setDeleteDialog({ isOpen: true, document: doc })
  }

  const confirmDelete = () => {
    if (!deleteDialog.document) return

    deleteDocumentMutation.mutate(deleteDialog.document.id)
    setDeleteDialog({ isOpen: false, document: null })
  }

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, document: null })
  }

  const handleShare = async (doc: Document) => {
    const url = `${window.location.origin}${getRoute.docsPage(doc.slug)}`

    try {
      await navigator.clipboard.writeText(url)
      // Note: Could add a toast notification here in the future
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
  }

  if (documents.length === 0) {
    return (
      <div className={documentsTableStyles.emptyContainer}>
        <FileText className={documentsTableStyles.emptyIcon} />
        <h3 className={documentsTableStyles.emptyTitle}>No documents</h3>
        <p className={documentsTableStyles.emptyDescription}>
          Get started by creating your first document.
        </p>
        <div className={documentsTableStyles.emptyActions}>
          <Link
            href={getRoute.dashboard.documentsNew()}
            className={documentsTableStyles.createButton}
          >
            Create Document
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={documentsTableStyles.container}>
      <table className={documentsTableStyles.table}>
        <thead className={documentsTableStyles.tableHead}>
          <tr>
            <th className={documentsTableStyles.headerCellCenter}>Title</th>
            <th className={documentsTableStyles.headerCellCenter}>Category</th>
            <th className={documentsTableStyles.headerCellCenter}>Status</th>
            <th className={documentsTableStyles.headerCellCenter}>Updated</th>
            <th className={documentsTableStyles.headerCellRight}>Actions</th>
          </tr>
        </thead>
        <tbody className={documentsTableStyles.tableBody}>
          {documents.map((doc) => (
            <tr key={doc.id} className={documentsTableStyles.tableRow}>
              <td className={documentsTableStyles.cellCenter}>
                <div className={documentsTableStyles.titleContainer}>
                  <div className={documentsTableStyles.title}>{doc.title}</div>
                  <div className={documentsTableStyles.slug}>/{doc.slug}</div>
                </div>
              </td>
              <td className={documentsTableStyles.cellCenter}>
                {doc.categories ? (
                  <span className={documentsTableStyles.categoryBadge}>
                    {doc.categories.name}
                  </span>
                ) : (
                  <span className={documentsTableStyles.uncategorized}>
                    Uncategorized
                  </span>
                )}
              </td>
              <td className={documentsTableStyles.cellCenter}>
                <button
                  onClick={() => handleStatusToggle(doc)}
                  disabled={loading === doc.id}
                  className={`${documentsTableStyles.statusButton} ${
                    doc.status === DocumentStatus.PUBLISHED
                      ? documentsTableStyles.statusPublished
                      : documentsTableStyles.statusDraft
                  } ${loading === doc.id ? documentsTableStyles.statusLoading : documentsTableStyles.statusClickable}`}
                >
                  {loading === doc.id ? (
                    <div className={documentsTableStyles.loadingSpinner} />
                  ) : null}
                  {doc.status === DocumentStatus.PUBLISHED
                    ? "Published"
                    : "Draft"}
                </button>
              </td>
              <td
                className={`${documentsTableStyles.cellCenter} ${documentsTableStyles.timeText}`}
              >
                {formatRelativeTime(doc.updated_at)}
              </td>
              <td className={documentsTableStyles.cellRight}>
                {doc.status === DocumentStatus.PUBLISHED && (
                  <Link
                    href={getRoute.docsPage(doc.slug)}
                    target="_blank"
                    className={documentsTableStyles.viewLink}
                    title="View document"
                  >
                    <Eye className={documentsTableStyles.actionIcon} />
                  </Link>
                )}
                {doc.status === DocumentStatus.PUBLISHED && (
                  <button
                    onClick={() => handleShare(doc)}
                    className={documentsTableStyles.shareButton}
                    title="Copy document link"
                  >
                    <Share className={documentsTableStyles.actionIcon} />
                  </button>
                )}
                <Link
                  href={getRoute.dashboard.document(doc.id)}
                  className={documentsTableStyles.editLink}
                  title="Edit document"
                >
                  <Edit className={documentsTableStyles.actionIcon} />
                </Link>
                <button
                  onClick={() => handleDelete(doc)}
                  disabled={loading === doc.id}
                  className={documentsTableStyles.deleteButton}
                  title="Delete document"
                >
                  <Trash2 className={documentsTableStyles.actionIcon} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Document"
        message={
          deleteDialog.document
            ? `Are you sure you want to delete "${deleteDialog.document.title}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteDocumentMutation.isPending}
      />
    </div>
  )
}
