import type { Breadcrumb } from '@/types/breadcrumb'

export interface CategoryPageClientProps {
  category: {
    id: string
    name: string
    description: string | null
    slug: string
  }
  initialDocuments: Array<{
    id: string
    title: string
    slug: string
    description: string | null
    published_at: string | null
    updated_at: string
    document_tags?: Array<{
      tags: {
        id: string
        name: string
        slug: string
      }
    }>
  }>
  breadcrumbs: Breadcrumb[]
  isAuthenticated: boolean
}