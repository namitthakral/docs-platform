import { Control } from "react-hook-form"
import { DocumentFormData } from "@/types/document-editor"

export interface DocumentSidebarProps {
  control: Control<DocumentFormData>
}