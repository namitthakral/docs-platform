export const tagSelectorStyles = {
  // Main container
  container: 'space-y-4 w-full',
  
  // Input section
  inputSection: 'space-y-2',
  inputLabel: 'block text-sm font-medium text-foreground',
  inputDescription: 'text-sm text-muted-foreground',
  
  // Error handling
  error: 'text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-2 flex items-center gap-2',
  errorIcon: 'w-4 h-4 text-destructive flex-shrink-0',
  
  // Selected tags section
  selectedSection: 'space-y-3 p-3 bg-muted rounded-md border border-border',
  selectedLabel: 'block text-sm font-medium text-foreground flex items-center justify-between',
  selectedCount: 'text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full',
  selectedEmpty: 'text-sm text-muted-foreground italic',
  
  // Actions
  actions: 'flex items-center gap-2 pt-2',
  clearButton: 'text-xs text-destructive hover:text-destructive/80 transition-colors cursor-pointer',
  
  // States
  states: {
    loading: 'opacity-50 pointer-events-none',
    disabled: 'opacity-50 cursor-not-allowed',
    readonly: 'bg-muted border-border'
  }
} as const