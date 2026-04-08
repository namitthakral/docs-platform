export const categoryPageClientStyles = {
  container: 'space-y-8',
  
  // Header
  header: 'border-b border-gray-200 pb-6',
  title: 'text-3xl md:text-4xl font-bold text-gray-900 mb-4',
  description: 'text-lg text-gray-600 max-w-3xl',
  meta: 'mt-4 flex items-center text-sm text-gray-500',
  
  // Documents section
  documentsSection: 'space-y-6',
  documentsTitle: 'text-xl font-semibold text-gray-900',
  documentsGrid: 'grid gap-4',
  
  // Document card
  documentCard: 'block p-6 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all group',
  documentContent: 'flex items-start justify-between',
  documentInfo: 'flex-1 min-w-0',
  documentTitle: 'text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2',
  documentDescription: 'text-gray-600 text-sm mb-3 line-clamp-2',
  documentArrow: 'ml-4 shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors',
  
  // Document tags
  documentTags: 'flex flex-wrap gap-1 mb-3',
  documentTag: 'inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full',
  documentTagMore: 'inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full',
  
  // Document meta
  documentMeta: 'flex items-center space-x-4 text-xs text-gray-500',
  documentDate: 'flex items-center',
  
  // Loading state
  loading: 'flex items-center justify-center gap-3 p-8 text-gray-500',
  spinner: 'w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin',
  
  // Empty state
  emptyState: 'text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300',
  emptyIcon: 'mx-auto h-12 w-12 text-gray-400',
  emptyTitle: 'mt-4 text-lg font-medium text-gray-900',
  emptyDescription: 'mt-2 text-sm text-gray-500 max-w-sm mx-auto',
  emptyActions: 'mt-6',
  createButton: 'inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors',
  signInButton: 'inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors',
  backButton: 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors',
} as const