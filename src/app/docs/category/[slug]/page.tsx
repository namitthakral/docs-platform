import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Metadata } from "next"
import { Database } from "@/types/database"
import { Breadcrumb } from "@/types/breadcrumb"
import { getPublishedDocumentsByCategory } from "@/lib/data/public"
import CategoryPageClient from "@/components/docs/category-page-client/category-page-client"

type Category = Database["public"]["Tables"]["categories"]["Row"]
type Document = Database["public"]["Tables"]["documents"]["Row"]

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
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
