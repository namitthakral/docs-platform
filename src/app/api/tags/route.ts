import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateSlug } from '@/lib/helpers'
import { Database } from '@/types/database'

type Tag = Database['public']['Tables']['tags']['Row']
type DocumentTag = {
  tag_id: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const withCounts = searchParams.get('counts') === 'true'
    
    const supabase = await createClient()
    
    // First, get the basic tag data
    let queryBuilder = supabase
      .from('tags')
      .select('id, name, slug, created_at')
      .order('name', { ascending: true })
    
    // Add search filter if query provided
    if (query && query.trim().length > 0) {
      queryBuilder = queryBuilder.ilike('name', `%${query.trim()}%`)
    }
    
    const { data: tags, error } = await queryBuilder
    
    if (error) {
      console.error('Error fetching tags:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    // If counts are requested, get them separately
    let transformedTags
    if (withCounts && tags) {
      const typedTags = tags as Tag[]
      // Get usage counts for all tags in a single query
      const { data: tagCounts, error: countError } = await supabase
        .from('document_tags')
        .select('tag_id')
        .in('tag_id', typedTags.map(tag => tag.id))
      
      if (countError) {
        console.error('Error fetching tag counts:', countError)
        // Continue without counts rather than failing
        transformedTags = typedTags.map(tag => ({
          ...tag,
          usage_count: 0
        }))
      } else {
        // Count occurrences of each tag
        const countMap = new Map<string, number>()
        const typedTagCounts = tagCounts as DocumentTag[]
        typedTagCounts?.forEach(item => {
          const count = countMap.get(item.tag_id) || 0
          countMap.set(item.tag_id, count + 1)
        })
        
        transformedTags = typedTags.map(tag => ({
          ...tag,
          usage_count: countMap.get(tag.id) || 0
        }))
      }
    } else {
      const typedTags = tags as Tag[]
      transformedTags = typedTags?.map(tag => ({
        ...tag,
        usage_count: undefined
      })) || []
    }
    
    return NextResponse.json({ 
      tags: transformedTags,
      total: transformedTags.length 
    })
  } catch (error) {
    console.error('Tags API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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
    
    const slug = generateSlug(trimmedName)
    
    // Check if tag already exists (case-insensitive)
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id, name')
      .ilike('name', trimmedName)
      .single()
    
    if (existingTag) {
      return NextResponse.json(
        { error: `Tag "${(existingTag as Database['public']['Tables']['tags']['Row']).name}" already exists` },
        { status: 409 }
      )
    }
    
    // Create the tag
    // TypeScript has issues with Supabase type inference when using complex selects
    // This is a known limitation - the insert operation is properly typed at runtime
    const { data: newTag, error } = await supabase
      .from('tags')
      // @ts-expect-error: Supabase type inference issue with complex queries
      .insert({
        name: trimmedName,
        slug: slug
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating tag:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ 
      tag: newTag,
      message: 'Tag created successfully' 
    }, { status: 201 })
  } catch (error) {
    console.error('Create tag API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}