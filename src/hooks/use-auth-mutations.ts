"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getRoute } from "@/config/routes"
import { invalidateQueries } from "@/lib/query-keys"

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
}

interface AuthResponse {
  user: Record<string, unknown> | null
  session: Record<string, unknown> | null
  message?: string
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const response = await fetch(getRoute.api.auth.login(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to login")
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate auth-related queries
      invalidateQueries.auth(queryClient)
      
      toast.success("Successfully logged in")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to login")
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await fetch(getRoute.api.auth.register(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to register")
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Invalidate auth-related queries
      invalidateQueries.auth(queryClient)
      
      // Show the message from the API response (email confirmation)
      if (data.message) {
        toast.success(data.message)
      } else {
        toast.success("Account created successfully")
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register")
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (): Promise<{ message: string }> => {
      const response = await fetch(getRoute.api.auth.logout(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to logout")
      }

      return response.json()
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear()
      
      toast.success("Successfully logged out")
      
      // Redirect to login page
      router.push(getRoute.auth.login())
      router.refresh()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to logout")
    },
  })
}