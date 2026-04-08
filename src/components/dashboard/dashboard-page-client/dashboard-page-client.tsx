"use client"

import Link from "next/link"
import { FileText, Edit, Plus, Check, Clipboard, BarChart3 } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { dashboardPageClientStyles } from "./dashboard-page-client.styles"
import { getRoute } from "@/config/routes"
import DashboardStatsSkeleton from "@/components/dashboard/dashboard-stats-skeleton/dashboard-stats-skeleton"

export default function DashboardPageClient() {
  const { stats, isLoading, isError, error } = useDashboardStats()

  if (isError) {
    return (
      <div className={dashboardPageClientStyles.container}>
        <div className={dashboardPageClientStyles.header}>
          <h1 className={dashboardPageClientStyles.title}>Dashboard</h1>
          <p className={dashboardPageClientStyles.description}>
            Welcome to your documentation platform. Manage your content and
            track performance.
          </p>
        </div>

        <div className={dashboardPageClientStyles.error}>
          <div className={dashboardPageClientStyles.errorContent}>
            <p className={dashboardPageClientStyles.errorTitle}>
              Error loading dashboard
            </p>
            <p className={dashboardPageClientStyles.errorMessage}>
              {error?.message || "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={dashboardPageClientStyles.container}>
      <div className={dashboardPageClientStyles.header}>
        <h1 className={dashboardPageClientStyles.title}>Dashboard</h1>
        <p className={dashboardPageClientStyles.description}>
          Welcome to your documentation platform. Manage your content and track
          performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className={dashboardPageClientStyles.statsGrid}>
        <div className={dashboardPageClientStyles.statCard}>
          <div className={dashboardPageClientStyles.statCardContent}>
            <div className={dashboardPageClientStyles.statIconContainer}>
              <div
                className={`${dashboardPageClientStyles.statIconWrapper} ${dashboardPageClientStyles.totalDocsIcon}`}
              >
                <FileText className={dashboardPageClientStyles.statIcon} />
              </div>
            </div>
            <div className={dashboardPageClientStyles.statTextContainer}>
              <p className={dashboardPageClientStyles.statLabel}>
                Total Documents
              </p>
              {isLoading ? (
                <div className={dashboardPageClientStyles.skeletonValue} />
              ) : (
                <p className={dashboardPageClientStyles.statValue}>
                  {stats?.totalDocs || 0}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={dashboardPageClientStyles.statCard}>
          <div className={dashboardPageClientStyles.statCardContent}>
            <div className={dashboardPageClientStyles.statIconContainer}>
              <div
                className={`${dashboardPageClientStyles.statIconWrapper} ${dashboardPageClientStyles.publishedIcon}`}
              >
                <Check className={dashboardPageClientStyles.statIcon} />
              </div>
            </div>
            <div className={dashboardPageClientStyles.statTextContainer}>
              <p className={dashboardPageClientStyles.statLabel}>
                Published
              </p>
              {isLoading ? (
                <div className={dashboardPageClientStyles.skeletonValue} />
              ) : (
                <p className={dashboardPageClientStyles.statValue}>
                  {stats?.publishedDocs || 0}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={dashboardPageClientStyles.statCard}>
          <div className={dashboardPageClientStyles.statCardContent}>
            <div className={dashboardPageClientStyles.statIconContainer}>
              <div
                className={`${dashboardPageClientStyles.statIconWrapper} ${dashboardPageClientStyles.draftsIcon}`}
              >
                <Edit className={dashboardPageClientStyles.statIcon} />
              </div>
            </div>
            <div className={dashboardPageClientStyles.statTextContainer}>
              <p className={dashboardPageClientStyles.statLabel}>Drafts</p>
              {isLoading ? (
                <div className={dashboardPageClientStyles.skeletonValue} />
              ) : (
                <p className={dashboardPageClientStyles.statValue}>
                  {stats?.draftDocs || 0}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={dashboardPageClientStyles.quickActionsCard}>
        <div className={dashboardPageClientStyles.quickActionsContent}>
          <h2 className={dashboardPageClientStyles.quickActionsTitle}>
            Quick Actions
          </h2>
          <div className={dashboardPageClientStyles.quickActionsGrid}>
            <Link
              href={getRoute.dashboard.documentsNew()}
              className={dashboardPageClientStyles.quickActionLink}
            >
              <div
                className={dashboardPageClientStyles.quickActionIconContainer}
              >
                <div
                  className={`${dashboardPageClientStyles.quickActionIconWrapper} ${dashboardPageClientStyles.createIcon}`}
                >
                  <Plus className={dashboardPageClientStyles.quickActionIcon} />
                </div>
              </div>
              <div
                className={dashboardPageClientStyles.quickActionTextContainer}
              >
                <p className={dashboardPageClientStyles.quickActionTitle}>
                  Create New Document
                </p>
                <p className={dashboardPageClientStyles.quickActionDescription}>
                  Start writing your documentation
                </p>
              </div>
            </Link>

            <Link
              href={getRoute.dashboard.documents()}
              className={dashboardPageClientStyles.quickActionLink}
            >
              <div
                className={dashboardPageClientStyles.quickActionIconContainer}
              >
                <div
                  className={`${dashboardPageClientStyles.quickActionIconWrapper} ${dashboardPageClientStyles.manageIcon}`}
                >
                  <Clipboard
                    className={dashboardPageClientStyles.quickActionIcon}
                  />
                </div>
              </div>
              <div
                className={dashboardPageClientStyles.quickActionTextContainer}
              >
                <p className={dashboardPageClientStyles.quickActionTitle}>
                  Manage Documents
                </p>
                <p className={dashboardPageClientStyles.quickActionDescription}>
                  Edit, publish, and organize content
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
