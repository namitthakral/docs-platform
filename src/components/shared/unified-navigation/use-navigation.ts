"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { getRoute } from "@/config/routes"
import { queryKeys } from "@/lib/query-keys"
import { Document, UseNavigationReturn, DynamicNavigationConfig } from "./unified-navigation.props"

export function useNavigation(
  dynamicConfig?: DynamicNavigationConfig
): UseNavigationReturn {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  
  const router = useRouter()
  const supabase = createClient()

  // Fetch documents using TanStack Query
  const {
    data: documents = [],
    isLoading: loading,
    refetch: fetchDocuments
  } = useQuery<Document[]>({
    queryKey: queryKeys.navigation.documents(),
    queryFn: async () => {
      const response = await fetch(getRoute.api.navigation.documents())
      
      if (!response.ok) {
        throw new Error('Failed to fetch navigation documents')
      }
      
      const { documents } = await response.json()
      return documents || []
    },
    enabled: !!dynamicConfig?.fetchDocuments,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push(getRoute.auth.login())
    router.refresh()
  }

  return {
    state: {
      documents,
      loading,
      expandedCategories
    },
    actions: {
      toggleCategory,
      handleSignOut,
      fetchDocuments: async () => {
        await fetchDocuments()
      }
    }
  }
}