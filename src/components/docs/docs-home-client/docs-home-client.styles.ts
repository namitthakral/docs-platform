export const docsHomeClientStyles = {
  container: 'space-y-12',
  
  // Hero section
  hero: 'text-center space-y-4',
  heroTitle: 'text-4xl font-bold text-gray-900',
  heroDescription: 'text-xl text-gray-600 max-w-2xl mx-auto',
  
  // Section styles
  section: 'space-y-6',
  sectionTitle: 'text-2xl font-bold text-gray-900',
  
  // Categories grid
  categoriesGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  categoryCard: 'block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors',
  categoryTitle: 'text-lg font-semibold text-gray-900 mb-2',
  categoryDescription: 'text-gray-600 text-sm mb-3',
  categoryCount: 'text-sm text-blue-600',
  
  // Documents grid
  documentsGrid: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  documentCard: 'block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all',
  documentContent: 'flex items-start justify-between',
  documentInfo: 'flex-1 min-w-0',
  documentTitle: 'text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors',
  documentDescription: 'text-gray-600 text-sm mb-3 line-clamp-2',
  documentArrow: 'ml-4 shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors',
  
  // Document tags
  documentTags: 'flex flex-wrap gap-1 mb-3',
  documentTag: 'inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full',
  documentTagMore: 'inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full',
  
  // Document meta
  documentMeta: 'flex items-center justify-between text-sm text-gray-500',
  documentCategory: 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs',
  documentDate: 'text-gray-500',
  
  // Loading state
  loading: 'flex items-center justify-center gap-3 p-8 text-gray-500',
  spinner: 'w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin',
  
  // Empty state
  emptyState: 'text-center py-12',
  emptyIcon: 'mx-auto h-12 w-12 text-gray-400',
  emptyTitle: 'mt-2 text-sm font-medium text-gray-900',
  emptyDescription: 'mt-1 text-sm text-gray-500 max-w-sm mx-auto',
  emptyActions: 'mt-6',
  createButton: 'inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors',
  signInButton: 'inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors',
} as const