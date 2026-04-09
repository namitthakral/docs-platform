export const unifiedSearchModalStyles = {
  // Overlay
  overlay: 'fixed inset-0 z-50 overflow-y-auto',
  backdrop: 'fixed inset-0 opacity-50 bg-black',
  
  // Container
  container: 'flex min-h-screen items-start justify-center px-4 pt-16',
  modal: 'relative w-full max-w-2xl bg-card rounded-lg shadow-xl',
  
  // Search input section
  inputSection: 'px-4 py-4 border-b border-border',
  inputContainer: 'relative',
  searchIcon: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
  searchIconSvg: 'h-5 w-5 text-muted-foreground',
  input: 'block w-full pl-10 pr-3 py-3 border-0 bg-transparent text-foreground placeholder-muted-foreground focus:ring-0 focus:outline-none text-lg',
  
  // Results section
  resultsContainer: 'max-h-96 overflow-y-auto',
  
  // Loading state
  loadingContainer: 'px-4 py-8 text-center',
  loadingContent: 'inline-flex items-center',
  spinner: 'animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2',
  loadingText: 'text-sm text-muted-foreground',
  
  // Empty states
  emptyContainer: 'px-4 py-8 text-center',
  emptyText: 'text-sm text-muted-foreground',
  
  // Minimum query length message
  minQueryContainer: 'px-4 py-8 text-center',
  minQueryText: 'text-sm text-muted-foreground',
  
  // Result items
  resultLink: 'block px-4 py-3 border-b border-border hover:bg-muted transition-colors',
  resultLinkSelected: 'bg-primary/10 border-primary/20',
  resultContent: 'flex items-start justify-between',
  resultMain: 'flex-1 min-w-0',
  resultHeader: 'flex items-center space-x-2',
  resultTitle: 'text-sm font-medium text-foreground truncate',
  
  // Status badges
  statusBadge: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
  statusPublished: 'bg-green-500/10 text-green-400',
  statusDraft: 'bg-yellow-500/10 text-yellow-400',
  
  // Category
  categoryText: 'text-xs text-primary mt-1',
  
  // Snippet
  snippetContainer: 'text-sm text-muted-foreground mt-1 line-clamp-2',
  
  // Description fallback
  descriptionText: 'text-sm text-muted-foreground mt-1 line-clamp-2',
  
  // Result metadata
  resultMeta: 'ml-4 shrink-0',
  relevanceText: 'text-xs text-muted-foreground/60',
  dateText: 'text-xs text-muted-foreground/60',
  
  // Footer
  footer: 'px-4 py-3 border-t border-border bg-muted rounded-b-lg',
  footerContent: 'flex items-center justify-between text-xs text-muted-foreground',
  shortcuts: 'flex items-center space-x-4',
  shortcut: 'flex items-center',
  kbd: 'px-2 py-1 bg-card border border-border rounded mr-1',
  resultsCount: 'text-xs text-muted-foreground'
} as const