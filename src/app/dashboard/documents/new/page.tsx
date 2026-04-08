import DocumentEditor from "@/components/dashboard/document-editor/document-editor"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getRoute } from "@/config/routes"

export default function NewDocumentPage() {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-2">
          <Link
            href={getRoute.dashboard.documents()}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Back to Documents"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Documents</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Document
          </h1>
        </div>
        <p className="text-gray-600">
          Write and publish your documentation with our powerful editor
        </p>
      </div>

      <DocumentEditor />
    </div>
  )
}
