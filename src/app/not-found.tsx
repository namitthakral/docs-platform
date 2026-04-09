import Link from "next/link"
import { FileX } from "lucide-react"
import { getRoute } from "@/config/routes"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
          <FileX className="mx-auto h-16 w-16 text-muted-foreground" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-4">
          Page not found
        </h2>

        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="space-y-4">
          <Link
            href={getRoute.docs()}
            className="block w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Browse Documentation
          </Link>

          <Link
            href={getRoute.home()}
            className="block w-full bg-muted text-foreground px-4 py-2 rounded-md hover:bg-accent transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
