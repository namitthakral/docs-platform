import { getDocumentById } from "@/lib/data/documents"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import DocumentEditor from "@/components/dashboard/document-editor/document-editor"
import { getRoute } from "@/config/routes"

export interface EditDocumentPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditDocumentPage({
  params,
}: EditDocumentPageProps) {
  const { id } = await params
  const document = await getDocumentById(id)

  if (!document) {
    notFound()
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href={getRoute.dashboard.documents()}
          className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          title="Back to Documents"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Documents</span>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Edit Document</h1>
        <p className="text-muted-foreground">Update your documentation content</p>
      </div>

      <DocumentEditor document={document} />
    </div>
  )
}
