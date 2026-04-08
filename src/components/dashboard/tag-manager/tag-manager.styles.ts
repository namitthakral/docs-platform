export const tagManagerStyles = {
  // Main container
  container: 'space-y-6',
  
  // Page header
  pageHeader: 'space-y-1 mb-6',
  pageTitle: 'text-2xl font-bold text-gray-900',
  pageDescription: 'text-gray-600',
  
  // Desktop header
  desktopHeader: 'hidden md:flex items-center justify-between',
  headerContent: '',
  
  // Mobile header
  mobileHeader: 'md:hidden space-y-4',
  mobileCreateButton: 'w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors cursor-pointer',
  
  // Header section
  header: 'flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between',
  headerTitle: 'text-xl font-semibold text-gray-900',
  headerDescription: 'text-sm text-gray-600 mt-1',
  
  // Search section
  searchContainer: 'relative max-w-md',
  searchIcon: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none',
  searchInput: 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 bg-white',
  
  // Action buttons
  createButton: 'inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer',
  createIcon: 'w-4 h-4',
  
  // Error handling
  error: 'p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2',
  errorIcon: 'w-5 h-5 text-red-500 flex-shrink-0',
  
  // Create form
  createForm: 'p-4 bg-gray-50 border border-gray-200 rounded-md space-y-3',
  createFormTitle: 'text-lg font-medium text-blue-900',
  createInput: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900',
  createActions: 'flex gap-2',
  
  // Main content
  content: '',
  
  // Loading state
  loading: 'flex items-center justify-center gap-3 p-8 text-gray-500',
  spinner: 'w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin',
  loadingText: 'text-sm',
  
  // Empty state
  empty: 'flex flex-col items-center justify-center p-12 text-center',
  emptyIcon: 'w-12 h-12 text-gray-400 mb-4',
  emptyTitle: 'text-lg font-medium text-gray-900 mb-2',
  emptyDescription: 'text-gray-500 max-w-sm',
  
  // Tags list
  tagsList: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4',
  tagItem: 'bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors',
  tagContent: 'flex items-center justify-between',
  
  // Tag information
  tagInfo: 'flex-1 min-w-0 space-y-1',
  tagName: 'text-sm font-medium text-gray-900 truncate',
  tagSlug: 'text-xs text-gray-500 mt-1',
  tagUsage: 'text-xs text-gray-500',
  tagUsageIcon: 'w-3 h-3 mr-1',
  
  // Tag actions
  tagActions: 'flex items-center gap-2 ml-4',
  
  // Edit form
  editForm: 'space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200',
  editFormTitle: 'text-sm font-medium text-gray-900',
  editInput: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white',
  editActions: 'flex gap-2',
  
  // Action buttons
  saveButton: 'inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer',
  cancelButton: 'inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cursor-pointer',
  editButton: 'inline-flex items-center justify-center w-8 h-8 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer',
  deleteButton: 'inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  actionIcon: 'w-4 h-4',
  
  // Stats section
  stats: 'grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6',
  statCard: 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm',
  statValue: 'text-2xl font-bold text-gray-900',
  statLabel: 'text-sm text-gray-600 mt-1',
  statIcon: 'w-5 h-5 text-gray-400'
} as const