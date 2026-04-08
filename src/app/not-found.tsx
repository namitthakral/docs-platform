import Link from "next/link"
import { FileX } from "lucide-react"
import { getRoute } from "@/config/routes"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <FileX className="mx-auto h-16 w-16 text-gray-400" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page not found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="space-y-4">
          <Link
            href={getRoute.docs()}
            className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Documentation
          </Link>

          <Link
            href={getRoute.home()}
            className="block w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
