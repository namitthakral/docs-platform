import { notFound } from "next/navigation"
import { createClient, createBuildTimeClient } from "@/lib/supabase/server"
import { Metadata } from "next"
import { Database } from "@/types/database"
import { Breadcrumb } from "@/types/breadcrumb"
import { getPublishedDocumentsByCategory, getUncategorizedPublishedDocuments } from "@/lib/data/public"
import CategoryPageClient from "@/components/docs/category-page-client/category-page-client"

type Category = Database["public"]["Tables"]["categories"]["Row"]

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all public categories
export async function generateStaticParams() {
  try {
    const supabase = createBuildTimeClient()
    
    const { data: categories, error } = await supabase
      .from("categories")
      .select("slug")
      .eq("is_public", true) as {
        data: Array<{ slug: string }> | null
        error: Error | null
      }
    
    if (error) {
      console.warn('Failed to fetch categories for static generation:', error)
      return [{ slug: "other" }]
    }
    
    const params = categories?.map((category) => ({
      slug: category.slug
    })) || []
    
    // Add the special "other" category for uncategorized documents
    params.push({ slug: "other" })
    
    return params
  } catch (error) {
    console.warn('Error in generateStaticParams:', error)
    return [{ slug: "other" }]
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params

  // Handle special "other" category for uncategorized documents
  if (slug === "other") {
    return {
      title: "Other - Documentation",
      description: "Browse uncategorized documentation",
      openGraph: {
        title: "Other - Documentation",
        description: "Browse uncategorized documentation",
        type: "website",
      },
    }
  }

  const supabase = await createClient()

  const { data: category } = (await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single()) as { data: Pick<Category, "name" | "description"> | null }

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} - Documentation`,
    description:
      category.description || `Browse ${category.name} documentation`,
    openGraph: {
      title: `${category.name} - Documentation`,
      description:
        category.description || `Browse ${category.name} documentation`,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Check authentication status on the server
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Handle special "other" category for uncategorized documents
  if (slug === "other") {
    const documents = await getUncategorizedPublishedDocuments(true)
    
    const otherCategory = {
      id: 'uncategorized',
      name: 'Other',
      description: 'Uncategorized documents',
      slug: 'other'
    }

    return (
      <CategoryPageClient
        category={otherCategory}
        initialDocuments={documents || []}
        breadcrumbs={[]}
        isAuthenticated={isAuthenticated}
      />
    )
  }

  // Get category details
  const { data: category } = (await supabase
    .from("categories")
    .select("id, name, description, slug")
    .eq("slug", slug)
    .single()) as {
    data: Pick<Category, "id" | "name" | "description" | "slug"> | null
  }

  if (!category) {
    notFound()
  }

  // Get published documents in this category with tags
  const documents = await getPublishedDocumentsByCategory(slug, true)

  // Get breadcrumbs for this category (excluding the current category itself)
  let breadcrumbs: Breadcrumb[] = []
  if (category.id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any).rpc("get_category_breadcrumbs", {
      category_uuid: category.id,
    })
    // Filter out the current category (level 0) since we're already on this category page
    breadcrumbs = ((data as Breadcrumb[] | null) || []).filter(
      (item) => item.level > 0,
    )
  }

  return (
    <CategoryPageClient
      category={category}
      initialDocuments={documents || []}
      breadcrumbs={breadcrumbs}
      isAuthenticated={isAuthenticated}
    />
  )
}
