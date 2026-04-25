import { Control } from "react-hook-form"
import { DocumentFormData } from "@/types/document-editor"

export interface ActionButtonsProps {
  control: Control<DocumentFormData>
  isNewDocument: boolean
  hasJustSaved: boolean
  hasUnsavedChanges: boolean
  isManualSaving: boolean
  onSaveDraft: () => void
  onPublish: () => void
}