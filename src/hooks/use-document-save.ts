"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { UseFormReset } from "react-hook-form"
import { DocumentFormData } from "@/types/document-editor"
import { DocumentStatus, DocumentEditorData } from "@/types/document"
import { getRoute } from "@/config/routes"
import {
  useCreateDocument,
  useUpdateDocument,
} from "@/hooks/use-document-mutations"
import { useUpdateDocumentTags } from "@/hooks/use-tag-mutations"

interface UseDocumentSaveProps {
  currentDocument?: DocumentEditorData
  reset: UseFormReset<DocumentFormData>
  setIsManualSaving: (saving: boolean) => void
  setHasJustSaved: (saved: boolean) => void
  setLastSaved: (date: Date) => void
  setPublishedSlug: (slug: string | null) => void
  setCurrentDocument: (document: DocumentEditorData | undefined) => void
  updateSavedBaseline: (document: DocumentEditorData) => void
  notifyManualSave: () => void
}

export function useDocumentSave({
  currentDocument,
  reset,
  setIsManualSaving,
  setHasJustSaved,
  setLastSaved,
  setPublishedSlug,
  setCurrentDocument,
  updateSavedBaseline,
  notifyManualSave,
}: UseDocumentSaveProps) {
  const router = useRouter()
  const createDocumentMutation = useCreateDocument()
  const updateDocumentMutation = useUpdateDocument()
  const updateDocumentTagsMutation = useUpdateDocumentTags()

  const handleSave = useCallback(
    async (data: DocumentFormData, status: DocumentStatus) => {
      const { tags, ...documentData } = data
      const saveData = { ...documentData, status }

      // Note: Auto-save is now handled by the useAutoSave hook
      setIsManualSaving(true)
      setHasJustSaved(true) // Immediately indicate we're saving

      try {
        if (currentDocument?.id) {
          // Update existing document
          await updateDocumentMutation.mutateAsync({
            id: currentDocument.id,
            ...saveData,
          })

          // Update document tags
          if (tags && tags.length > 0) {
            const tagIds = tags.map((tag) => tag.id)
            await updateDocumentTagsMutation.mutateAsync({
              documentId: currentDocument.id,
              tagIds,
            })
          }

          setLastSaved(new Date())
          notifyManualSave() // Notify auto-save hook to avoid conflicts

          // Update currentDocument with the exact saved data to ensure comparison logic works
          const updatedDocumentData: DocumentEditorData = {
            ...currentDocument!,
            title: saveData.title,
            slug: saveData.slug,
            content: saveData.content,
            description: saveData.description || "",
            status: saveData.status,
            category_id: saveData.category_id,
          }
          setCurrentDocument(updatedDocumentData)

          // Update the saved baseline for change detection
          updateSavedBaseline(updatedDocumentData)

          // Reset form with the EXACT saved data to ensure perfect sync
          const formResetData = {
            title: saveData.title,
            slug: saveData.slug,
            content: saveData.content,
            description: saveData.description,
            status: saveData.status,
            category_id: saveData.category_id,
            tags: data.tags, // Keep existing tags
          }
          reset(formResetData, { keepValues: true, keepDirty: false })

          // Show success message for publishing
          if (status === DocumentStatus.PUBLISHED) {
            setPublishedSlug(saveData.slug)
            setTimeout(() => setPublishedSlug(null), 10000)
          }
        } else {
          // Create new document
          const result = await createDocumentMutation.mutateAsync(saveData)

          // Update document tags for newly created document
          if (tags && tags.length > 0) {
            const tagIds = tags.map((tag) => tag.id)
            await updateDocumentTagsMutation.mutateAsync({
              documentId: result.data.id,
              tagIds,
            })
          }

          setLastSaved(new Date())
          notifyManualSave() // Notify auto-save hook to avoid conflicts

          const savedDocumentData: DocumentEditorData = {
            ...result.data,
            description: saveData.description || "",
            status: saveData.status,
          }
          setCurrentDocument(savedDocumentData)

          // Update the saved baseline for change detection
          updateSavedBaseline(savedDocumentData)

          // Reset form with the EXACT saved data to ensure perfect sync
          const formResetData = {
            title: saveData.title,
            slug: saveData.slug,
            content: saveData.content,
            description: saveData.description,
            status: saveData.status,
            category_id: saveData.category_id,
            tags: data.tags, // Keep existing tags
          }
          reset(formResetData, { keepValues: true, keepDirty: false })

          // Show success message for publishing
          if (status === DocumentStatus.PUBLISHED) {
            setPublishedSlug(saveData.slug)
            setTimeout(() => setPublishedSlug(null), 10000)
          } else {
            // For draft documents, redirect to edit page
            router.push(getRoute.dashboard.document(result.data.id))
          }
        }
      } catch (error) {
        console.error("Save failed:", error)
        // Clear hasJustSaved immediately on error since we didn't actually save
        setHasJustSaved(false)
      } finally {
        setIsManualSaving(false)

        // Don't clear hasJustSaved with a timeout - let it be cleared when user makes changes
        // This prevents the intermediate "unsaved changes" state
      }
    },
    [
      currentDocument,
      updateDocumentMutation,
      createDocumentMutation,
      updateDocumentTagsMutation,
      setIsManualSaving,
      setHasJustSaved,
      setLastSaved,
      setPublishedSlug,
      setCurrentDocument,
      reset,
      router,
      updateSavedBaseline,
      notifyManualSave,
    ]
  )

  const handleSaveDraft = useCallback(
    (data: DocumentFormData) => handleSave(data, DocumentStatus.DRAFT),
    [handleSave]
  )

  const handlePublish = useCallback(
    (data: DocumentFormData) => handleSave(data, DocumentStatus.PUBLISHED),
    [handleSave]
  )

  return {
    handleSave,
    handleSaveDraft,
    handlePublish,
    isLoading: updateDocumentMutation.isPending || createDocumentMutation.isPending,
  }
}