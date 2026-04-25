"use client"

import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { DocumentStatus } from "@/types/document"
import { actionButtonsStyles } from "./action-buttons.styles"
import { ActionButtonsProps } from "./action-buttons.props"

export default function ActionButtons({
  control,
  isNewDocument,
  hasJustSaved,
  hasUnsavedChanges,
  isManualSaving,
  onSaveDraft,
  onPublish,
}: ActionButtonsProps) {
  // Watch only the fields needed for button logic
  const [watchedTitle, watchedContent, watchedStatus] = useWatch({
    control,
    name: ["title", "content", "status"],
  })

  // Button loading states
  const isDraftSaving = isManualSaving && watchedStatus === DocumentStatus.DRAFT
  const isPublishing = isManualSaving && watchedStatus === DocumentStatus.PUBLISHED

  // Calculate shouldDisableButtons
  const shouldDisableButtons = useMemo(() => {
    // Always disable if we just saved
    if (hasJustSaved) {
      return true
    }

    // For new documents, disable if missing required fields (title AND content)
    if (isNewDocument) {
      const hasRequiredFields = Boolean(
        watchedTitle?.trim() && watchedContent?.trim(),
      )
      return !hasRequiredFields
    }

    // For existing documents, disable if no changes from saved document
    return !hasUnsavedChanges
  }, [hasJustSaved, isNewDocument, watchedTitle, watchedContent, hasUnsavedChanges])

  return (
    <div className={actionButtonsStyles.actionButtons}>
      <button
        onClick={onSaveDraft}
        disabled={isDraftSaving || isPublishing || shouldDisableButtons}
        className={actionButtonsStyles.draftButton}
      >
        {isDraftSaving && <div className={actionButtonsStyles.buttonSpinner} />}
        <span>{isDraftSaving ? "Saving Draft..." : "Save Draft"}</span>
      </button>

      <button
        onClick={onPublish}
        disabled={isDraftSaving || isPublishing || shouldDisableButtons}
        className={actionButtonsStyles.publishButton}
      >
        {isPublishing && <div className={actionButtonsStyles.buttonSpinner} />}
        <span>{isPublishing ? "Publishing..." : "Publish"}</span>
      </button>
    </div>
  )
}