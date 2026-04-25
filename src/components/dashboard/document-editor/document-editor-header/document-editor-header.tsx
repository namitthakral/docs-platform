"use client"

import { documentEditorHeaderStyles } from "./document-editor-header.styles"
import type { DocumentEditorHeaderProps } from "./document-editor-header.props"
import SaveStatus from "./save-status/save-status"
import ActionButtons from "./action-buttons/action-buttons"
import DocumentIndicators from "./document-indicators/document-indicators"

export default function DocumentEditorHeader({
  control,
  isNewDocument,
  saveState,
  loadingState,
  editorState,
  onTogglePreview,
  onSaveDraft,
  onPublish,
}: DocumentEditorHeaderProps) {
  // Destructure grouped props for readability
  const { saving, lastSaved, hasJustSaved, publishedSlug } = saveState
  const { isManualSaving } = loadingState
  const { previewMode, hasUnsavedChanges } = editorState

  return (
    <div className={documentEditorHeaderStyles.header}>
      <div className={documentEditorHeaderStyles.headerContent}>
        {/* Save Status - only re-renders on save state changes */}
        <SaveStatus
          saving={saving}
          lastSaved={lastSaved}
          hasJustSaved={hasJustSaved}
        />

        <div className={documentEditorHeaderStyles.headerRight}>
          {/* Document Indicators - only re-renders on preview changes */}
          <DocumentIndicators
            control={control}
            publishedSlug={publishedSlug}
            previewMode={previewMode}
            onTogglePreview={onTogglePreview}
          />

          {/* Action Buttons - only re-renders on form/loading state changes */}
          <ActionButtons
            control={control}
            isNewDocument={isNewDocument}
            hasJustSaved={hasJustSaved}
            hasUnsavedChanges={hasUnsavedChanges}
            isManualSaving={isManualSaving}
            onSaveDraft={onSaveDraft}
            onPublish={onPublish}
          />
        </div>
      </div>
    </div>
  )
}
