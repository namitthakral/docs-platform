"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { useFormState } from "react-hook-form"
import { useAutoSave } from "@/hooks/use-auto-save"
import { useDocumentForm } from "@/hooks/use-document-form"
import { useDocumentSave } from "@/hooks/use-document-save"
import { useChangeDetection } from "@/hooks/use-change-detection"
import { DocumentEditorData } from "@/types/document"
import { documentEditorStyles } from "./document-editor.styles"
import { DocumentEditorProps } from "./document-editor.props"
import DocumentEditorHeader from "./document-editor-header/document-editor-header"
import DocumentForm from "./document-form/document-form"
import DocumentPreview from "./document-preview/document-preview"
import DocumentSidebar from "./document-sidebar/document-sidebar"

export default function DocumentEditor({
  document: initialDocument,
}: DocumentEditorProps) {
  const [previewMode, setPreviewMode] = useState(false)
  const [isManualSaving, setIsManualSaving] = useState(false)
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasJustSaved, setHasJustSaved] = useState(false)

  // Track the current document reference (doesn't cause re-renders)
  const currentDocumentRef = useRef(initialDocument)
  
  // Only track if this is a new document for UI logic (starts as new, becomes false after first save)
  const [isNewDocument, setIsNewDocument] = useState(!initialDocument)

  // Form hook - handles all form logic
  const { control, getValues, isSubmitting, reset, handleSubmit } =
    useDocumentForm({ initialDocument, currentDocument: currentDocumentRef.current })

  // Change detection hook - tracks unsaved changes against saved baseline
  const { updateSavedBaseline, hasUnsavedChanges } = useChangeDetection({
    control,
    currentDocument: currentDocumentRef.current,
  })

  // Form state for parent component needs (isDirty for side effects)
  const { isDirty } = useFormState({ control })

  // Update current document ref without causing re-renders
  const setCurrentDocument = useCallback((document: DocumentEditorData | undefined) => {
    currentDocumentRef.current = document
    // Update isNewDocument state only when transitioning from new to existing
    if (document && isNewDocument) {
      setIsNewDocument(false)
    }
  }, [isNewDocument])

  // Auto-save hook - completely independent from parent state
  const { notifyManualSave } = useAutoSave({
    control,
    getValues,
    currentDocument: currentDocumentRef.current,
    setLastSaved,
    setCurrentDocument,
    reset,
    updateSavedBaseline,
  })

  // Document save hook - handles all save operations
  const { handleSaveDraft, handlePublish, isLoading } = useDocumentSave({
    currentDocument: currentDocumentRef.current,
    reset,
    setIsManualSaving,
    setHasJustSaved,
    setLastSaved,
    setPublishedSlug,
    setCurrentDocument,
    updateSavedBaseline,
    notifyManualSave,
  })

  // Initialize lastSaved date on client-side to avoid hydration mismatch
  useEffect(() => {
    if (initialDocument?.updated_at && !lastSaved) {
      setLastSaved(new Date(initialDocument.updated_at))
    }
  }, [initialDocument?.updated_at, lastSaved])

  // Clear hasJustSaved when form becomes dirty after saving
  useEffect(() => {
    if (isDirty && hasJustSaved) {
      setHasJustSaved(false)
    }
  }, [isDirty, hasJustSaved])

  // Warn user about unsaved changes when leaving page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting && !isManualSaving) {
        // Modern approach: just call preventDefault()
        // The browser will show its own confirmation dialog
        e.preventDefault()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isDirty, isSubmitting, isManualSaving])

  // Memoized form submission handlers
  const memoizedHandleSaveDraft = useCallback(() => {
    handleSubmit(handleSaveDraft)()
  }, [handleSubmit, handleSaveDraft])

  const memoizedHandlePublish = useCallback(() => {
    handleSubmit(handlePublish)()
  }, [handleSubmit, handlePublish])

  const handleTogglePreview = useCallback(() => {
    setPreviewMode((prev) => !prev)
  }, [])

  // Memoize state objects to prevent unnecessary re-renders
  const saveState = useMemo(
    () => ({
      saving: isLoading,
      lastSaved,
      hasJustSaved,
      publishedSlug,
    }),
    [isLoading, lastSaved, hasJustSaved, publishedSlug],
  )

  const loadingState = useMemo(
    () => ({
      loading: isLoading && isManualSaving,
      isManualSaving,
    }),
    [isLoading, isManualSaving],
  )

  const editorState = useMemo(
    () => ({
      previewMode,
      hasUnsavedChanges,
    }),
    [previewMode, hasUnsavedChanges],
  )

  return (
    <div className={documentEditorStyles.container}>
      <DocumentEditorHeader
        control={control}
        isNewDocument={isNewDocument}
        saveState={saveState}
        loadingState={loadingState}
        editorState={editorState}
        onTogglePreview={handleTogglePreview}
        onSaveDraft={memoizedHandleSaveDraft}
        onPublish={memoizedHandlePublish}
      />

      <div className={documentEditorStyles.formGrid}>
        {/* Main Editor */}
        <div className={documentEditorStyles.mainEditor}>
          {!previewMode ? (
            <DocumentForm control={control} />
          ) : (
            <DocumentPreview control={control} />
          )}
        </div>

        {/* Sidebar */}
        <DocumentSidebar control={control} />
      </div>
    </div>
  )
}
