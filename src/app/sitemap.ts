import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { MetadataRoute } from 'next'

type DocumentSitemapEntry = {
  slug: string
  updated_at: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  try {
    // Use public client for sitemap generation (no cookies needed)
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    )
    
    // Get all published documents
    const { data: documents, error } = await supabase
      .from('documents')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (error || !documents) {
      console.error('Error fetching documents for sitemap:', error)
      return staticPages
    }

    // Dynamic documentation pages
    const documentPages: MetadataRoute.Sitemap = (documents as DocumentSitemapEntry[]).map((doc) => ({
      url: `${baseUrl}/docs/${doc.slug}`,
      lastModified: new Date(doc.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...documentPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}