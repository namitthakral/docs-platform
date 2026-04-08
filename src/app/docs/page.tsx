import {
  getRecentPublishedDocuments,
  getPublicCategoriesWithCounts,
} from "@/lib/data/public"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import DocsHomeClient from "@/components/docs/docs-home-client/docs-home-client"

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

  const [recentDocs, categories] = await Promise.all([
    getRecentPublishedDocuments(20, true), // Get more docs with tags for filtering
    getPublicCategoriesWithCounts(),
  ])

  return (
    <DocsHomeClient 
      initialDocuments={recentDocs || []} 
      categories={categories || []} 
      isAuthenticated={isAuthenticated}
    />
  )
}
