'use client'

import { tagSkeletonStyles } from './tag-skeleton.styles'
import { TagSkeletonProps } from './tag-skeleton.props'

export default function TagSkeleton({ count = 6 }: TagSkeletonProps) {
  return (
    <div className={tagSkeletonStyles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={tagSkeletonStyles.tagItem}>
          <div className={tagSkeletonStyles.tagContent}>
            <div className={tagSkeletonStyles.tagInfo}>
              <div className={tagSkeletonStyles.tagName} />
              <div className={tagSkeletonStyles.tagUsage} />
            </div>
            <div className={tagSkeletonStyles.tagActions}>
              <div className={tagSkeletonStyles.actionButton} />
              <div className={tagSkeletonStyles.actionButton} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}