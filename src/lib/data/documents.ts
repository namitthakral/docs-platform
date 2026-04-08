import { createClient } from "@/lib/supabase/server"
import {
  DocumentStatus, 
  DocumentTableRow,
  DocumentEditorData,
  RawDocumentTableRow,
  RawDocumentEditorData
} from "@/types/document"

/**
 * Get all documents with their categories, ordered by updated_at desc
 */
export async function getAllDocuments(): Promise<DocumentTableRow[]> {
  const supabase = await createClient()
  
  const { data: documents, error } = await supabase
    .from("documents")
    .select(`
      id,
      title,
      slug,
      status,
      created_at,
      updated_at,
      published_at,
      categories (
        id,
        name
      )
    `)
    .order("updated_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`)
  }

  // Transform to match component expectations
  return (documents as RawDocumentTableRow[] || []).map(doc => ({
    ...doc,
    status: doc.status as DocumentStatus
  }))
}

/**
 * Get a single document by ID with its tags
 */
export async function getDocumentById(id: string): Promise<DocumentEditorData | null> {
  const supabase = await createClient()
  
  const { data: document, error } = await supabase
    .from("documents")
    .select(`
      id,
      title,
      slug,
      content,
      description,
      status,
      category_id,
      created_at,
      updated_at,
      published_at,
      document_tags (
        tags (
          id,
          name
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to fetch document: ${error.message}`)
  }

  if (!document) return null

  const rawDoc = document as RawDocumentEditorData

  // Transform to match component expectations
  return {
    ...rawDoc,
    description: rawDoc.description || '', // Ensure non-null for component
    status: rawDoc.status as DocumentStatus,
    document_tags: rawDoc.document_tags || []
  }
}

/**
 * Get documents by status
 */
export async function getDocumentsByStatus(status: 'draft' | 'published' | 'archived'): Promise<DocumentTableRow[]> {
  const supabase = await createClient()
  
  const { data: documents, error } = await supabase
    .from("documents")
    .select(`
      id,
      title,
      slug,
      status,
      created_at,
      updated_at,
      published_at,
      categories (
        id,
        name
      )
    `)
    .eq("status", status)
    .order("updated_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch documents by status: ${error.message}`)
  }

  // Transform to match component expectations
  return (documents as RawDocumentTableRow[] || []).map(doc => ({
    ...doc,
    status: doc.status as DocumentStatus
  }))
}

/**
 * Get documents by category
 */
export async function getDocumentsByCategory(categoryId: string): Promise<DocumentTableRow[]> {
  const supabase = await createClient()
  
  const { data: documents, error } = await supabase
    .from("documents")
    .select(`
      id,
      title,
      slug,
      status,
      created_at,
      updated_at,
      published_at,
      categories (
        id,
        name
      )
    `)
    .eq("category_id", categoryId)
    .order("updated_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch documents by category: ${error.message}`)
  }

  // Transform to match component expectations
  return (documents as RawDocumentTableRow[] || []).map(doc => ({
    ...doc,
    status: doc.status as DocumentStatus
  }))
}

/**
 * Search documents by title or content
 */
export async function searchDocuments(query: string): Promise<DocumentTableRow[]> {
  const supabase = await createClient()
  
  const { data: documents, error } = await supabase
    .from("documents")
    .select(`
      id,
      title,
      slug,
      status,
      created_at,
      updated_at,
      published_at,
      categories (
        id,
        name
      )
    `)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("updated_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to search documents: ${error.message}`)
  }

  // Transform to match component expectations
  return (documents as RawDocumentTableRow[] || []).map(doc => ({
    ...doc,
    status: doc.status as DocumentStatus
  }))
}