export const tagInputStyles = {
  // Container
  container: 'relative w-full',
  
  // Input container
  inputContainer: 'relative',
  searchIcon: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none',
  input: 'w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground transition-colors text-foreground bg-input',
  
  // Dropdown
  dropdown: 'absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto',
  dropdownItem: 'w-full px-3 py-2 text-left hover:bg-muted focus:bg-muted focus:outline-none transition-colors cursor-pointer',
  tagName: 'text-sm text-foreground font-medium',
  tagDescription: 'text-xs text-muted-foreground mt-0.5',
  
  // Create item
  createItem: 'w-full px-3 py-2 text-left hover:bg-primary/10 focus:bg-primary/10 focus:outline-none transition-colors flex items-center gap-2 text-primary border-t border-border cursor-pointer',
  createIcon: 'w-4 h-4 flex-shrink-0',
  createText: 'text-sm font-medium',
  
  // Loading state
  loadingItem: 'px-3 py-2 flex items-center gap-2 text-muted-foreground',
  spinner: 'w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin',
  loadingText: 'text-sm',
  
  // Empty state
  emptyItem: 'px-3 py-2 text-sm text-muted-foreground text-center py-4',
  
  // States
  states: {
    focused: 'ring-2 ring-ring border-transparent',
    error: 'border-destructive ring-2 ring-destructive',
    disabled: 'bg-muted cursor-not-allowed text-muted-foreground'
  }
} as const