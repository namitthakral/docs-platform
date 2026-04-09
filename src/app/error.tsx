"use client"

import { AlertTriangle } from "lucide-react"
import { getRoute } from "@/config/routes"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-4">
          Something went wrong!
        </h2>

        <p className="text-muted-foreground mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>

          <button
            onClick={() => (window.location.href = getRoute.home())}
            className="w-full bg-muted text-foreground px-4 py-2 rounded-md hover:bg-accent transition-colors"
          >
            Go home
          </button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto text-destructive">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
