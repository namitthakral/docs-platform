import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: documents, error } = await supabase
      .from("documents")
      .select(`
        id,
        title,
        slug,
        category_id,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq("status", "published")
      .order("title")

    if (error) {
      console.error('Navigation documents fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const response = NextResponse.json({ 
      documents: documents || [],
      total: documents?.length || 0 
    })

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    console.error('Navigation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}