export interface DocumentWithRelations {
  id: string
  title: string
  content: string
  description: string | null
  status: string
  version: number
  published_at: string | null
  updated_at: string
  user_id: string
  categories: {
    id: string
    name: string
    slug: string
    is_public: boolean
  } | null
  document_tags: Array<{
    tags: {
      id: string
      name: string
      slug: string
    }
  }> | null
}

export interface CategoryWithPublic {
  id: string
  is_public: boolean
}

export interface DocPageProps {
  params: Promise<{
    slug: string[]
  }>
  searchParams: Promise<{
    preview?: string
  }>
}