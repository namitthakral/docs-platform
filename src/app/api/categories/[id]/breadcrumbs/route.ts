import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Use the breadcrumbs function from the database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: breadcrumbs, error } = await (supabase as any)
      .rpc('get_category_breadcrumbs', { category_uuid: id })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ breadcrumbs })
  } catch (error) {
    console.error('Error fetching category breadcrumbs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}