import { createClient } from "@/lib/supabase/server"
import { Database } from "@/types/database"

type Tag = Database['public']['Tables']['tags']['Row']

/**
 * Get all tags ordered by name
 */
export async function getAllTags(): Promise<Tag[]> {
  const supabase = await createClient()
  
  const { data: tags, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`)
  }

  return tags || []
}

/**
 * Get a single tag by ID
 */
export async function getTagById(id: string): Promise<Tag | null> {
  const supabase = await createClient()
  
  const { data: tag, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch tag: ${error.message}`)
  }

  return tag
}

/**
 * Get tags for a specific document
 */
export async function getTagsForDocument(documentId: string): Promise<Tag[]> {
  const supabase = await createClient()
  
  const { data: documentTags, error } = await supabase
    .from("document_tags")
    .select(`
      tags (
        id,
        name,
        color,
        created_at,
        updated_at
      )
    `)
    .eq("document_id", documentId)

  if (error) {
    throw new Error(`Failed to fetch tags for document: ${error.message}`)
  }

  return documentTags?.map((dt: { tags: Tag }) => dt.tags).filter(Boolean) || []
}

/**
 * Search tags by name
 */
export async function searchTags(query: string): Promise<Tag[]> {
  const supabase = await createClient()
  
  const { data: tags, error } = await supabase
    .from("tags")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true })

  if (error) {
    throw new Error(`Failed to search tags: ${error.message}`)
  }

  return tags || []
}