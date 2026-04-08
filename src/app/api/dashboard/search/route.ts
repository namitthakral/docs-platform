import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Search documents (including drafts) that belong to the authenticated user
    // Use unified search function for dashboard search (user's docs including drafts)
    const { data: results, error } = await (supabase as any)
      .rpc('search_documents', { 
        search_query: query.trim(),
        user_uuid: user.id,
        include_drafts: true
      })

    if (error) {
      console.error('Dashboard search error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }


    // Transform results to match expected format
    const searchResults = results?.map((result: any) => ({
      id: result.id,
      title: result.title,
      slug: result.slug,
      description: result.description,
      snippet: result.highlighted_snippet, // Use the snippet from the unified function
      status: result.status,
      category: result.category_name ? {
        name: result.category_name,
        slug: result.category_slug,
      } : null,
      created_at: result.created_at,
      updated_at: result.updated_at,
    })) || []

    return NextResponse.json({ 
      results: searchResults,
      query: query.trim(),
      total: searchResults.length 
    })
  } catch (error) {
    console.error('Dashboard search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}