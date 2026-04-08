'use client'

import { useQuery } from '@tanstack/react-query'
import { getRoute } from '@/config/routes'
import type { Tag, TagWithUsage } from '@/types/tag'

interface UseTagsOptions {
  search?: string
  withCounts?: boolean
  enabled?: boolean
}

interface UseTagsResult {
  tags: TagWithUsage[]
  isLoading: boolean
  isError: boolean
  error: Error | null
}

// Fetch all tags
export function useTags(options: UseTagsOptions = {}): UseTagsResult {
  const { search, withCounts = false, enabled = true } = options
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tags', { search, withCounts }],
    queryFn: async (): Promise<TagWithUsage[]> => {
      const params = new URLSearchParams()
      
      if (search && search.trim()) {
        params.set('q', search.trim())
      }
      
      if (withCounts) {
        params.set('counts', 'true')
      }
      
      const url = `${getRoute.api.tags()}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch tags')
      }
      
      const result = await response.json()
      return result.tags || []
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  
  return {
    tags: data || [],
    isLoading,
    isError,
    error: error as Error | null,
  }
}

// Fetch single tag
export function useTag(id: string) {
  return useQuery({
    queryKey: ['tag', id],
    queryFn: async (): Promise<TagWithUsage> => {
      const response = await fetch(getRoute.api.tags(id))
      
      if (!response.ok) {
        throw new Error('Failed to fetch tag')
      }
      
      const result = await response.json()
      return result.tag
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Fetch tags for a specific document
export function useDocumentTags(documentId: string) {
  return useQuery({
    queryKey: ['document-tags', documentId],
    queryFn: async (): Promise<Tag[]> => {
      const response = await fetch(getRoute.api.documentTags(documentId))
      
      if (!response.ok) {
        throw new Error('Failed to fetch document tags')
      }
      
      const result = await response.json()
      return result.tags || []
    },
    enabled: !!documentId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}