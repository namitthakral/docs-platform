import { Metadata } from 'next'
import { Plus } from 'lucide-react'
import TagManagerClient from '@/components/dashboard/tag-manager/tag-manager-client'

export const metadata: Metadata = {
  title: 'Tag Management - Documentation Platform',
  description: 'Manage tags for organizing your documentation content',
}

export default function TagManagementPage() {
  return (
    <TagManagerClient />
  )
}