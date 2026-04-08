export interface DocsHomeClientProps {
  initialDocuments: Array<{
    id: string
    title: string
    slug: string
    description: string | null
    published_at: string | null
    categories: {
      id: string
      name: string
      slug: string
    } | null
    document_tags?: Array<{
      tags: {
        id: string
        name: string
        slug: string
      }
    }>
  }>
  categories: Array<{
    id: string
    name: string
    slug: string
    description: string | null
    documents: Array<{ count: number }>
  }>
  isAuthenticated: boolean
}