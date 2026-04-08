import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/lib/data/stats'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
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

    const stats: DashboardStats = {
      totalDocs: totalDocs || 0,
      publishedDocs: publishedDocs || 0,
      draftDocs: draftDocs || 0,
      archivedDocs: archivedDocs || 0,
      totalCategories: totalCategories || 0,
      totalTags: totalTags || 0,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Dashboard stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}