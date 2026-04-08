export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          sort_order: number
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          sort_order?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          sort_order?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          description: string | null
          category_id: string | null
          status: 'draft' | 'published'
          user_id: string
          version: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string
          description?: string | null
          category_id?: string | null
          status?: 'draft' | 'published'
          user_id: string
          version?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          description?: string | null
          category_id?: string | null
          status?: 'draft' | 'published'
          user_id?: string
          version?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      document_tags: {
        Row: {
          document_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          document_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          document_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      document_versions: {
        Row: {
          id: string
          document_id: string
          title: string
          content: string
          description: string | null
          version: number
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          document_id: string
          title: string
          content: string
          description?: string | null
          version: number
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          document_id?: string
          title?: string
          content?: string
          description?: string | null
          version?: number
          created_at?: string
          created_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_documents: {
        Args: {
          search_query: string
        }
        Returns: {
          id: string
          title: string
          slug: string
          description: string | null
          snippet: string
          category_name: string | null
          category_slug: string | null
          relevance: number
        }[]
      }
      get_category_breadcrumbs: {
        Args: {
          category_uuid: string
        }
        Returns: {
          id: string
          name: string
          slug: string
          level: number
        }[]
      }
      create_document_version: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_published_at: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      document_status: 'draft' | 'published'
    }
  }
}