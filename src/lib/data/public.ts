import { createClient } from "@/lib/supabase/server"

type PublishedDocument = {
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

type CategoryWithDocumentCount = {
  id: string
  name: string
  slug: string
  description: string | null
  documents: Array<{ count: number }>
}

/**
 * Get recent published documents for public docs homepage
 */
export async function getRecentPublishedDocuments(limit: number = 6, includeTags: boolean = false): Promise<PublishedDocument[]> {
  const supabase = await createClient()
  
  let selectQuery = `
    id,
    title,
    slug,
    description,
    published_at,
    updated_at,
    categories (
      id,
      name,
      slug
    )
  `
  
  if (includeTags) {
    selectQuery += `,
    document_tags (
      tags (
        id,
        name,
        slug
      )
    )`
  }
  
  const { data: documents, error } = await supabase
    .from('documents')
    .select(selectQuery)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch recent published documents: ${error.message}`)
  }

  return documents || []
}

/**
 * Get categories with document counts for public display
 */
export async function getPublicCategoriesWithCounts(): Promise<CategoryWithDocumentCount[]> {
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      documents!inner (count)
    `)
    .eq('documents.status', 'published')
    .order('name')

  if (error) {
    throw new Error(`Failed to fetch public categories: ${error.message}`)
  }

  return categories || []
}

type PublishedDocumentWithDetails = {
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

type DocumentMetadata = {
  title: string
  description: string | null
  content: string
  categories: {
    name: string
  } | null
}

/**
 * Get a published document by slug with full details
 */
export async function getPublishedDocumentBySlug(slug: string): Promise<PublishedDocumentWithDetails | null> {
  const supabase = await createClient()
  
  const { data: document, error } = await supabase
    .from('documents')
    .select(`
      id,
      title,
      content,
      description,
      published_at,
      updated_at,
      categories (
        id,
        name,
        slug
      ),
      document_tags (
        tags (
          id,
          name
        )
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch published document: ${error.message}`)
  }

  return document
}

/**
 * Get document metadata for SEO (lighter query for generateMetadata)
 */
export async function getDocumentMetadata(slug: string): Promise<DocumentMetadata | null> {
  const supabase = await createClient()
  
  const { data: document, error } = await supabase
    .from('documents')
    .select(`
      title,
      description,
      content,
      categories (name)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch document metadata: ${error.message}`)
  }

  return document
}

/**
 * Get published documents by category slug
 */
export async function getPublishedDocumentsByCategory(categorySlug: string, includeTags: boolean = false): Promise<PublishedDocument[]> {
  const supabase = await createClient()
  
  let selectQuery = `
    id,
    title,
    slug,
    description,
    published_at,
    updated_at,
    categories!inner (
      id,
      name,
      slug
    )
  `
  
  if (includeTags) {
    selectQuery += `,
    document_tags (
      tags (
        id,
        name,
        slug
      )
    )`
  }
  
  const { data: documents, error } = await supabase
    .from('documents')
    .select(selectQuery)
    .eq('status', 'published')
    .eq('categories.slug', categorySlug)
    .order('published_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch documents by category: ${error.message}`)
  }

  return documents || []
}

/**
 * Get all published documents with optional tag filtering
 */
export async function getAllPublishedDocuments(tagIds?: string[]): Promise<PublishedDocument[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('documents')
    .select(`
      id,
      title,
      slug,
      description,
      published_at,
      updated_at,
      categories (
        id,
        name,
        slug
      ),
      document_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // If tag filtering is requested, filter by tags
  if (tagIds && tagIds.length > 0) {
    query = query.in('document_tags.tag_id', tagIds)
  }

  const { data: documents, error } = await query

  if (error) {
    throw new Error(`Failed to fetch published documents: ${error.message}`)
  }

  return documents || []
}

/**
 * Search published documents
 */
export async function searchPublishedDocuments(query: string): Promise<PublishedDocument[]> {
  const supabase = await createClient()
  
  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      id,
      title,
      slug,
      description,
      published_at,
      updated_at,
      categories (
        id,
        name,
        slug
      ),
      document_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to search published documents: ${error.message}`)
  }

  return documents || []
}