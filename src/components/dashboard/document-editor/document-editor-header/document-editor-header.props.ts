export interface DocumentEditorHeaderProps {
  saving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  hasMetadataChanges: boolean
  previewMode: boolean
  loading: boolean
  isDraftSaving: boolean
  isPublishing: boolean
  isRedirecting?: boolean
  publishedSlug?: string | null
  onTogglePreview: () => void
  onSaveDraft: () => void
  onPublish: () => void
}