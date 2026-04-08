import { CategoryWithDocumentCount } from '@/types/category'

export interface CategoriesManagerProps {
  categories: CategoryWithDocumentCount[]
  externalShowForm?: boolean
  onCloseForm?: () => void
}

export interface CategoryFormData {
  name: string
  slug: string
  description: string
  parent_id: string | null
}