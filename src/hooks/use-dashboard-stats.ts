'use client'

import { useQuery } from '@tanstack/react-query'
import { getRoute } from '@/config/routes'
import type { DashboardStats } from '@/lib/data/stats'

interface UseDashboardStatsOptions {
  enabled?: boolean
}

interface UseDashboardStatsResult {
  stats: DashboardStats | null
  isLoading: boolean
  isError: boolean
  error: Error | null
}

// Fetch dashboard statistics
export function useDashboardStats(options: UseDashboardStatsOptions = {}): UseDashboardStatsResult {
  const { enabled = true } = options
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      
      const result = await response.json()
      return result.stats
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Refresh when user returns to tab
  })
  
  return {
    stats: data || null,
    isLoading,
    isError,
    error: error as Error | null,
  }
}