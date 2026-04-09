import type { PublishedDocument, PublicCategoryWithDocumentCount } from "@/types/public"

export interface DocsHomeClientProps {
  initialDocuments: PublishedDocument[]
  categories: PublicCategoryWithDocumentCount[]
  isAuthenticated: boolean
}