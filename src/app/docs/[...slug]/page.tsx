import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, Edit } from "lucide-react"
import Breadcrumbs from "@/components/shared/breadcrumbs/breadcrumbs"
import TableOfContents from "@/components/docs/table-of-contents/table-of-contents"
import MarkdownRenderer from "@/components/docs/markdown-renderer/markdown-renderer"
import TagList from "@/components/shared/tag-list/tag-list"
import { Breadcrumb } from "@/types/breadcrumb"
import {
  DocumentWithRelations,
  CategoryWithPublic,
  DocPageProps,
} from "@/types/docs"
import "highlight.js/styles/github.css"

async function getDocumentByPath(
  slug: string[],
  preview: boolean = false,
): Promise<DocumentWithRelations | null> {
  const supabase = await createClient()

  // Handle different slug patterns:
  // /docs/slug -> document with slug in root category
  // /docs/category/slug -> document with slug in specific category

  let query = supabase.from("documents").select(`
      id,
      title,
      content,
      description,
      status,
      version,
      published_at,
      updated_at,
      user_id,
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

  if (slug.length === 1) {
    // Single slug - could be document slug or category
    query = query.eq("slug", slug[0])
  } else if (slug.length === 2) {
    // Category/document pattern
    const [categorySlug, documentSlug] = slug

    // First get category
    const { data: category } = await supabase
      .from("categories")
      .select("id, is_public")
      .eq("slug", categorySlug)
      .single()

    const categoryData = category as CategoryWithPublic | null

    if (!categoryData || (!preview && !categoryData.is_public)) {
      return null
    }

    query = query.eq("slug", documentSlug).eq("category_id", categoryData.id)
  } else {
    // More complex nested structure - not supported yet
    return null
  }

  // Filter by status unless preview mode
  if (!preview) {
    query = query.eq("status", "published")
  }

  const { data: document } = await query.single()
  return document as DocumentWithRelations | null
}

export async function generateMetadata({
  params,
  searchParams,
}: DocPageProps): Promise<Metadata> {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === "true"
  const document = await getDocumentByPath(slug, isPreview)

  if (!document) {
    return {
      title: "Document Not Found",
    }
  }

  const categoryName = document.categories?.name
  const title = categoryName
    ? `${document.title} - ${categoryName}`
    : document.title

  return {
    title,
    description: document.description || `Documentation: ${document.title}`,
    openGraph: {
      title,
      description: document.description || `Documentation: ${document.title}`,
      type: "article",
    },
  }
}

export default async function DocPage({ params, searchParams }: DocPageProps) {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === "true"
  const document = await getDocumentByPath(slug, isPreview)

  if (!document) {
    notFound()
  }

  // Check if current user can edit this document
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const canEdit = user && user.id === document.user_id

  // Get breadcrumbs if document has a category
  let breadcrumbs: Breadcrumb[] = []
  if (document.categories?.id) {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any).rpc("get_category_breadcrumbs", {
      category_uuid: document.categories.id,
    })
    breadcrumbs = (data as Breadcrumb[] | null) || []
  }

  return (
    <div className="max-w-none">
      {/* Preview Banner */}
      {isPreview && document.status === "draft" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Preview Mode:</strong> This is a draft document and not
                publicly visible.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs breadcrumbs={breadcrumbs} currentTitle={document.title} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Document Header */}
          <header className="mb-8 pb-8 border-b border-gray-200">
            <div className="space-y-4">
              {document.categories && (
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {document.categories.name}
                  </span>
                  {document.status === "draft" && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      Draft
                    </span>
                  )}
                </div>
              )}

              <h1 className="text-4xl font-bold text-gray-900">
                {document.title}
              </h1>

              {document.description && (
                <p className="text-xl text-gray-600">{document.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {document.published_at && (
                    <time dateTime={document.published_at}>
                      Published{" "}
                      {new Date(document.published_at).toLocaleDateString()}
                    </time>
                  )}
                  {document.updated_at &&
                    document.updated_at !== document.published_at && (
                      <time dateTime={document.updated_at}>
                        Updated{" "}
                        {new Date(document.updated_at).toLocaleDateString()}
                      </time>
                    )}
                  <span>Version {document.version}</span>
                </div>

                {canEdit && (
                  <Link
                    href={`/dashboard/documents/${document.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Document
                  </Link>
                )}
              </div>

              {document.document_tags && document.document_tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Tags</h4>
                  <TagList
                    tags={document.document_tags.map(docTag => ({
                      id: docTag.tags.id || '',
                      name: docTag.tags.name,
                      slug: docTag.tags.slug || '',
                      created_at: ''
                    }))}
                    readonly={true}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </header>

          {/* Document Content */}
          <div className="prose prose-lg prose-gray max-w-none">
            <MarkdownRenderer content={document.content} />
          </div>
        </div>

        {/* Sidebar - Table of Contents */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <TableOfContents content={document.content} />
          </div>
        </div>
      </div>
    </div>
  )
}
