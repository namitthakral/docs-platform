import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateSlug } from '@/lib/helpers'
import { Database } from '@/types/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get the tag data
    const { data: tag, error } = await supabase
      .from('tags')
      .select('id, name, slug, created_at')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    // Get the usage count separately
    const { data: tagUsage, error: countError } = await supabase
      .from('document_tags')
      .select('tag_id')
      .eq('tag_id', id)
    
    const usageCount = countError ? 0 : (tagUsage?.length || 0)
    
    const tagData = tag as Database['public']['Tables']['tags']['Row']
    const transformedTag = {
      id: tagData.id,
      name: tagData.name,
      slug: tagData.slug,
      created_at: tagData.created_at,
      usage_count: usageCount
    }
    
    return NextResponse.json({ tag: transformedTag })
  } catch (error) {
    console.error('Get tag API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { name } = await request.json()
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }
    
    const trimmedName = name.trim()
    
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: 'Tag name must be at least 2 characters long' },
        { status: 400 }
      )
    }
    
    if (trimmedName.length > 50) {
      return NextResponse.json(
        { error: 'Tag name must be less than 50 characters' },
        { status: 400 }
      )
    }
    
    // Check if tag exists
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id, name')
      .eq('id', id)
      .single()
    
    if (!existingTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }
    
    // Check if another tag with the same name exists (case-insensitive, excluding current)
    const { data: duplicateTag } = await supabase
      .from('tags')
      .select('id, name')
      .ilike('name', trimmedName)
      .neq('id', id)
      .single()
    
    if (duplicateTag) {
      return NextResponse.json(
        { error: `Tag "${(duplicateTag as Database['public']['Tables']['tags']['Row']).name}" already exists` },
        { status: 409 }
      )
    }
    
    const slug = generateSlug(trimmedName)
    
    // Update the tag
    // TypeScript has issues with Supabase type inference when using complex selects
    // This is a known limitation - the update operation is properly typed at runtime
    const { data: updatedTag, error } = await supabase
      .from('tags')
      // @ts-expect-error: Supabase type inference issue with complex queries
      .update({
        name: trimmedName,
        slug: slug
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating tag:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ 
      tag: updatedTag,
      message: 'Tag updated successfully' 
    })
  } catch (error) {
    console.error('Update tag API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if tag exists
    const { data: tag, error: fetchError } = await supabase
      .from('tags')
      .select('id, name')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
      }
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }
    
    // Check usage count separately
    const { data: tagUsage } = await supabase
      .from('document_tags')
      .select('tag_id')
      .eq('tag_id', id)
    
    const usageCount = tagUsage?.length || 0
    
    const tagData = tag as Database['public']['Tables']['tags']['Row']
    if (usageCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete tag "${tagData.name}" because it is used by ${usageCount} document(s)` },
        { status: 409 }
      )
    }
    
    // Delete the tag
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting tag:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ 
      message: 'Tag deleted successfully' 
    })
  } catch (error) {
    console.error('Delete tag API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}