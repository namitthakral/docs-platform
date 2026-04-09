// Types for public-facing documentation pages and API responses

export type PublishedDocument = {
  id: string
  title: string
  slug: string
  description: string | null
  published_at: string | null
  updated_at: string
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
}

export type PublicCategoryWithDocumentCount = {
  id: string
  name: string
  slug: string
  description: string | null
  documents: Array<{ count: number }>
}

export type PublishedDocumentWithDetails = {
  id: string
  title: string
  content: string
  description: string | null
  published_at: string | null
  updated_at: string
  categories: {
    id: string
    name: string
    slug: string
  } | null
  document_tags: Array<{
    tags: {
      id: string
      name: string
    }
  }>
}

export type DocumentMetadata = {
  title: string
  description: string | null
  content: string
  categories: {
    name: string
  } | null
}