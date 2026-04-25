import { Control } from "react-hook-form"
import { DocumentFormData } from "@/types/document-editor"

export interface ContentEditorProps {
  control: Control<DocumentFormData>
}