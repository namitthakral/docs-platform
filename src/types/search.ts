export interface SearchResult {
  id: string
  title: string
  slug: string
  description?: string
  snippet: string
  category?: {
    name: string
    slug: string
  } | null
  relevance: number
}