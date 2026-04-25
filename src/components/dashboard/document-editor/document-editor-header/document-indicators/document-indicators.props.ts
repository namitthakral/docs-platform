import { Control } from "react-hook-form"
import { DocumentFormData } from "@/types/document-editor"

export interface DocumentIndicatorsProps {
  control: Control<DocumentFormData>
  publishedSlug?: string | null
  previewMode: boolean
  onTogglePreview: () => void
}