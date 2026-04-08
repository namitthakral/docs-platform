'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getRoute } from '@/config/routes'
import { invalidateQueries, removeQueries } from '@/lib/query-keys'

interface CategoryData {
  name: string
  slug: string
  description?: string
  parent_id?: string | null
  sort_order?: number
  is_public?: boolean
}

interface UpdateCategoryData extends CategoryData {
  id: string
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CategoryData) => {
      const response = await fetch(getRoute.api.categories(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create category')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      invalidateQueries.categories(queryClient)
      invalidateQueries.dashboardStats(queryClient)
      
      toast.success('Category created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category')
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateCategoryData) => {
      const { id, ...updateData } = data
      
      const response = await fetch(getRoute.api.categories(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update category')
      }

      return response.json()
    },
    onSuccess: (result, variables) => {
      // Update the specific category in cache
      queryClient.setQueryData(
        ['category', variables.id],
        result.category
      )
      
      // Invalidate related queries
      invalidateQueries.categories(queryClient)
      invalidateQueries.documents(queryClient)
      
      toast.success('Category updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category')
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(getRoute.api.categories(id), {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }

      return response.json()
    },
    onSuccess: (_, categoryId) => {
      // Remove from cache
      removeQueries.category(queryClient, categoryId)
      
      // Invalidate lists
      invalidateQueries.categories(queryClient)
      invalidateQueries.documents(queryClient)
      invalidateQueries.dashboardStats(queryClient)
      
      toast.success('Category deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category')
    },
  })
}