"use client"

import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { Eye, Edit, ExternalLink } from "lucide-react"
import Link from "next/link"
import { DocumentStatus } from "@/types/document"
import { getRoute } from "@/config/routes"
import { documentIndicatorsStyles } from "./document-indicators.styles"
import { DocumentIndicatorsProps } from "./document-indicators.props"

export default function DocumentIndicators({
  control,
  publishedSlug,
  previewMode,
  onTogglePreview,
}: DocumentIndicatorsProps) {
  // Watch only status for published indicator
  const watchedStatus = useWatch({
    control,
    name: "status",
  })

  const isPublished = watchedStatus === DocumentStatus.PUBLISHED

  // Show published slug confirmation (temporary after publishing)
  const showPublishedConfirmation = useMemo(() => {
    return publishedSlug && isPublished
  }, [publishedSlug, isPublished])

  return (
    <div className={documentIndicatorsStyles.container}>
      {/* Published confirmation */}
      {showPublishedConfirmation && (
        <div className={documentIndicatorsStyles.publishedNotification}>
          <span>Published</span>
          <Link
            href={getRoute.docsPage(publishedSlug!)}
            target="_blank"
            rel="noopener noreferrer"
            className={documentIndicatorsStyles.viewPublishedLink}
          >
            <ExternalLink className={documentIndicatorsStyles.linkIcon} />
            <span>View</span>
          </Link>
        </div>
      )}

      {/* Preview toggle */}
      <button
        onClick={onTogglePreview}
        className={`${documentIndicatorsStyles.previewToggle} ${
          previewMode ? documentIndicatorsStyles.previewActive : ""
        }`}
        title={previewMode ? "Switch to Edit Mode" : "Switch to Preview Mode"}
      >
        {previewMode ? (
          <>
            <Edit className={documentIndicatorsStyles.previewIcon} />
            Edit
          </>
        ) : (
          <>
            <Eye className={documentIndicatorsStyles.previewIcon} />
            Preview
          </>
        )}
      </button>
    </div>
  )
}