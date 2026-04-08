import { Database } from './database'

// Database types
export type Tables = Database['public']['Tables']
export type Category = Tables['categories']['Row']

// Insert/Update types
export type CategoryInsert = Tables['categories']['Insert']
export type CategoryUpdate = Tables['categories']['Update']

// Extended types with relationships
export type CategoryWithChildren = Category & {
  children?: Category[]
}

export type CategoryWithDocumentCount = Category & {
  documents?: Array<{ count: number }>
}