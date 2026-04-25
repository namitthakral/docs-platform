import { Control } from "react-hook-form"
import { DocumentFormData } from "@/types/document-editor"

export interface SaveState {
  saving: boolean
  lastSaved: Date | null
  hasJustSaved: boolean
  publishedSlug?: string | null
}

export interface LoadingState {
  loading: boolean
  isManualSaving: boolean
}

export interface EditorState {
  previewMode: boolean
  hasUnsavedChanges: boolean
}

export interface DocumentEditorHeaderProps {
  control: Control<DocumentFormData>
  isNewDocument: boolean
  saveState: SaveState
  loadingState: LoadingState
  editorState: EditorState
  onTogglePreview: () => void
  onSaveDraft: () => void
  onPublish: () => void
}