// Navigation types
export interface NavigationItem {
  id: string
  title: string
  slug: string
  children?: NavigationItem[]
}

// Auth types
export interface User {
  id: string
  email: string
  created_at: string
}

// Error types
export interface SupabaseError {
  message: string
  code?: string
  details?: string
  hint?: string
}