import { createClient } from '@/lib/supabase/server'
import DocsLayoutClient from '@/components/docs/docs-layout/docs-layout-client'

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Get current user (optional - docs are public but user info is helpful for editing)
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get published categories for navigation
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <DocsLayoutClient categories={categories || []} user={user}>
      {children}
    </DocsLayoutClient>
  )
}