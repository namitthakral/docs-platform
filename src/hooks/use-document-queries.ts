'use client'

import { useQuery } from '@tanstack/react-query'
import { getRoute } from '@/config/routes'
import { queryKeys } from '@/lib/query-keys'

// Hook for fetching a single document by ID
export function useDocument(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.documents.detail(id),
    queryFn: async () => {
      const response = await fetch(getRoute.api.documents(id))
      if (!response.ok) {
        throw new Error('Failed to fetch document')
      }
      const { document } = await response.json()
      return document
    },
    enabled: enabled && !!id,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching all documents (if needed in the future)
export function useDocuments() {
  return useQuery({
    queryKey: queryKeys.documents.lists(),
    queryFn: async () => {
      const response = await fetch(getRoute.api.documents())
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }
      const { documents } = await response.json()
      return documents
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}