export const dropdownStyles = {
  // Container - relative positioning for dropdown
  container: 'relative',
  
  // Trigger button
  trigger: 'w-full flex items-center justify-between px-3 py-2 bg-muted border border-border rounded-md text-sm font-medium text-foreground transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
  triggerClosed: 'hover:bg-accent hover:border-border',
  triggerOpen: 'bg-card border-border shadow-sm',
  triggerDisabled: 'opacity-50 cursor-not-allowed hover:bg-muted hover:border-border',
  
  // Trigger content
  triggerContent: 'flex items-center gap-2 text-left text-foreground',
  triggerIcon: 'flex-shrink-0 text-muted-foreground pl-2',
  
  // Dropdown
  dropdown: 'absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50',
  dropdownContent: 'max-h-48 overflow-y-auto py-1',
  
  // Option styles (to be used by children)
  option: 'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-muted',
  optionDefault: 'text-foreground hover:bg-muted',
  optionSelected: 'text-primary bg-primary/10 hover:bg-primary/20',
  optionDisabled: 'text-muted-foreground cursor-not-allowed hover:bg-popover',
  
  // Checkmark for selected options
  checkmark: 'text-primary font-semibold',
  
  // Empty state
  emptyState: 'px-3 py-2 text-sm text-muted-foreground',
} as const