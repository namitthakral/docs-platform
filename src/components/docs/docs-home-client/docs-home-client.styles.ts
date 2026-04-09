export const docsHomeClientStyles = {
  container: 'space-y-12',
  
  // Hero section
  hero: 'text-center space-y-4',
  heroTitle: 'text-4xl font-bold text-foreground',
  heroDescription: 'text-xl text-gray-300 max-w-2xl mx-auto',
  
  // Section styles
  section: 'space-y-6',
  sectionTitle: 'text-2xl font-bold text-foreground',
  
  // Categories grid
  categoriesGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  categoryCard: 'block p-6 bg-muted rounded-lg hover:bg-accent transition-colors',
  categoryTitle: 'text-lg font-semibold text-foreground mb-2',
  categoryDescription: 'text-muted-foreground text-sm mb-3',
  categoryCount: 'text-sm text-primary',
  
  // Documents grid
  documentsGrid: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  documentCard: 'block p-6 border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all',
  documentContent: 'flex items-start justify-between',
  documentInfo: 'flex-1 min-w-0',
  documentTitle: 'text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors',
  documentDescription: 'text-muted-foreground text-sm mb-3 line-clamp-2',
  documentArrow: 'ml-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors',
  
  // Document tags
  documentTags: 'flex flex-wrap gap-1 mb-3',
  documentTag: 'inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full',
  documentTagMore: 'inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full',
  
  // Document meta
  documentMeta: 'flex items-center justify-between text-sm text-muted-foreground',
  documentCategory: 'bg-primary/10 text-primary px-2 py-1 rounded text-xs',
  documentDate: 'text-muted-foreground',
  
  // Loading state
  loading: 'flex items-center justify-center gap-3 p-8 text-muted-foreground',
  spinner: 'w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin',
  
  // Empty state
  emptyState: 'text-center py-12',
  emptyIcon: 'mx-auto h-12 w-12 text-muted-foreground',
  emptyTitle: 'mt-2 text-sm font-medium text-foreground',
  emptyDescription: 'mt-1 text-sm text-muted-foreground max-w-sm mx-auto',
  emptyActions: 'mt-6',
  createButton: 'inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors',
  signInButton: 'inline-flex items-center px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-accent transition-colors',
} as const