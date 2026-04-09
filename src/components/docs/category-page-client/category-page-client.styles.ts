export const categoryPageClientStyles = {
  container: 'space-y-8',
  
  // Header
  header: 'border-b border-border pb-6',
  title: 'text-3xl md:text-4xl font-bold text-foreground mb-4',
  description: 'text-lg text-gray-300 max-w-3xl',
  meta: 'mt-4 flex items-center text-sm text-gray-400',
  
  // Documents section
  documentsSection: 'space-y-6',
  documentsTitle: 'text-xl font-semibold text-foreground',
  documentsGrid: 'grid gap-4',
  
  // Document card
  documentCard: 'block p-6 bg-muted hover:bg-accent rounded-lg border border-border hover:border-border/80 transition-all group',
  documentContent: 'flex items-start justify-between',
  documentInfo: 'flex-1 min-w-0',
  documentTitle: 'text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2',
  documentDescription: 'text-muted-foreground text-sm mb-3 line-clamp-2',
  documentArrow: 'ml-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors',
  
  // Document tags
  documentTags: 'flex flex-wrap gap-1 mb-3',
  documentTag: 'inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full',
  documentTagMore: 'inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full',
  
  // Document meta
  documentMeta: 'flex items-center space-x-4 text-xs text-muted-foreground',
  documentDate: 'flex items-center',
  
  // Loading state
  loading: 'flex items-center justify-center gap-3 p-8 text-muted-foreground',
  spinner: 'w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin',
  
  // Empty state
  emptyState: 'text-center py-12 bg-muted rounded-lg border-2 border-dashed border-border',
  emptyIcon: 'mx-auto h-12 w-12 text-muted-foreground',
  emptyTitle: 'mt-4 text-lg font-medium text-foreground',
  emptyDescription: 'mt-2 text-sm text-muted-foreground max-w-sm mx-auto',
  emptyActions: 'mt-6',
  createButton: 'inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors',
  signInButton: 'inline-flex items-center px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-accent transition-colors',
  backButton: 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors',
} as const