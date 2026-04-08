import { DocumentStatus } from '@/types/document'
import { Tag } from '@/types/tag'

export interface DocumentData {
  id?: string
  title: string
  slug: string
  content: string
  description: string
  status: DocumentStatus
  category_id: string | null
  tags?: Tag[]
  document_tags?: Array<{
    tags: {
      id: string
      name: string
    }
  }>
}

export interface Category {
  id: string
  name: string
}

import { DocumentEditorData } from '@/types/document'

export interface DocumentEditorProps {
  document?: DocumentEditorData
}

export interface FormErrors {
  [key: string]: string
}