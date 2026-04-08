export const unifiedSearchModalStyles = {
  // Overlay
  overlay: 'fixed inset-0 z-50 overflow-y-auto',
  backdrop: 'fixed inset-0 opacity-50 bg-gray-500',
  
  // Container
  container: 'flex min-h-screen items-start justify-center px-4 pt-16',
  modal: 'relative w-full max-w-2xl bg-white rounded-lg shadow-xl',
  
  // Search input section
  inputSection: 'px-4 py-4 border-b border-gray-200',
  inputContainer: 'relative',
  searchIcon: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
  searchIconSvg: 'h-5 w-5 text-gray-400',
  input: 'block w-full pl-10 pr-3 py-3 border-0 bg-transparent text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none text-lg',
  
  // Results section
  resultsContainer: 'max-h-96 overflow-y-auto',
  
  // Loading state
  loadingContainer: 'px-4 py-8 text-center',
  loadingContent: 'inline-flex items-center',
  spinner: 'animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2',
  loadingText: 'text-sm text-gray-600',
  
  // Empty states
  emptyContainer: 'px-4 py-8 text-center',
  emptyText: 'text-sm text-gray-500',
  
  // Minimum query length message
  minQueryContainer: 'px-4 py-8 text-center',
  minQueryText: 'text-sm text-gray-500',
  
  // Result items
  resultLink: 'block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors',
  resultLinkSelected: 'bg-blue-50 border-blue-200',
  resultContent: 'flex items-start justify-between',
  resultMain: 'flex-1 min-w-0',
  resultHeader: 'flex items-center space-x-2',
  resultTitle: 'text-sm font-medium text-gray-900 truncate',
  
  // Status badges
  statusBadge: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
  statusPublished: 'bg-green-100 text-green-800',
  statusDraft: 'bg-yellow-100 text-yellow-800',
  
  // Category
  categoryText: 'text-xs text-blue-600 mt-1',
  
  // Snippet
  snippetContainer: 'text-sm text-gray-600 mt-1 line-clamp-2',
  
  // Description fallback
  descriptionText: 'text-sm text-gray-600 mt-1 line-clamp-2',
  
  // Result metadata
  resultMeta: 'ml-4 shrink-0',
  relevanceText: 'text-xs text-gray-400',
  dateText: 'text-xs text-gray-400',
  
  // Footer
  footer: 'px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg',
  footerContent: 'flex items-center justify-between text-xs text-gray-500',
  shortcuts: 'flex items-center space-x-4',
  shortcut: 'flex items-center',
  kbd: 'px-2 py-1 bg-white border border-gray-300 rounded mr-1',
  resultsCount: 'text-xs text-gray-500'
} as const