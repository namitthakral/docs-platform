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
    
    // Use the unified search function for public search (published docs only)
    const { data: results, error } = await supabase
      .rpc('search_documents', { 
        search_query: query.trim(),
        user_uuid: null,
        include_drafts: false
      } as any)

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Transform results to match expected format
    const searchResults = (results as any[])?.map((result: any) => ({
      id: result.id,
      title: result.title,
      slug: result.slug,
      description: result.description,
      snippet: result.highlighted_snippet,
      category: result.category_name ? {
        name: result.category_name,
        slug: result.category_slug,
      } : null,
      relevance: result.relevance_score,
    })) || []

    return NextResponse.json({ 
      results: searchResults,
      query: query.trim(),
      total: searchResults.length 
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}