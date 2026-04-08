import { createClient } from "@/lib/supabase/server"

export interface DashboardStats {
  totalDocs: number
  publishedDocs: number
  draftDocs: number
  archivedDocs: number
  totalCategories: number
  totalTags: number
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  
  const [
    { count: totalDocs },
    { count: publishedDocs },
    { count: draftDocs },
    { count: archivedDocs },
    { count: totalCategories },
    { count: totalTags }
  ] = await Promise.all([
    supabase.from('documents').select('*', { count: 'exact', head: true }),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'archived'),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('tags').select('*', { count: 'exact', head: true })
  ])

  return {
    totalDocs: totalDocs || 0,
    publishedDocs: publishedDocs || 0,
    draftDocs: draftDocs || 0,
    archivedDocs: archivedDocs || 0,
    totalCategories: totalCategories || 0,
    totalTags: totalTags || 0,
  }
}

/**
 * Get document counts by status
 */
export async function getDocumentCountsByStatus(): Promise<Record<string, number>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('documents')
    .select('status')
  
  if (error) {
    throw new Error(`Failed to fetch document counts by status: ${error.message}`)
  }
  
  const counts: Record<string, number> = {}
  data?.forEach((doc: { status: string }) => {
    counts[doc.status] = (counts[doc.status] || 0) + 1
  })

  return counts || {}
}

/**
 * Get recent documents (last 10)
 */
export async function getRecentDocuments() {
  const supabase = await createClient()
  
  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      id,
      title,
      status,
      updated_at,
      categories (
        name
      )
    `)
    .order('updated_at', { ascending: false })
    .limit(10)

  if (error) {
    throw new Error(`Failed to fetch recent documents: ${error.message}`)
  }

  return documents || []
}