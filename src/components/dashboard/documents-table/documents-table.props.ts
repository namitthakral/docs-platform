import { DocumentStatus } from '@/types/document'

export interface Document {
  id: string
  title: string
  slug: string
  status: DocumentStatus
  user_id: string
  created_at: string
  updated_at: string
  published_at: string | null
  categories?: {
    id: string
    name: string
  } | null
}

export interface DocumentsTableProps {
  documents: Document[]
}