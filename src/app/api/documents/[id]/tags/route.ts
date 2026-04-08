import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/database'

type DocumentTagWithTag = {
  tags: {
    id: string
    name: string
    slug: string
    created_at: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Get tags for the document
    const { data: documentTags, error } = await supabase
      .from('document_tags')
      .select(`
        tags (
          id,
          name,
          slug,
          created_at
        )
      `)
      .eq('document_id', id)
    
    if (error) {
      console.error('Error fetching document tags:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    const tags = (documentTags as DocumentTagWithTag[])?.map((dt) => dt.tags).filter(Boolean) || []
    
    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Get document tags API error:', error)
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
    
    const { tagIds } = await request.json()
    
    if (!Array.isArray(tagIds)) {
      return NextResponse.json(
        { error: 'tagIds must be an array' },
        { status: 400 }
      )
    }
    
    // Verify user owns the document
    const { data: document } = await supabase
      .from('documents')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or access denied' },
        { status: 404 }
      )
    }
    
    // Verify all tag IDs exist
    if (tagIds.length > 0) {
      const { data: existingTags, error: tagsError } = await supabase
        .from('tags')
        .select('id')
        .in('id', tagIds)
      
      if (tagsError) {
        return NextResponse.json({ error: tagsError.message }, { status: 400 })
      }
      
      if (existingTags.length !== tagIds.length) {
        return NextResponse.json(
          { error: 'One or more tag IDs are invalid' },
          { status: 400 }
        )
      }
    }
    
    // Remove all existing document-tag relationships
    const { error: deleteError } = await supabase
      .from('document_tags')
      .delete()
      .eq('document_id', id)
    
    if (deleteError) {
      console.error('Error removing existing document tags:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }
    
    // Add new document-tag relationships
    if (tagIds.length > 0) {
      const documentTagsToInsert: Database['public']['Tables']['document_tags']['Insert'][] = tagIds.map((tagId: string) => ({
        document_id: id,
        tag_id: tagId
      }))
      
      // TypeScript has issues with Supabase type inference when using complex selects
      // This is a known limitation - the insert operation is properly typed at runtime
      const { error: insertError } = await supabase
        .from('document_tags')
        // @ts-expect-error: Supabase type inference issue with complex queries
        .insert(documentTagsToInsert)
      
      if (insertError) {
        console.error('Error adding document tags:', insertError)
        return NextResponse.json({ error: insertError.message }, { status: 400 })
      }
    }
    
    // Fetch and return the updated tags
    const { data: updatedDocumentTags } = await supabase
      .from('document_tags')
      .select(`
        tags (
          id,
          name,
          slug,
          created_at
        )
      `)
      .eq('document_id', id)
    
    const tags = (updatedDocumentTags as DocumentTagWithTag[])?.map((dt) => dt.tags).filter(Boolean) || []
    
    return NextResponse.json({ 
      tags,
      message: 'Document tags updated successfully' 
    })
  } catch (error) {
    console.error('Update document tags API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}