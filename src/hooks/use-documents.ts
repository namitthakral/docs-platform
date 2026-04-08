'use client'

import { useQuery } from '@tanstack/react-query'
import { getRoute } from '@/config/routes'
import type { DocumentTableRow, DocumentStatus } from '@/types/document'

interface UseDocumentsOptions {
  status?: DocumentStatus
  categoryId?: string
  enabled?: boolean
}

interface UseDocumentsResult {
  documents: DocumentTableRow[]
  isLoading: boolean
  isError: boolean
  error: Error | null
}

// Fetch all documents
export function useDocuments(options: UseDocumentsOptions = {}): UseDocumentsResult {
  const { status, categoryId, enabled = true } = options
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['documents', { status, categoryId }],
    queryFn: async (): Promise<DocumentTableRow[]> => {
      const params = new URLSearchParams()
      
      if (status) {
        params.set('status', status)
      }
      
      if (categoryId) {
        params.set('categoryId', categoryId)
      }
      
      const url = `${getRoute.api.documents()}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }
      
      const result = await response.json()
      // Handle the standardized API response format
      if (result.success) {
        return result.data || []
      } else {
        throw new Error(result.error || 'Failed to fetch documents')
      }
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  
  return {
    documents: data || [],
    isLoading,
    isError,
    error: error as Error | null,
  }
}

// Fetch single document
export function useDocument(id: string) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: async (): Promise<DocumentTableRow> => {
      const response = await fetch(getRoute.api.documents(id))
      
      if (!response.ok) {
        throw new Error('Failed to fetch document')
      }
      
      const result = await response.json()
      // Handle the standardized API response format
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Failed to fetch document')
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}