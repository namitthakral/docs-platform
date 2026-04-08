import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DocumentStatus } from "@/types/document"

// Standardized API response format
type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

function createResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  status = 200,
): NextResponse {
  const response: ApiResponse<T> = { success }
  if (data !== undefined) response.data = data
  if (error) response.error = error
  return NextResponse.json(response, { status })
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status") as DocumentStatus | null
    const categoryId = searchParams.get("categoryId")
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined

    let query = supabase
      .from("documents")
      .select(
        `
        id,
        title,
        slug,
        description,
        status,
        created_at,
        updated_at,
        published_at,
        categories (
          id,
          name,
          slug
        ),
        document_tags (
          tags (
            id,
            name
          )
        )
      `,
      )
      .order("updated_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      return createResponse(false, null, error.message, 500)
    }

    return createResponse(true, data)
  } catch {
    return createResponse(false, null, "Internal server error", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.slug) {
      return createResponse(false, null, "Title and slug are required", 400)
    }

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return createResponse(false, null, "Unauthorized", 401)
    }

    // Add user_id to the document data
    const documentData = {
      ...body,
      user_id: user.id,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("documents") as any)
      .insert(documentData)
      .select()
      .single()

    if (error) {
      return createResponse(false, null, error.message, 400)
    }

    return createResponse(true, data, undefined, 201)
  } catch {
    return createResponse(false, null, "Internal server error", 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return createResponse(false, null, "Document ID is required", 400)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("documents") as any)
      .update(body)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return createResponse(false, null, error.message, 400)
    }

    return createResponse(true, data)
  } catch {
    return createResponse(false, null, "Internal server error", 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return createResponse(false, null, "Document ID is required", 400)
    }

    const { error } = await supabase.from("documents").delete().eq("id", id)

    if (error) {
      return createResponse(false, null, error.message, 400)
    }

    return createResponse(true, { id })
  } catch {
    return createResponse(false, null, "Internal server error", 500)
  }
}
