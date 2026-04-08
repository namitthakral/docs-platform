'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { debounce } from '@/lib/helpers'
import { getRoute } from '@/config/routes'
import { queryKeys } from '@/lib/query-keys'
import type { SearchResult } from '@/types/search'

// Dashboard search result type (matches what dashboard API returns)
export interface DashboardSearchResult {
  id: string
  title: string
  slug: string
  description?: string
  snippet?: string
  status: 'draft' | 'published'
  category?: {
    name: string
    slug: string
  } | null
  updated_at: string
  created_at: string
}

// Union type for all possible search results
export type UnifiedSearchResult = SearchResult | DashboardSearchResult

interface UseUnifiedSearchOptions {
  mode: 'public' | 'dashboard'
  debounceMs?: number
  enabled?: boolean
  minQueryLength?: number
}

interface UseUnifiedSearchResult {
  query: string
  setQuery: (query: string) => void
  results: UnifiedSearchResult[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  clearSearch: () => void
}

// Search functions
async function searchPublicDocuments(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  
  const response = await fetch(getRoute.api.search(query, 10))
  
  if (!response.ok) {
    throw new Error('Search failed')
  }
  
  const { results } = await response.json()
  return results || []
}

async function searchDashboardDocuments(query: string): Promise<DashboardSearchResult[]> {
  if (!query.trim()) return []
  
  const response = await fetch(getRoute.api.dashboard.search(query))
  
  if (!response.ok) {
    throw new Error('Dashboard search failed')
  }
  
  const { results } = await response.json()
  return results || []
}

export function useUnifiedSearch(options: UseUnifiedSearchOptions): UseUnifiedSearchResult {
  const {
    mode,
    debounceMs = 300,
    enabled = true,
    minQueryLength = 2
  } = options
  
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  
  // Debounce the search query
  const debouncedSetQuery = useCallback((value: string) => {
    const debouncedFn = debounce((val: string) => {
      setDebouncedQuery(val)
    }, debounceMs)
    debouncedFn(value)
  }, [debounceMs])
  
  useEffect(() => {
    debouncedSetQuery(query)
  }, [query, debouncedSetQuery])
  
  const {
    data: results = [],
    isLoading,
    isError,
    error
  } = useQuery<UnifiedSearchResult[]>({
    queryKey: mode === 'public' 
      ? queryKeys.search.public(debouncedQuery)
      : queryKeys.search.dashboard(debouncedQuery),
    queryFn: async () => {
      if (mode === 'public') {
        return await searchPublicDocuments(debouncedQuery) as UnifiedSearchResult[]
      } else {
        return await searchDashboardDocuments(debouncedQuery) as UnifiedSearchResult[]
      }
    },
    enabled: enabled && debouncedQuery.length >= minQueryLength,
    staleTime: mode === 'public' ? 1000 * 60 * 5 : 1000 * 30, // 5 min for public, 30s for dashboard
    gcTime: mode === 'public' ? 1000 * 60 * 10 : 1000 * 60 * 5, // 10 min for public, 5 min for dashboard
  })
  
  const clearSearch = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
  }, [])
  
  return {
    query,
    setQuery,
    results,
    isLoading,
    isError,
    error: error as Error | null,
    clearSearch
  }
}