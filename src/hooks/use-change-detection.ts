"use client"

import { useState, useMemo, useCallback } from "react"
import { Control, useWatch } from "react-hook-form"
import { DocumentFormData } from "@/types/document-editor"
import { DocumentEditorData } from "@/types/document"

interface UseChangeDetectionProps {
  control: Control<DocumentFormData>
  currentDocument?: DocumentEditorData
}

export function useChangeDetection({ control, currentDocument }: UseChangeDetectionProps) {
  // Track the baseline that we compare against (last saved state)
  const [savedBaseline, setSavedBaseline] = useState<DocumentEditorData | undefined>(currentDocument)

  // Watch all form values that matter for change detection
  const formValues = useWatch({ control })

  // Calculate if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    // For new documents, check if there's any meaningful content
    if (!savedBaseline) {
      return Boolean(
        formValues.title?.trim() ||
        formValues.content?.trim() ||
        formValues.description?.trim()
      )
    }

    // For existing documents, compare current form values with saved baseline
    return (
      (formValues.title || "") !== (savedBaseline.title || "") ||
      (formValues.slug || "") !== (savedBaseline.slug || "") ||
      (formValues.content || "") !== (savedBaseline.content || "") ||
      (formValues.description || "") !== (savedBaseline.description || "") ||
      formValues.status !== savedBaseline.status ||
      (formValues.category_id || null) !== (savedBaseline.category_id || null)
    )
  }, [formValues, savedBaseline])


  // Update the saved baseline when document is saved (called after successful save operations)
  const updateSavedBaseline = useCallback((newDocument: DocumentEditorData) => {
    setSavedBaseline(newDocument)
  }, [])

  // Reset baseline (useful when switching documents)
  const resetBaseline = useCallback((document?: DocumentEditorData) => {
    setSavedBaseline(document)
  }, [])

  return {
    hasUnsavedChanges,
    updateSavedBaseline,
    resetBaseline,
    savedBaseline,
  }
}