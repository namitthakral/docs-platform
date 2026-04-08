"use client"

import { Eye, Edit } from "lucide-react"
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
  isRedirecting = false,
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
            {isRedirecting && (
              <>
                <div className={documentEditorHeaderStyles.savingIndicator} />
                <span className={documentEditorHeaderStyles.saveText}>
                  Published! Redirecting to document...
                </span>
              </>
            )}
            {!saving && !isRedirecting && hasUnsavedChanges && (
              <div className={documentEditorHeaderStyles.unsavedIndicator}>
                <div className={documentEditorHeaderStyles.unsavedDot}></div>
                <span className={documentEditorHeaderStyles.unsavedText}>
                  {hasMetadataChanges
                    ? "Unsaved changes (save to update title/metadata)"
                    : "Unsaved changes"}
                </span>
              </div>
            )}
            {!saving && !isRedirecting && !hasUnsavedChanges && lastSaved && (
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
            disabled={isDraftSaving || isPublishing}
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
            disabled={isDraftSaving || isPublishing || isRedirecting}
            className={documentEditorHeaderStyles.publishButton}
          >
            {isPublishing ? (
              <div className={documentEditorHeaderStyles.publishButtonLoading}>
                <div
                  className={documentEditorHeaderStyles.publishLoadingSpinner}
                />
                <span>Publishing...</span>
              </div>
            ) : isRedirecting ? (
              <div className={documentEditorHeaderStyles.publishButtonLoading}>
                <div
                  className={documentEditorHeaderStyles.publishLoadingSpinner}
                />
                <span>Redirecting...</span>
              </div>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
