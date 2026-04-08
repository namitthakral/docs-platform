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

    return NextResponse.json({ 
      documents: documents || [],
      total: documents?.length || 0 
    })
  } catch (error) {
    console.error('Navigation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}