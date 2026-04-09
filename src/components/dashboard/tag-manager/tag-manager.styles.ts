export const tagManagerStyles = {
  // Main container
  container: 'space-y-6',
  
  // Page header
  pageHeader: 'space-y-1 mb-6',
  pageTitle: 'text-2xl font-bold text-foreground',
  pageDescription: 'text-muted-foreground',
  
  // Desktop header
  desktopHeader: 'hidden md:flex items-center justify-between',
  headerContent: '',
  
  // Mobile header
  mobileHeader: 'md:hidden space-y-4',
  mobileCreateButton: 'w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors cursor-pointer',
  
  // Header section
  header: 'flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between',
  headerTitle: 'text-xl font-semibold text-foreground',
  headerDescription: 'text-sm text-muted-foreground mt-1',
  
  // Search section
  searchContainer: 'relative max-w-md',
  searchIcon: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none',
  searchInput: 'w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition-colors text-foreground bg-input',
  
  // Action buttons
  createButton: 'inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer',
  createIcon: 'w-4 h-4',
  
  // Error handling
  error: 'p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive flex items-center gap-2',
  errorIcon: 'w-5 h-5 text-destructive flex-shrink-0',
  
  // Create form
  createForm: 'p-4 bg-muted border border-border rounded-md space-y-3',
  createFormTitle: 'text-lg font-medium text-primary',
  createInput: 'w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-foreground',
  createActions: 'flex gap-2',
  
  // Main content
  content: '',
  
  // Loading state
  loading: 'flex items-center justify-center gap-3 p-8 text-muted-foreground',
  spinner: 'w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin',
  loadingText: 'text-sm',
  
  // Empty state
  empty: 'flex flex-col items-center justify-center p-12 text-center',
  emptyIcon: 'w-12 h-12 text-muted-foreground mb-4',
  emptyTitle: 'text-lg font-medium text-foreground mb-2',
  emptyDescription: 'text-muted-foreground max-w-sm',
  
  // Tags list
  tagsList: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4',
  tagItem: 'bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors',
  tagContent: 'flex items-center justify-between',
  
  // Tag information
  tagInfo: 'flex-1 min-w-0 space-y-1',
  tagName: 'text-sm font-medium text-foreground truncate',
  tagSlug: 'text-xs text-muted-foreground mt-1',
  tagUsage: 'text-xs text-muted-foreground',
  tagUsageIcon: 'w-3 h-3 mr-1',
  
  // Tag actions
  tagActions: 'flex items-center gap-2 ml-4',
  
  // Edit form
  editForm: 'space-y-4 p-4 bg-muted rounded-md border border-border',
  editFormTitle: 'text-sm font-medium text-foreground',
  editInput: 'w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent text-foreground bg-input',
  editActions: 'flex gap-2',
  
  // Action buttons
  saveButton: 'inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer',
  cancelButton: 'inline-flex items-center px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring transition-colors cursor-pointer',
  editButton: 'inline-flex items-center justify-center w-8 h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors cursor-pointer',
  deleteButton: 'inline-flex items-center justify-center w-8 h-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  actionIcon: 'w-4 h-4',
  
  // Stats section
  stats: 'grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6',
  statCard: 'bg-card p-4 rounded-lg border border-border shadow-sm',
  statValue: 'text-2xl font-bold text-foreground',
  statLabel: 'text-sm text-muted-foreground mt-1',
  statIcon: 'w-5 h-5 text-muted-foreground'
} as const