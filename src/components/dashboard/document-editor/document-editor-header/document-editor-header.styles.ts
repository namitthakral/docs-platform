export const documentEditorHeaderStyles = {
  // Header styles
  header: "border-b border-border px-6 py-4",
  headerContent: "flex items-center justify-between",
  saveStatus: "flex items-center space-x-6",
  saveStatusIndicator: "flex items-center space-x-3",
  savingIndicator:
    "w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin",
  saveText: "text-sm text-muted-foreground font-medium",
  savedIndicator: "flex items-center space-x-2",
  savedDot: "w-2 h-2 bg-green-500 rounded-full",
  unsavedIndicator: "flex items-center space-x-2",
  unsavedDot: "w-2 h-2 bg-muted-foreground rounded-full",
  unsavedText: "text-sm text-muted-foreground",
  previewButton:
    "flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-foreground bg-muted hover:bg-accent rounded-md transition-colors cursor-pointer",
  actionButtons: "flex items-center space-x-3",
  draftButton:
    "px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors",
  publishButton:
    "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm",
  publishButtonLoading: "flex items-center space-x-2",
  publishLoadingSpinner:
    "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin",
}