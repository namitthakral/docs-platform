/**
 * Centralized query keys for TanStack Query
 * This ensures consistency across the application and makes cache invalidation easier
 */

export const queryKeys = {
  // Documents
  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.documents.lists(), filters] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.documents.details(), id] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  // Navigation
  navigation: {
    all: ['navigation'] as const,
    documents: () => [...queryKeys.navigation.all, 'documents'] as const,
  },

  // Search
  search: {
    all: ['search'] as const,
    public: (query: string) => [...queryKeys.search.all, 'public', query] as const,
    dashboard: (query: string) => [...queryKeys.search.all, 'dashboard', query] as const,
  },

  // Dashboard stats
  dashboardStats: {
    all: ['dashboard-stats'] as const,
  },
} as const

/**
 * Helper functions for common cache invalidation patterns
 */
export const invalidateQueries = {
  // Invalidate all document-related queries
  documents: (queryClient: { invalidateQueries: (options: { queryKey: readonly string[] }) => void }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.documents.all })
  },

  // Invalidate all category-related queries
  categories: (queryClient: { invalidateQueries: (options: { queryKey: readonly string[] }) => void }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
  },

  // Invalidate navigation queries
  navigation: (queryClient: { invalidateQueries: (options: { queryKey: readonly string[] }) => void }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.navigation.all })
  },

  // Invalidate all search queries
  search: (queryClient: { invalidateQueries: (options: { queryKey: readonly string[] }) => void }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.search.all })
  },

  // Invalidate dashboard stats queries
  dashboardStats: (queryClient: { invalidateQueries: (options: { queryKey: readonly string[] }) => void }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats.all })
  },
}

/**
 * Helper functions for removing specific items from cache
 */
export const removeQueries = {
  // Remove a specific document from cache
  document: (queryClient: { removeQueries: (options: { queryKey: readonly string[] }) => void }, id: string) => {
    queryClient.removeQueries({ queryKey: queryKeys.documents.detail(id) })
  },

  // Remove a specific category from cache
  category: (queryClient: { removeQueries: (options: { queryKey: readonly string[] }) => void }, id: string) => {
    queryClient.removeQueries({ queryKey: queryKeys.categories.detail(id) })
  },
}