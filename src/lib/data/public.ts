import { createClient } from "@/lib/supabase/server"
import type {
  PublishedDocument,
  PublicCategoryWithDocumentCount,
  PublishedDocumentWithDetails,
  DocumentMetadata
} from "@/types/public"

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
export async function getPublicCategoriesWithCounts(): Promise<PublicCategoryWithDocumentCount[]> {
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

/**
 * Get count of uncategorized published documents
 */
export async function getUncategorizedDocumentCount(): Promise<number> {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .is('category_id', null)

  if (error) {
    throw new Error(`Failed to fetch uncategorized document count: ${error.message}`)
  }

  return count || 0
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
 * Get published documents that are uncategorized
 */
export async function getUncategorizedPublishedDocuments(includeTags: boolean = false): Promise<PublishedDocument[]> {
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
    .is('category_id', null)
    .order('published_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch uncategorized documents: ${error.message}`)
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