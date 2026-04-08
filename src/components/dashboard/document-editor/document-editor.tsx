"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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

export default function DocumentEditor({ document }: DocumentEditorProps) {
  const [formData, setFormData] = useState<DocumentData>({
    title: document?.title || "",
    slug: document?.slug || "",
    content: document?.content || "",
    description: document?.description || "",
    status: document?.status || DocumentStatus.DRAFT,
    category_id: document?.category_id || null,
    tags: [],
  })

  const [lastSaved, setLastSaved] = useState<Date | null>(
    document?.updated_at ? new Date(document.updated_at) : null,
  )
  const [previewMode, setPreviewMode] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [lastSavedData, setLastSavedData] = useState<DocumentData>(formData)
  const [isManualSaving, setIsManualSaving] = useState(false)
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isUserTyping, setIsUserTyping] = useState(false)

  const router = useRouter()
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleInputChange = (
    field: keyof DocumentData,
    value: string | null,
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Auto-generate slug from title for new documents
      if (field === "title" && !document) {
        const expectedSlug = prev.title ? generateSlug(prev.title) : ""

        // If slug is empty or matches what would be generated from previous title
        if (!prev.slug || prev.slug === expectedSlug) {
          // If title has value, generate slug; if title is empty, clear slug
          newData.slug = value ? generateSlug(value) : ""
        }
      }

      // Save to localStorage immediately for backup
      const backupKey = document?.id
        ? `draft-backup-${document.id}`
        : "draft-backup-new"
      const backupData = { ...newData, lastModified: Date.now() }
      localStorage.setItem(backupKey, JSON.stringify(backupData))

      return newData
    })

    // Track user typing activity for content field
    if (field === "content") {
      setIsUserTyping(true)

      // Clear existing typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set user as not typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsUserTyping(false)
      }, 2000)
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleTagsChange = (tags: Tag[]) => {
    setFormData(prev => ({ ...prev, tags }))
  }

  // Mutation hooks
  const createDocumentMutation = useCreateDocument()
  const updateDocumentMutation = useUpdateDocument()
  const updateDocumentTagsMutation = useUpdateDocumentTags()
  
  // Fetch document tags if editing existing document
  const { data: documentTags = [] } = useDocumentTags(document?.id || '')

  // Sync document tags with form data
  useEffect(() => {
    if (documentTags.length > 0) {
      setFormData(prev => ({ ...prev, tags: documentTags }))
    }
  }, [documentTags])

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

  // Loading and saving states from mutations
  // Only consider it "loading" for manual saves, not auto-saves
  const loading =
    (createDocumentMutation.isPending || updateDocumentMutation.isPending) &&
    isManualSaving
  const saving = updateDocumentMutation.isPending

  // Helper functions for slug management
  const isSlugAutoGenerated = () => {
    // If no title, consider it auto-generated only if slug is also empty
    if (!formData.title) return !formData.slug
    return formData.slug === generateSlug(formData.title)
  }

  const resetSlugToAutoGenerated = () => {
    if (formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }))
    }
  }

  // Categories are now loaded via React Query above

  // Check if there are unsaved changes (content + metadata)
  const hasUnsavedChanges = Boolean(
    document?.id &&
    (formData.title !== lastSavedData.title ||
      formData.content !== lastSavedData.content ||
      formData.description !== lastSavedData.description ||
      formData.category_id !== lastSavedData.category_id ||
      formData.slug !== lastSavedData.slug ||
      formData.status !== lastSavedData.status),
  )

  // Check if there are content changes (excluding status) for auto-save
  // Only auto-save content field to reduce API calls
  const hasContentChanges = Boolean(
    document?.id && formData.content !== lastSavedData.content,
  )

  // Check if there are significant metadata changes that should trigger manual save
  const hasMetadataChanges = Boolean(
    document?.id &&
    (formData.title !== lastSavedData.title ||
      formData.description !== lastSavedData.description ||
      formData.category_id !== lastSavedData.category_id ||
      formData.slug !== lastSavedData.slug),
  )

  // Initialize lastSavedData when document is loaded
  useEffect(() => {
    if (document) {
      setLastSavedData({
        title: document.title,
        slug: document.slug,
        content: document.content,
        description: document.description,
        status: document.status,
        category_id: document.category_id,
      })
    }
  }, [document])

  // Optimized auto-save effect with improvements:
  // - Only auto-saves content field (not metadata) to reduce API calls
  // - Increased debounce to 10 seconds (was 3 seconds)
  // - Pauses auto-save while user is actively typing
  // - Uses localStorage for immediate backup
  // - Metadata changes require manual save
  useEffect(() => {
    // Only auto-save content changes, not metadata
    // Don't auto-save if user is actively typing or during manual saves
    if (
      !document?.id ||
      !hasContentChanges ||
      saving ||
      isManualSaving ||
      isUserTyping
    ) {
      return
    }

    // Clear existing timeout
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current)
    }

    // Set new timeout for auto-save - increased to 10 seconds to reduce API calls
    autoSaveRef.current = setTimeout(() => {
      // Double-check conditions at execution time
      if (
        !saving &&
        !isManualSaving &&
        !isUserTyping &&
        document?.id &&
        hasContentChanges
      ) {
        // For auto-save, only save content field to minimize API calls
        const autoSaveData = {
          title: lastSavedData.title, // Keep existing title
          slug: lastSavedData.slug, // Keep existing slug
          content: formData.content, // Only update content
          description: lastSavedData.description, // Keep existing description
          status: lastSavedData.status, // Keep existing status
          category_id: lastSavedData.category_id, // Keep existing category
        }

        updateDocumentMutation.mutate(
          {
            id: document.id,
            ...autoSaveData,
          },
          {
            onSuccess: () => {
              setLastSaved(new Date())
              // Only update the content in lastSavedData
              setLastSavedData((prev) => ({
                ...prev,
                content: formData.content,
              }))

              // Clear localStorage backup after successful save
              localStorage.removeItem(`draft-backup-${document.id}`)
            },
            onError: (error) => {
              console.error("Auto-save error:", error)
              // Keep localStorage backup on error
            },
          },
        )
      }
    }, 10000) // Auto-save after 10 seconds of inactivity (reduced API calls)

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [
    hasContentChanges,
    formData.content, // Only watch content changes for auto-save
    document?.id,
    saving,
    isManualSaving,
    isUserTyping,
    lastSavedData.title,
    lastSavedData.slug,
    lastSavedData.description,
    lastSavedData.status,
    lastSavedData.category_id,
    updateDocumentMutation,
  ])

  // Load localStorage backup on mount
  useEffect(() => {
    if (document?.id) {
      const backupKey = `draft-backup-${document.id}`
      const backup = localStorage.getItem(backupKey)

      if (backup) {
        try {
          const backupData = JSON.parse(backup)
          const backupAge = Date.now() - (backupData.lastModified || 0)

          // If backup is newer than last saved and less than 1 hour old
          if (
            backupAge < 3600000 &&
            backupData.lastModified >
              (document.updated_at
                ? new Date(document.updated_at).getTime()
                : 0)
          ) {
            // Show user option to restore backup (could be implemented as a toast/modal)
            console.log("Local backup found that is newer than saved version")
            // For now, just log - could implement restore UI later
          }
        } catch (error) {
          console.error("Error parsing backup data:", error)
          localStorage.removeItem(backupKey)
        }
      }
    }
  }, [document?.id, document?.updated_at])

  // Warn user about unsaved changes when leaving page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !saving && !isManualSaving) {
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
  }, [hasUnsavedChanges, saving, isManualSaving])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required"
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (status: DocumentStatus) => {
    if (!validateForm()) return

    // Cancel any pending auto-save to prevent double calls
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current)
    }

    // Set manual saving flag
    setIsManualSaving(true)
    
    // Set specific loading states based on action
    if (status === DocumentStatus.DRAFT) {
      setIsDraftSaving(true)
    } else if (status === DocumentStatus.PUBLISHED) {
      setIsPublishing(true)
    }

    // Exclude tags from document data (tags are handled separately)
    const { tags, ...documentData } = formData
    const saveData = {
      ...documentData,
      status,
    }

    if (document?.id) {
      // Update existing document
      updateDocumentMutation.mutate(
        {
          id: document.id,
          ...saveData,
        },
        {
          onSuccess: (_updatedDocument) => {
            setLastSaved(new Date())
            setLastSavedData(saveData)
            // Update the form data to reflect the new status
            setFormData((prev) => ({ ...prev, status }))

            // Update document tags if they have changed
            if (tags && document?.id) {
              const tagIds = tags.map(tag => tag.id)
              updateDocumentTagsMutation.mutate({
                documentId: document.id,
                tagIds
              })
            }

            setIsManualSaving(false)
            setIsDraftSaving(false)
            setIsPublishing(false)

            // Clear localStorage backup after successful manual save
            if (document?.id) {
              localStorage.removeItem(`draft-backup-${document.id}`)
            }

            // Redirect to the published document if publishing
            if (status === DocumentStatus.PUBLISHED) {
              const publicUrl = getRoute.docsPage(saveData.slug)
              setIsRedirecting(true)
              // Small delay to show the success state before redirecting
              setTimeout(() => {
                router.push(publicUrl)
              }, 1000)
            }
          },
          onError: (error) => {
            console.error("Save error:", error)
            setIsManualSaving(false)
            setIsDraftSaving(false)
            setIsPublishing(false)
          },
        },
      )
    } else {
      // Create new document
      createDocumentMutation.mutate(saveData, {
        onSuccess: (result) => {
          setLastSaved(new Date())
          setLastSavedData(saveData)
          // Update the form data to reflect the new status and ID
          setFormData((prev) => ({ ...prev, status, id: result.data.id }))

          // Update document tags for the newly created document
          if (tags && tags.length > 0) {
            const tagIds = tags.map(tag => tag.id)
            updateDocumentTagsMutation.mutate({
              documentId: result.data.id,
              tagIds
            })
          }

          setIsManualSaving(false)
          setIsDraftSaving(false)
          setIsPublishing(false)

          // Clear localStorage backup after successful creation
          localStorage.removeItem(`draft-backup-new`)

          // Redirect to the published document if publishing
          if (status === DocumentStatus.PUBLISHED) {
            const publicUrl = getRoute.docsPage(saveData.slug)
            setIsRedirecting(true)
            // Small delay to show the success state before redirecting
            setTimeout(() => {
              router.push(publicUrl)
            }, 1000)
          } else {
            // For draft documents, redirect to edit page
            router.push(getRoute.dashboard.document(result.data.id))
          }
        },
        onError: (error) => {
          console.error("Create error:", error)
          setIsManualSaving(false)
          setIsDraftSaving(false)
          setIsPublishing(false)
        },
      })
    }
  }

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
        isRedirecting={isRedirecting}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        onSaveDraft={() => handleSave(DocumentStatus.DRAFT)}
        onPublish={() => handleSave(DocumentStatus.PUBLISHED)}
      />

      <div className={documentEditorStyles.formGrid}>
        {/* Main Editor */}
        <div className={documentEditorStyles.mainEditor}>
          {!previewMode ? (
            <DocumentForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onTagsChange={handleTagsChange}
              isSlugAutoGenerated={isSlugAutoGenerated()}
              onResetSlug={resetSlugToAutoGenerated}
            />
          ) : (
            <DocumentPreview formData={formData} />
          )}
        </div>

        {/* Sidebar */}
        <DocumentSidebar
          formData={formData}
          categories={categories}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}
