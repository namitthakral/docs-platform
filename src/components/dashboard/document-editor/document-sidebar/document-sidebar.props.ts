import { DocumentData, Category } from "../document-editor.props"

export interface DocumentSidebarProps {
  formData: DocumentData
  categories: Category[]
  onInputChange: (field: keyof DocumentData, value: string | null) => void
}