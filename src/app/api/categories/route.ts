import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const includePrivate = searchParams.get("includePrivate") === "true"
    const withCounts = searchParams.get("withCounts") === "true"

    let query = supabase
      .from("categories")
      .select(
        `
        id,
        name,
        slug,
        description,
        parent_id,
        sort_order,
        is_public,
        created_at,
        updated_at
        ${withCounts ? ", documents(count)" : ""}
      `,
      )
      .order("sort_order")
      .order("name")

    // Filter by visibility unless explicitly including private
    if (!includePrivate) {
      query = query.eq("is_public", true)
    }

    const { data: categories, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      parent_id,
      sort_order = 0,
      is_public = true,
    } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      )
    }

    const categoryData = {
      name,
      slug,
      description,
      parent_id,
      sort_order,
      is_public,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: category, error } = await (supabase.from("categories") as any)
      .insert(categoryData)
      .select(
        `
        id,
        name,
        slug,
        description,
        parent_id,
        sort_order,
        is_public,
        created_at,
        updated_at
      `,
      )
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
