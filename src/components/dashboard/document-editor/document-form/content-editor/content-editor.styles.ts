export const contentEditorStyles = {
  // Form section
  formSection: "bg-muted rounded-lg p-6",
  
  // Input styles
  inputLabel: "block text-sm font-semibold text-foreground mb-3",
  contentTextarea:
    "w-full px-4 py-3 text-foreground border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y min-h-[500px] bg-input",
  contentTextareaError:
    "w-full px-4 py-3 text-foreground border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y min-h-[500px] bg-destructive/5",
  
  // Character counter
  characterCounter:
    "absolute bottom-3 right-3 text-xs text-muted-foreground bg-card px-2 py-1 rounded border border-border",
  
  // Error styles
  errorText: "mt-2 text-sm text-destructive flex items-center",
  errorIcon: "w-4 h-4 mr-1",
}