import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/database'
import { revalidatePath } from 'next/cache'
import { revalidationPaths } from '@/config/routes'

type Category = Database['public']['Tables']['categories']['Row']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: category, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        parent_id,
        sort_order,
        is_public,
        created_at,
        updated_at,
        documents(count)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error fetching category:', error)
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
    const { name, slug, description, parent_id, sort_order, is_public } = body

    const { data: category, error } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('categories') as any)
      .update({
        name,
        slug,
        description,
        parent_id,
        sort_order,
        is_public,
      })
      .eq('id', id)
      .select(`
        id,
        name,
        slug,
        description,
        parent_id,
        sort_order,
        is_public,
        created_at,
        updated_at
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Trigger revalidation for docs pages if the category is public
    if (category && category.is_public) {
      try {
        const pathsToRevalidate = revalidationPaths.forCategory(category.slug)
        pathsToRevalidate.forEach(path => revalidatePath(path))
      } catch (revalidationError) {
        console.error('Failed to revalidate paths:', revalidationError)
      }
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error updating category:', error)
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

    // Check if category exists and get its details
    const { data: category, error: fetchError } = await supabase
      .from('categories')
      .select('id, name, slug, is_public')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Type assertion to ensure TypeScript knows category is not null
    const categoryData = category as Category

    // Check if any documents are using this category
    const { data: documentsUsingCategory } = await supabase
      .from('documents')
      .select('id')
      .eq('category_id', id)

    const documentCount = documentsUsingCategory?.length || 0

    // Check if any subcategories have this category as parent
    const { data: subcategories } = await supabase
      .from('categories')
      .select('id, name')
      .eq('parent_id', id)

    const subcategoryCount = subcategories?.length || 0

    // Prevent deletion if category is in use
    if (documentCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category "${categoryData.name}" because it contains ${documentCount} document(s)` },
        { status: 409 }
      )
    }

    if (subcategoryCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category "${categoryData.name}" because it has ${subcategoryCount} subcategory(ies)` },
        { status: 409 }
      )
    }

    // Safe to delete - no documents or subcategories depend on this category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Trigger revalidation for docs pages if the category was public
    if (categoryData.is_public) {
      try {
        const pathsToRevalidate = revalidationPaths.forCategory(categoryData.slug)
        pathsToRevalidate.forEach(path => revalidatePath(path))
      } catch (revalidationError) {
        console.error('Failed to revalidate paths:', revalidationError)
      }
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}