import { createClient } from "@/lib/supabase/server"
import { Database } from "@/types/database"

type Category = Database['public']['Tables']['categories']['Row']

type CategoryWithDocumentCount = Category & {
  documents: Array<{ count: number }>
}

/**
 * Get all categories ordered by sort_order
 */
export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return categories || []
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient()
  
  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch category: ${error.message}`)
  }

  return category
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  
  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch category: ${error.message}`)
  }

  return category
}

/**
 * Get root categories (categories without parent)
 */
export async function getRootCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .order("sort_order", { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch root categories: ${error.message}`)
  }

  return categories || []
}

/**
 * Get subcategories of a parent category
 */
export async function getSubcategories(parentId: string): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parentId)
    .order("sort_order", { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch subcategories: ${error.message}`)
  }

  return categories || []
}

/**
 * Get all categories with document counts for dashboard management
 */
export async function getCategoriesWithDocumentCounts(): Promise<CategoryWithDocumentCount[]> {
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      description,
      parent_id,
      sort_order,
      created_at,
      updated_at,
      documents (count)
    `)
    .order("name")

  if (error) {
    throw new Error(`Failed to fetch categories with document counts: ${error.message}`)
  }

  return categories || []
}