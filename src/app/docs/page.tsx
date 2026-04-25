import {
  getRecentPublishedDocuments,
  getPublicCategoriesWithCounts,
  getUncategorizedDocumentCount,
} from "@/lib/data/public"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import DocsHomeClient from "@/components/docs/docs-home-client/docs-home-client"

// Static generation - will be revalidated on-demand when content changes

export const metadata: Metadata = {
  title: "Documentation",
  description: "Browse our comprehensive documentation",
  openGraph: {
    title: "Documentation",
    description: "Browse our comprehensive documentation",
    type: "website",
  },
}

export default async function DocsHomePage() {
  const supabase = await createClient()
  
  // Check authentication status on the server
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  const [recentDocs, categories, uncategorizedCount] = await Promise.all([
    getRecentPublishedDocuments(20, true), // Get more docs with tags for filtering
    getPublicCategoriesWithCounts(),
    getUncategorizedDocumentCount(),
  ])

  // Add "Other" category if there are uncategorized documents
  const categoriesWithOther = [...categories]
  if (uncategorizedCount > 0) {
    categoriesWithOther.push({
      id: 'uncategorized',
      name: 'Other',
      slug: 'other',
      description: 'Uncategorized documents',
      documents: [{ count: uncategorizedCount }]
    })
  }

  return (
    <DocsHomeClient 
      initialDocuments={recentDocs || []} 
      categories={categoriesWithOther || []} 
      isAuthenticated={isAuthenticated}
    />
  )
}
