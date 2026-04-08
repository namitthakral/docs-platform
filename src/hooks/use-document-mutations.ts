"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DocumentStatus } from "@/types/document"
import { DocumentData } from "@/components/dashboard/document-editor/document-editor.props"
import { getRoute } from "@/config/routes"
import { invalidateQueries, removeQueries } from "@/lib/query-keys"

interface UpdateDocumentData extends DocumentData {
  id: string
}

export function useCreateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: DocumentData) => {
      const response = await fetch(getRoute.api.documents(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create document")
      }

      return response.json()
    },
    onSuccess: (result) => {
      // Invalidate and refetch documents list
      invalidateQueries.documents(queryClient)
      invalidateQueries.dashboardStats(queryClient)

      toast.success("Document created successfully")

      // Note: Navigation is handled by the component calling this mutation
      // to allow for different routing behavior (edit page vs published page)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create document")
    },
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateDocumentData) => {
      const { id, ...updateData } = data

      const response = await fetch(getRoute.api.documents(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update document")
      }

      return response.json()
    },
    onSuccess: (result, variables) => {
      // Update the specific document in cache
      queryClient.setQueryData(["document", variables.id], result.document)

      // Invalidate related queries
      invalidateQueries.documents(queryClient)
      invalidateQueries.dashboardStats(queryClient)

      toast.success("Document updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update document")
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(getRoute.api.documents(id), {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete document")
      }

      return response.json()
    },
    onSuccess: (_, documentId) => {
      // Remove from cache
      removeQueries.document(queryClient, documentId)

      // Invalidate lists
      invalidateQueries.documents(queryClient)
      invalidateQueries.dashboardStats(queryClient)

      toast.success("Document deleted successfully")

      // Navigate back to documents list
      router.push(getRoute.dashboard.documents())
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete document")
    },
  })
}

