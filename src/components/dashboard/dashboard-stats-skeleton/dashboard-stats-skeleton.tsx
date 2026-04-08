"use client"

import { dashboardStatsSkeletonStyles } from "./dashboard-stats-skeleton.styles"

export default function DashboardStatsSkeleton() {
  return (
    <>
      <div className={dashboardStatsSkeletonStyles.skeletonCard}>
        <div className={dashboardStatsSkeletonStyles.skeletonContent}>
          <div className={dashboardStatsSkeletonStyles.skeletonIcon} />
          <div className={dashboardStatsSkeletonStyles.skeletonTextContainer}>
            <div className={dashboardStatsSkeletonStyles.skeletonLabel} />
            <div className={dashboardStatsSkeletonStyles.skeletonValue} />
          </div>
        </div>
      </div>
      <div className={dashboardStatsSkeletonStyles.skeletonCard}>
        <div className={dashboardStatsSkeletonStyles.skeletonContent}>
          <div className={dashboardStatsSkeletonStyles.skeletonIcon} />
          <div className={dashboardStatsSkeletonStyles.skeletonTextContainer}>
            <div className={dashboardStatsSkeletonStyles.skeletonLabel} />
            <div className={dashboardStatsSkeletonStyles.skeletonValue} />
          </div>
        </div>
      </div>
      <div className={dashboardStatsSkeletonStyles.skeletonCard}>
        <div className={dashboardStatsSkeletonStyles.skeletonContent}>
          <div className={dashboardStatsSkeletonStyles.skeletonIcon} />
          <div className={dashboardStatsSkeletonStyles.skeletonTextContainer}>
            <div className={dashboardStatsSkeletonStyles.skeletonLabel} />
            <div className={dashboardStatsSkeletonStyles.skeletonValue} />
          </div>
        </div>
      </div>
    </>
  )
}
