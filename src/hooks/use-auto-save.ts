"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Control,
  useWatch,
  UseFormGetValues,
  UseFormReset,
} from "react-hook-form"
import { DocumentFormData } from "@/types/document-editor"
import { DocumentEditorData, DocumentStatus } from "@/types/document"
import { useUpdateDocument } from "./use-document-mutations"

interface UseAutoSaveProps {
  control: Control<DocumentFormData>
  getValues: UseFormGetValues<DocumentFormData>
  currentDocument?: DocumentEditorData
  setLastSaved: (date: Date) => void
  setCurrentDocument: (document: DocumentEditorData | undefined) => void
  reset: UseFormReset<DocumentFormData>
  updateSavedBaseline: (document: DocumentEditorData) => void
}

export function useAutoSave({
  control,
  getValues,
  currentDocument,
  setLastSaved,
  setCurrentDocument,
  reset,
  updateSavedBaseline,
}: UseAutoSaveProps) {
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)
  const updateDocumentMutation = useUpdateDocument()
  
  // Track auto-save internal state independently from parent
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const lastSaveTimeRef = useRef<number>(0)

  // Only watch fields that affect auto-save - isolated re-renders
  const [
    watchedTitle,
    watchedContent,
    watchedSlug,
    watchedDescription,
    watchedStatus,
    watchedCategoryId,
  ] = useWatch({
    control,
    name: ["title", "content", "slug", "description", "status", "category_id"],
  })

  const handleAutoSave = useCallback(async () => {
    if (!currentDocument?.id || isAutoSaving) return

    // Prevent auto-save if a manual save happened recently (within 5 seconds)
    const now = Date.now()
    if (now - lastSaveTimeRef.current < 5000) return

    const formData = getValues()

    // Final check: only save if there are actual changes
    const hasActualChanges =
      (formData.title || "") !== (currentDocument.title || "") ||
      (formData.slug || "") !== (currentDocument.slug || "") ||
      (formData.content || "") !== (currentDocument.content || "") ||
      (formData.description || "") !== (currentDocument.description || "") ||
      formData.status !== currentDocument.status ||
      (formData.category_id || null) !== (currentDocument.category_id || null)

    if (!hasActualChanges) return

    // Exclude tags from auto-save (tags are not updated during auto-save)
    const documentData = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      description: formData.description,
      status: formData.status,
      category_id: formData.category_id,
    }

    try {
      setIsAutoSaving(true)
      
      await updateDocumentMutation.mutateAsync({
        id: currentDocument.id,
        ...documentData,
      })

      const saveTime = new Date()
      setLastSaved(saveTime)
      lastSaveTimeRef.current = saveTime.getTime()

      // Update currentDocument with the exact auto-saved data
      const autoSavedDocumentData: DocumentEditorData = {
        ...currentDocument,
        title: documentData.title,
        slug: documentData.slug,
        content: documentData.content,
        description: documentData.description || "",
        status: documentData.status as DocumentStatus,
        category_id: documentData.category_id,
      }
      setCurrentDocument(autoSavedDocumentData)

      // Update the saved baseline for change detection
      updateSavedBaseline(autoSavedDocumentData)

      // Reset form dirty state after successful auto-save
      reset(formData, { keepValues: true, keepDirty: false })
    } catch (error) {
      console.error("Auto-save failed:", error)
    } finally {
      setIsAutoSaving(false)
    }
  }, [
    currentDocument,
    isAutoSaving,
    getValues,
    updateDocumentMutation,
    setLastSaved,
    setCurrentDocument,
    reset,
    updateSavedBaseline,
  ])

  // Auto-save effect - completely independent from parent state changes
  useEffect(() => {
    // Clear existing timer
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current)
    }

    // Only set auto-save for existing documents
    if (!currentDocument?.id || isAutoSaving) {
      return
    }

    // Set new timer
    autoSaveRef.current = setTimeout(() => {
      // Double-check that we still need to save
      const formData = getValues()
      const stillHasChanges =
        (formData.title || "") !== (currentDocument.title || "") ||
        (formData.slug || "") !== (currentDocument.slug || "") ||
        (formData.content || "") !== (currentDocument.content || "") ||
        (formData.description || "") !== (currentDocument.description || "") ||
        formData.status !== currentDocument.status ||
        (formData.category_id || null) !== (currentDocument.category_id || null)

      if (stillHasChanges) {
        handleAutoSave()
      }
    }, 10000)

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [
    watchedContent,
    watchedTitle,
    watchedSlug,
    watchedStatus,
    watchedCategoryId,
    watchedDescription,
    currentDocument,
    isAutoSaving,
    getValues,
    handleAutoSave,
  ])

  // Cleanup auto-save on unmount
  useEffect(() => {
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [])

  // Return method to notify of manual saves
  const notifyManualSave = useCallback(() => {
    lastSaveTimeRef.current = Date.now()
  }, [])

  return { notifyManualSave }
}
