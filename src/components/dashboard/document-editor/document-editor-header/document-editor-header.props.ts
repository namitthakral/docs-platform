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
  onTogglePreview: () => void
  onSaveDraft: () => void
  onPublish: () => void
}