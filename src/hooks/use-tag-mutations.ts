'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoute } from '@/config/routes'
import type { Tag } from '@/types/tag'

interface CreateTagData {
  name: string
}

interface UpdateTagData {
  id: string
  name: string
}

interface UpdateDocumentTagsData {
  documentId: string
  tagIds: string[]
}

// Create tag mutation
export function useCreateTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateTagData): Promise<Tag> => {
      const response = await fetch(getRoute.api.tags(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create tag')
      }
      
      const result = await response.json()
      return result.tag
    },
    onSuccess: () => {
      // Invalidate tags queries
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

// Update tag mutation
export function useUpdateTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateTagData): Promise<Tag> => {
      const response = await fetch(getRoute.api.tags(data.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.name }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update tag')
      }
      
      const result = await response.json()
      return result.tag
    },
    onSuccess: (_, variables) => {
      // Invalidate tags queries
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['tag', variables.id] })
    },
  })
}

// Delete tag mutation
export function useDeleteTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(getRoute.api.tags(id), {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete tag')
      }
    },
    onSuccess: () => {
      // Invalidate tags queries
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

// Update document tags mutation
export function useUpdateDocumentTags() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateDocumentTagsData): Promise<Tag[]> => {
      const response = await fetch(getRoute.api.documentTags(data.documentId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagIds: data.tagIds }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update document tags')
      }
      
      const result = await response.json()
      return result.tags
    },
    onSuccess: (_, variables) => {
      // Invalidate document and tags queries
      queryClient.invalidateQueries({ queryKey: ['document', variables.documentId] })
      queryClient.invalidateQueries({ queryKey: ['document-tags', variables.documentId] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}