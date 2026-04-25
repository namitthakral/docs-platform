import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { revalidationPaths } from '@/config/routes'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const preview = searchParams.get('preview') === 'true'

    let query = supabase
      .from('documents')
      .select(`
        id,
        title,
        slug,
        content,
        description,
        status,
        version,
        created_at,
        updated_at,
        published_at,
        categories (
          id,
          name,
          slug,
          is_public
        ),
        document_tags (
          tags (
            id,
            name,
            slug
          )
        )
      `)
      .eq('id', id)

    // If not preview mode, only show published docs
    if (!preview) {
      query = query.eq('status', 'published')
    }

    const { data: document, error } = await query.single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error fetching document:', error)
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
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, content, description, category_id, status } = body

    const { data: document, error } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('documents') as any)
      .update({
        title,
        slug,
        content,
        description,
        category_id,
        status,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        id,
        title,
        slug,
        description,
        content,
        status,
        version,
        created_at,
        updated_at,
        published_at,
        categories (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Trigger revalidation for the updated document
    if (document && status === 'published') {
      try {
        const pathsToRevalidate = revalidationPaths.forDocument(
          document.slug,
          document.categories?.slug
        )
        
        pathsToRevalidate.forEach(path => revalidatePath(path))
      } catch (revalidationError) {
        console.error('Failed to revalidate paths:', revalidationError)
        // Don't fail the request if revalidation fails
      }
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error updating document:', error)
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
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get document details before deletion for revalidation
    const { data: document } = await supabase
      .from('documents')
      .select(`
        slug,
        status,
        categories (slug)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single() as {
        data: {
          slug: string
          status: string
          categories: { slug: string } | null
        } | null
      }

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Trigger revalidation for the deleted document if it was published
    if (document && document.status === 'published') {
      try {
        const pathsToRevalidate = revalidationPaths.forDocument(
          document.slug,
          document.categories?.slug
        )
        
        pathsToRevalidate.forEach(path => revalidatePath(path))
      } catch (revalidationError) {
        console.error('Failed to revalidate paths:', revalidationError)
        // Don't fail the request if revalidation fails
      }
    }

    return NextResponse.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}