"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { generateSlug } from "@/lib/helpers"
import {
  useCreateDocument,
  useUpdateDocument,
} from "@/hooks/use-document-mutations"
import { useUpdateDocumentTags } from "@/hooks/use-tag-mutations"
import { useDocumentTags } from "@/hooks/use-tags"
import { documentEditorStyles } from "./document-editor.styles"
import {
  DocumentData,
  DocumentEditorProps,
  FormErrors,
} from "./document-editor.props"
import { DocumentStatus } from "@/types/document"
import { Tag } from "@/types/tag"
import { getRoute } from "@/config/routes"
import DocumentEditorHeader from "./document-editor-header/document-editor-header"
import DocumentForm from "./document-form/document-form"
import DocumentPreview from "./document-preview/document-preview"
import DocumentSidebar from "./document-sidebar/document-sidebar"

// Zod schema for form validation
const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  content: z.string().min(1, "Content is required"),
  description: z.string(),
  status: z.enum([DocumentStatus.DRAFT, DocumentStatus.PUBLISHED]),
  category_id: z.string().nullable(),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      created_at: z.string(),
    }),
  ),
})

type DocumentFormData = z.infer<typeof documentSchema>

export default function DocumentEditor({
  document: initialDocument,
}: DocumentEditorProps) {
  const router = useRouter()
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [isManualSaving, setIsManualSaving] = useState(false)
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(
    initialDocument?.updated_at ? new Date(initialDocument.updated_at) : null,
  )
  const [hasJustSaved, setHasJustSaved] = useState(false)

  // Track the current document state (can change after creation)
  const [currentDocument, setCurrentDocument] = useState(initialDocument)

  // Initialize form with react-hook-form
  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: initialDocument?.title || "",
      slug: initialDocument?.slug || "",
      content: initialDocument?.content || "",
      description: initialDocument?.description || "",
      status: initialDocument?.status || DocumentStatus.DRAFT,
      category_id: initialDocument?.category_id || null,
      tags: [],
    },
    mode: "onChange",
  })

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = form

  // Convert react-hook-form errors to the expected FormErrors format
  const formErrors: FormErrors = Object.keys(errors).reduce((acc, key) => {
    const error = errors[key as keyof DocumentFormData]
    if (error?.message) {
      acc[key] = error.message
    }
    return acc
  }, {} as FormErrors)

  // Watch specific fields
  const watchedTitle = useWatch({ control: form.control, name: "title" })
  const watchedContent = useWatch({ control: form.control, name: "content" })
  const watchedSlug = useWatch({ control: form.control, name: "slug" })
  const watchedStatus = useWatch({ control: form.control, name: "status" })
  const watchedCategoryId = useWatch({ control: form.control, name: "category_id" })
  const watchedDescription = useWatch({ control: form.control, name: "description" })

  // Mutation hooks
  const createDocumentMutation = useCreateDocument()
  const updateDocumentMutation = useUpdateDocument()
  const updateDocumentTagsMutation = useUpdateDocumentTags()

  // Fetch document tags if editing existing document
  const { data: documentTags = [] } = useDocumentTags(currentDocument?.id || "")

  // Sync document tags with form data
  useEffect(() => {
    if (documentTags.length > 0) {
      setValue("tags", documentTags)
    }
  }, [documentTags, setValue])

  // Query for categories
  const { data: categoriesResponse } = useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: async () => {
      const response = await fetch(getRoute.api.categories())
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      return response.json()
    },
  })

  const categories = categoriesResponse?.categories || []

  // Auto-generate slug from title for new documents
  useEffect(() => {
    // Only for new documents (no currentDocument)
    if (!currentDocument && watchedTitle) {
      const expectedSlug = generateSlug(watchedTitle)

      // For new documents, always auto-generate unless user manually edited slug
      // We'll track manual edits with a ref or state if needed
      setValue("slug", expectedSlug, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [watchedTitle, currentDocument, setValue])

  const handleAutoSave = useCallback(async () => {
    if (!currentDocument?.id || isManualSaving || hasJustSaved) return

    const formData = getValues()

    // Final check: only save if there are actual changes
    const hasActualChanges =
      (formData.title || "") !== (currentDocument.title || "") ||
      (formData.slug || "") !== (currentDocument.slug || "") ||
      (formData.content || "") !== (currentDocument.content || "") ||
      (formData.description || "") !== (currentDocument.description || "") ||
      formData.status !== currentDocument.status ||
      (formData.category_id || null) !== (currentDocument.category_id || null)

    if (!hasActualChanges) {
      return
    }

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
      await updateDocumentMutation.mutateAsync({
        id: currentDocument.id,
        ...documentData,
      })

      setLastSaved(new Date())

      // Update currentDocument with the exact auto-saved data
      const autoSavedDocumentData = {
        ...currentDocument,
        title: documentData.title,
        slug: documentData.slug,
        content: documentData.content,
        description: documentData.description,
        status: documentData.status,
        category_id: documentData.category_id,
      }
      setCurrentDocument(autoSavedDocumentData)

      // Reset form dirty state after successful auto-save
      reset(formData, { keepValues: true, keepDirty: false })
    } catch (error) {
      console.error("Auto-save failed:", error)
    }
  }, [
    currentDocument,
    isManualSaving,
    hasJustSaved,
    getValues,
    updateDocumentMutation,
    setLastSaved,
    setCurrentDocument,
    reset,
  ])

  // Smart auto-save functionality - only saves when there are actual changes
  useEffect(() => {
    // Only auto-save for existing documents (not new documents)
    if (
      !currentDocument?.id ||
      isSubmitting ||
      isManualSaving ||
      hasJustSaved
    ) {
      return
    }

    // Check if current form data actually differs from saved document
    const formData = getValues()
    const hasActualChanges =
      (formData.title || "") !== (currentDocument.title || "") ||
      (formData.slug || "") !== (currentDocument.slug || "") ||
      (formData.content || "") !== (currentDocument.content || "") ||
      (formData.description || "") !== (currentDocument.description || "") ||
      formData.status !== currentDocument.status ||
      (formData.category_id || null) !== (currentDocument.category_id || null)

    // Clear hasJustSaved if there are actual changes (user made edits after saving)
    if (hasActualChanges && hasJustSaved) {
      setHasJustSaved(false)
    }

    // Only set up auto-save if there are actual changes
    if (!hasActualChanges) {
      return
    }

    // Clear existing timeout
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current)
    }

    // Auto-save after 10 seconds of inactivity
    autoSaveRef.current = setTimeout(() => {
      // Double-check conditions at execution time
      if (
        !isSubmitting &&
        !isManualSaving &&
        !hasJustSaved &&
        currentDocument?.id
      ) {
        const currentFormData = getValues()
        const stillHasChanges =
          (currentFormData.title || "") !== (currentDocument.title || "") ||
          (currentFormData.slug || "") !== (currentDocument.slug || "") ||
          (currentFormData.content || "") !== (currentDocument.content || "") ||
          (currentFormData.description || "") !==
            (currentDocument.description || "") ||
          currentFormData.status !== currentDocument.status ||
          (currentFormData.category_id || null) !==
            (currentDocument.category_id || null)

        if (stillHasChanges) {
          handleAutoSave()
        }
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
    isSubmitting,
    isManualSaving,
    hasJustSaved,
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

  // Warn user about unsaved changes when leaving page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting && !isManualSaving) {
        e.preventDefault()
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?"
        return e.returnValue
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isDirty, isSubmitting, isManualSaving])

  const onSubmit = async (data: DocumentFormData, status: DocumentStatus) => {
    const { tags, ...documentData } = data
    const saveData = { ...documentData, status }

    // Cancel any pending auto-save
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current)
    }

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

        // Update currentDocument with the exact saved data to ensure comparison logic works
        const updatedDocumentData = {
          ...currentDocument,
          title: saveData.title,
          slug: saveData.slug,
          content: saveData.content,
          description: saveData.description,
          status: saveData.status,
          category_id: saveData.category_id,
        }
        setCurrentDocument(updatedDocumentData)

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

        // Update current document state with the exact data we just saved
        const savedDocumentData = {
          ...result.data,
          title: saveData.title,
          slug: saveData.slug,
          content: saveData.content,
          description: saveData.description,
          status: saveData.status,
          category_id: saveData.category_id,
        }
        setCurrentDocument(savedDocumentData)

        // Update document tags for newly created document
        if (tags && tags.length > 0) {
          const tagIds = tags.map((tag) => tag.id)
          await updateDocumentTagsMutation.mutateAsync({
            documentId: result.data.id,
            tagIds,
          })
        }

        setLastSaved(new Date())

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
  }

  const handleSaveDraft = () => {
    handleSubmit((data) =>
      onSubmit(data as DocumentFormData, DocumentStatus.DRAFT),
    )()
  }

  const handlePublish = () => {
    handleSubmit((data) =>
      onSubmit(data as DocumentFormData, DocumentStatus.PUBLISHED),
    )()
  }

  // Helper functions to work with existing components
  const handleInputChange = (
    field: keyof DocumentData,
    value: string | null,
  ) => {
    setValue(field as keyof DocumentFormData, value as string | null, {
      shouldValidate: true,
      shouldDirty: true,
    })

    // Clear hasJustSaved when user makes changes
    if (hasJustSaved) {
      setHasJustSaved(false)
    }
  }

  const handleTagsChange = (tags: Tag[]) => {
    setValue("tags", tags, { shouldValidate: true, shouldDirty: true })

    // Clear hasJustSaved when user makes changes
    if (hasJustSaved) {
      setHasJustSaved(false)
    }
  }

  const isSlugAutoGenerated = () => {
    if (!watchedTitle) return !watchedSlug
    return watchedSlug === generateSlug(watchedTitle)
  }

  const resetSlugToAutoGenerated = () => {
    if (watchedTitle) {
      setValue("slug", generateSlug(watchedTitle), { shouldValidate: true })
    }
  }

  // Get current form data in the format expected by existing components
  const currentFormData: DocumentData = {
    title: watchedTitle || "",
    slug: watchedSlug || "",
    content: watchedContent || "",
    description: getValues("description") || "",
    status: watchedStatus,
    category_id: getValues("category_id"),
    tags: getValues("tags"),
  }

  // Computed values
  const isPublished = watchedStatus === DocumentStatus.PUBLISHED

  // Derived loading states
  const isDraftSaving = isManualSaving && watchedStatus === DocumentStatus.DRAFT
  const isPublishing =
    isManualSaving && watchedStatus === DocumentStatus.PUBLISHED

  // More robust unsaved changes calculation
  const hasUnsavedChanges = useMemo(() => {
    // If we just saved, no unsaved changes
    if (hasJustSaved) {
      return false
    }

    // For new documents, check if there's any content (even if incomplete)
    if (!currentDocument) {
      const formData = getValues()
      return Boolean(
        formData.title?.trim() ||
        formData.content?.trim() ||
        formData.description?.trim(),
      )
    }

    // For existing documents, check if current form differs from saved document
    const formData = getValues()
    const hasChanges =
      (formData.title || "") !== (currentDocument.title || "") ||
      (formData.slug || "") !== (currentDocument.slug || "") ||
      (formData.content || "") !== (currentDocument.content || "") ||
      (formData.description || "") !== (currentDocument.description || "") ||
      formData.status !== currentDocument.status ||
      (formData.category_id || null) !== (currentDocument.category_id || null)

    return hasChanges
  }, [hasJustSaved, currentDocument, getValues])

  // Check if metadata fields (title, slug, description, category) have changed
  // This requires comparing current values with initial values
  const hasMetadataChanges = useMemo(() => {
    if (!isDirty || hasJustSaved) return false

    const currentTitle = watchedTitle || ""
    const currentSlug = watchedSlug || ""
    const currentDescription = getValues("description") || ""
    const currentCategoryId = getValues("category_id")

    const initialTitle = initialDocument?.title || ""
    const initialSlug = initialDocument?.slug || ""
    const initialDescription = initialDocument?.description || ""
    const initialCategoryId = initialDocument?.category_id || null

    return (
      currentTitle !== initialTitle ||
      currentSlug !== initialSlug ||
      currentDescription !== initialDescription ||
      currentCategoryId !== initialCategoryId
    )
  }, [
    isDirty,
    hasJustSaved,
    watchedTitle,
    watchedSlug,
    getValues,
    initialDocument,
  ])

  const loading =
    (createDocumentMutation.isPending || updateDocumentMutation.isPending) &&
    isManualSaving

  const saving = updateDocumentMutation.isPending

  // Simple button disable logic without auto-save complexity
  const shouldDisableButtons = useMemo(() => {
    // Always disable if we just saved
    if (hasJustSaved) {
      return true
    }

    // For new documents, disable if missing required fields (title AND content)
    if (!currentDocument) {
      const hasRequiredFields = Boolean(
        watchedTitle?.trim() && watchedContent?.trim(),
      )
      return !hasRequiredFields
    }

    // For existing documents, disable if no changes from saved document
    const hasActualChanges =
      (watchedTitle || "") !== (currentDocument.title || "") ||
      (watchedSlug || "") !== (currentDocument.slug || "") ||
      (watchedContent || "") !== (currentDocument.content || "") ||
      (watchedDescription || "") !== (currentDocument.description || "") ||
      watchedStatus !== currentDocument.status ||
      (watchedCategoryId || null) !== (currentDocument.category_id || null)

    return !hasActualChanges
  }, [hasJustSaved, currentDocument, watchedTitle, watchedContent, watchedSlug, watchedStatus, watchedCategoryId, watchedDescription])

  return (
    <div className={documentEditorStyles.container}>
      <DocumentEditorHeader
        saving={saving}
        lastSaved={lastSaved}
        hasUnsavedChanges={hasUnsavedChanges}
        hasMetadataChanges={hasMetadataChanges}
        previewMode={previewMode}
        loading={loading}
        isDraftSaving={isDraftSaving}
        isPublishing={isPublishing}
        publishedSlug={publishedSlug}
        isPublished={isPublished}
        shouldDisableButtons={shouldDisableButtons}
        hasJustSaved={hasJustSaved}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      <div className={documentEditorStyles.formGrid}>
        {/* Main Editor */}
        <div className={documentEditorStyles.mainEditor}>
          {!previewMode ? (
            <DocumentForm
              formData={currentFormData}
              errors={formErrors}
              onInputChange={handleInputChange}
              onTagsChange={handleTagsChange}
              isSlugAutoGenerated={isSlugAutoGenerated()}
              onResetSlug={resetSlugToAutoGenerated}
            />
          ) : (
            <DocumentPreview formData={currentFormData} />
          )}
        </div>

        {/* Sidebar */}
        <DocumentSidebar
          formData={currentFormData}
          categories={categories}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}
