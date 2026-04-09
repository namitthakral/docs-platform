export interface DocumentEditorHeaderProps {
  saving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  hasMetadataChanges: boolean
  previewMode: boolean
  loading: boolean
  isDraftSaving: boolean
  isPublishing: boolean
  publishedSlug?: string | null
  isPublished: boolean
  shouldDisableButtons: boolean
  hasJustSaved: boolean
  onTogglePreview: () => void
  onSaveDraft: () => void
  onPublish: () => void
}