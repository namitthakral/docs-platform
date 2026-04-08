import { Database } from './database'

// Database types
export type Tables = Database['public']['Tables']
export type Document = Tables['documents']['Row']
export type DocumentTag = Tables['document_tags']['Row']

// Insert/Update types
export type DocumentInsert = Tables['documents']['Insert']
export type DocumentUpdate = Tables['documents']['Update']

// Client-side insert type (user_id is added server-side)
export type DocumentCreateInput = Omit<DocumentInsert, 'user_id'>

// Document Status Enum and Types
export enum DocumentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published'
}

export const DOCUMENT_STATUS = {
  DRAFT: 'draft' as const,
  PUBLISHED: 'published' as const
} as const

export type DocumentStatusType = typeof DOCUMENT_STATUS[keyof typeof DOCUMENT_STATUS]

// Legacy type for backward compatibility
export type DocumentStatusLegacy = 'draft' | 'published'

// =============================================================================
// RELATIONSHIP TYPES - Reusable reference types for joined data
// =============================================================================
export type TagReference = { id: string; name: string }
export type CategoryReference = { id: string; name: string; slug: string }
export type DocumentTagsRelation = Array<{ tags: TagReference }>

// =============================================================================
// RAW QUERY RESULT TYPES - What Supabase returns (string status, nullable fields)
// =============================================================================
// Shared base for all raw document queries
type RawDocumentBase = Pick<Document, 'id' | 'title' | 'slug'> & {
  status: string // Raw string from database
}

export type RawDocumentTableRow = RawDocumentBase &
  Pick<Document, 'created_at' | 'updated_at' | 'published_at'> & {
    categories: CategoryReference | null
  }

export type RawDocumentEditorData = RawDocumentBase &
  Pick<Document, 'content' | 'category_id' | 'created_at' | 'updated_at' | 'published_at'> & {
    description: string | null
    document_tags: DocumentTagsRelation | null
  }

// =============================================================================
// COMPONENT-READY TYPES - Transformed for UI components
// =============================================================================
export type DocumentTableRow = Omit<RawDocumentTableRow, 'status'> & {
  status: DocumentStatus
}

export type DocumentEditorData = Omit<RawDocumentEditorData, 'status' | 'description' | 'document_tags'> & 
  Pick<Document, 'created_at' | 'updated_at' | 'published_at'> & {
  status: DocumentStatus
  description: string // Non-null for component compatibility
  document_tags?: DocumentTagsRelation // Optional for component
}

// Extended types with relationships
export type DocumentWithTags = Document & {
  document_tags: (DocumentTag & {
    tags: TagReference
  })[]
}

export type DocumentWithCategory = Document & {
  categories?: CategoryReference | null
}

export type DocumentWithCategoryAndTags = Document & {
  categories?: CategoryReference | null
  document_tags?: Array<{
    tags: TagReference
  }>
}