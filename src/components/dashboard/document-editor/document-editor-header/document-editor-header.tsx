"use client"

import { Eye, Edit, ExternalLink, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getRoute } from "@/config/routes"
import { documentEditorHeaderStyles } from "./document-editor-header.styles"
import type { DocumentEditorHeaderProps } from "./document-editor-header.props"

export default function DocumentEditorHeader({
  saving,
  lastSaved,
  hasUnsavedChanges,
  hasMetadataChanges,
  previewMode,
  isDraftSaving,
  isPublishing,
  publishedSlug,
  isPublished,
  shouldDisableButtons,
  hasJustSaved,
  onTogglePreview,
  onSaveDraft,
  onPublish,
}: DocumentEditorHeaderProps) {
  return (
    <div className={documentEditorHeaderStyles.header}>
      <div className={documentEditorHeaderStyles.headerContent}>
        <div className={documentEditorHeaderStyles.saveStatus}>
          <div className={documentEditorHeaderStyles.saveStatusIndicator}>
            {saving && (
              <>
                <div className={documentEditorHeaderStyles.savingIndicator} />
                <span className={documentEditorHeaderStyles.saveText}>
                  Saving...
                </span>
              </>
            )}
            {publishedSlug && (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className={documentEditorHeaderStyles.saveText}>
                  Published successfully!
                </span>
                <Link 
                  href={getRoute.docsPage(publishedSlug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 ml-2"
                >
                  View document
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </>
            )}
            {!saving && hasUnsavedChanges && !hasJustSaved && (
              <div className={documentEditorHeaderStyles.unsavedIndicator}>
                <div className={documentEditorHeaderStyles.unsavedDot}></div>
                <span className={documentEditorHeaderStyles.unsavedText}>
                  {hasMetadataChanges
                    ? "Unsaved changes (save to update title/metadata)"
                    : "Unsaved changes"}
                </span>
              </div>
            )}
            {!saving && (!hasUnsavedChanges || hasJustSaved) && lastSaved && (
              <div className={documentEditorHeaderStyles.savedIndicator}>
                <div className={documentEditorHeaderStyles.savedDot}></div>
                <span className={documentEditorHeaderStyles.saveText}>
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onTogglePreview}
            className={documentEditorHeaderStyles.previewButton}
          >
            {previewMode ? (
              <>
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>

        <div className={documentEditorHeaderStyles.actionButtons}>
          <button
            onClick={onSaveDraft}
            disabled={isDraftSaving || isPublishing || shouldDisableButtons}
            className={documentEditorHeaderStyles.draftButton}
          >
            {isDraftSaving ? (
              <div className={documentEditorHeaderStyles.publishButtonLoading}>
                <div
                  className={documentEditorHeaderStyles.publishLoadingSpinner}
                />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Draft"
            )}
          </button>
          <button
            onClick={onPublish}
            disabled={isDraftSaving || isPublishing || shouldDisableButtons}
            className={documentEditorHeaderStyles.publishButton}
          >
            {isPublishing ? (
              <div className={documentEditorHeaderStyles.publishButtonLoading}>
                <div
                  className={documentEditorHeaderStyles.publishLoadingSpinner}
                />
                <span>{isPublished ? "Updating..." : "Publishing..."}</span>
              </div>
            ) : (
              isPublished && hasUnsavedChanges ? "Update" : "Publish"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
