import { DocumentStatus } from '@/types/document'
import { Tag } from '@/types/tag'

/**
 * Document Type Definitions
 * 
 * DocumentFormData: Clean form structure for editing/creating documents
 * - Used in forms, components, and UI interactions
 * - Contains only editable fields
 * 
 * DocumentData: Complete document with API metadata  
 * - Used for API responses that include database relationships
 * - Extends DocumentFormData with additional metadata
 */

// Form data - used for editing/creating documents
export interface DocumentFormData {
  title: string
  slug: string
  content: string
  description: string
  status: DocumentStatus
  category_id: string | null
  tags?: Tag[]  // Direct tag array for form usage
}

// API response data - includes database relationships and metadata
export interface DocumentData extends DocumentFormData {
  id?: string
  document_tags?: Array<{  // Many-to-many relationship from database
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
