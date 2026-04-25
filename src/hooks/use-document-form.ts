"use client"

import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { generateSlug } from "@/lib/helpers"
import { DocumentStatus, DocumentEditorData } from "@/types/document"
import { useDocumentTags } from "./use-tags"

// Form validation schema using Zod
const documentFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  description: z.string(),
  status: z.nativeEnum(DocumentStatus),
  category_id: z.string().nullable(),
  tags: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        created_at: z.string(),
      })
    )
    .optional(),
})

export type ZodFormData = z.infer<typeof documentFormSchema>

interface UseDocumentFormProps {
  initialDocument?: DocumentEditorData
  currentDocument?: DocumentEditorData
}

export function useDocumentForm({ initialDocument, currentDocument }: UseDocumentFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<ZodFormData>({
    resolver: zodResolver(documentFormSchema),
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

  const { control, setValue, getValues, formState: { isDirty, isSubmitting }, reset } = form

  // Watch only fields needed for form logic
  const watchedTitle = useWatch({
    control,
    name: "title",
  })

  // Fetch document tags if editing existing document
  const { data: documentTags = [] } = useDocumentTags(currentDocument?.id || "")

  // Sync document tags with form data
  useEffect(() => {
    if (documentTags.length > 0) {
      setValue("tags", documentTags)
    }
  }, [documentTags, setValue])

  // Auto-generate slug from title for new documents
  useEffect(() => {
    // Only for new documents (no currentDocument)
    if (!currentDocument && watchedTitle) {
      const expectedSlug = generateSlug(watchedTitle)

      // For new documents, always auto-generate unless user manually edited slug
      setValue("slug", expectedSlug, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [watchedTitle, currentDocument, setValue])

  return {
    form,
    control,
    setValue,
    getValues,
    isDirty,
    isSubmitting,
    reset,
    handleSubmit: form.handleSubmit,
  }
}