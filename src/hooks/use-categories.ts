'use client'

import { useQuery } from '@tanstack/react-query'
import { getRoute } from '@/config/routes'
import type { CategoryWithDocumentCount } from '@/types/category'

interface UseCategoriesOptions {
  includePrivate?: boolean
  withCounts?: boolean
  enabled?: boolean
}

interface UseCategoriesResult {
  categories: CategoryWithDocumentCount[]
  isLoading: boolean
  isError: boolean
  error: Error | null
}

// Fetch all categories
export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesResult {
  const { includePrivate = false, withCounts = true, enabled = true } = options
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['categories', { includePrivate, withCounts }],
    queryFn: async (): Promise<CategoryWithDocumentCount[]> => {
      const params = new URLSearchParams()
      
      if (includePrivate) {
        params.set('includePrivate', 'true')
      }
      
      if (withCounts) {
        params.set('withCounts', 'true')
      }
      
      const url = `${getRoute.api.categories()}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      
      const result = await response.json()
      return result.categories || []
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  
  return {
    categories: data || [],
    isLoading,
    isError,
    error: error as Error | null,
  }
}

// Fetch single category
export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async (): Promise<CategoryWithDocumentCount> => {
      const response = await fetch(getRoute.api.categories(id))
      
      if (!response.ok) {
        throw new Error('Failed to fetch category')
      }
      
      const result = await response.json()
      return result.category
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}