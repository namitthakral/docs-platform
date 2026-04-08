import { ReactNode } from "react"
import { User } from "@supabase/supabase-js"
import { Database } from "@/types/database"

// Database types
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Document = Database["public"]["Tables"]["documents"]["Row"] & {
  categories?: Category
}

// Navigation item interfaces
export interface StaticNavigationItem {
  id: string
  name: string
  href: string
  icon: ReactNode
  badge?: string | number
  disabled?: boolean
}

export interface DynamicNavigationItem {
  id: string
  name: string
  href?: string
  icon?: ReactNode
  children?: DynamicNavigationItem[]
  count?: number
  isExpandable?: boolean
  metadata?: Record<string, unknown>
}

// Dynamic configuration for docs-style navigation
export interface DynamicNavigationConfig {
  categories?: Category[]
  fetchDocuments?: boolean
  showCounts?: boolean
  expandable?: boolean
}

// Style customization interface - matches the actual structure from unified-navigation.styles.ts
export interface NavigationStyles {
  desktop?: {
    container?: string
    nav?: string
    navList?: string
    navItem?: string
  }
  mobile?: {
    overlay?: {
      container?: string
      backdrop?: string
      sidebar?: string
    }
    header?: {
      container?: string
      content?: string
      title?: string
      closeButton?: string
      closeIcon?: string
    }
    nav?: string
  }
  navLink?: {
    base?: string
    active?: string
    inactive?: string
    disabled?: string
  }
  navIcon?: string
  navText?: string
  navBadge?: string
  category?: {
    button?: {
      base?: string
      withDocs?: string
      withoutDocs?: string
    }
    icon?: string
    count?: string
    expandIcon?: {
      base?: string
      expanded?: string
    }
  }
  documents?: {
    list?: string
    link?: {
      base?: string
      active?: string
      inactive?: string
    }
    icon?: string
  }
  userSection?: {
    container?: string
    content?: string
    userInfo?: {
      container?: string
      avatar?: string
      avatarIcon?: string
      email?: string
      emailText?: string
    }
    signOut?: {
      button?: string
      icon?: string
    }
  }
  loading?: {
    container?: string
    skeleton?: string
    skeletonItem?: {
      large?: string
      medium?: string
      small?: string
    }
  }
  specialLink?: {
    base?: string
    active?: string
    inactive?: string
  }
}

// Main component props
export interface UnifiedNavigationProps {
  // Navigation type and behavior
  variant: 'dashboard' | 'docs' | 'custom'
  
  // Static navigation (for dashboard-style)
  staticItems?: StaticNavigationItem[]
  
  // Dynamic navigation (for docs-style)
  dynamicConfig?: DynamicNavigationConfig
  
  // User and authentication
  user?: User | null
  showUserSection?: boolean
  
  // Layout and responsive
  isMobile?: boolean
  onNavigate?: () => void
  
  // Mobile overlay specific (when isMobile is true)
  isOpen?: boolean
  onClose?: () => void
  
  // Customization
  title?: string
  className?: string
  styles?: NavigationStyles
  
  // Loading state
  isLoading?: boolean
}

// Internal state interface
export interface NavigationState {
  documents: Document[]
  loading: boolean
  expandedCategories: Set<string>
}

// Hook return type
export interface UseNavigationReturn {
  state: NavigationState
  actions: {
    toggleCategory: (categoryId: string) => void
    handleSignOut: () => Promise<void>
    fetchDocuments: () => Promise<void>
  }
}