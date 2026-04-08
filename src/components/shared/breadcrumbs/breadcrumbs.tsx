import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'
import type { BreadcrumbsProps } from './breadcrumbs.props'
import { breadcrumbsStyles } from './breadcrumbs.styles'
import { getRoute } from '@/config/routes'

export default function Breadcrumbs({ breadcrumbs, currentTitle }: BreadcrumbsProps) {
  // Sort breadcrumbs by level (root first)
  const sortedBreadcrumbs = [...breadcrumbs].sort((a, b) => b.level - a.level)

  return (
    <nav className={breadcrumbsStyles.nav} aria-label={breadcrumbsStyles.ariaLabel}>
      <ol className={breadcrumbsStyles.list}>
        {/* Home */}
        <li className={breadcrumbsStyles.homeItem}>
          <Link
            href="/docs"
            className={breadcrumbsStyles.homeLink}
          >
            <Home className={breadcrumbsStyles.homeIcon} aria-hidden="true" />
            Documentation
          </Link>
        </li>

        {/* Category breadcrumbs */}
        {sortedBreadcrumbs.map((breadcrumb) => (
          <li key={breadcrumb.id}>
            <div className={breadcrumbsStyles.item}>
              <ChevronRight className={breadcrumbsStyles.separator} aria-hidden="true" />
              <Link
                href={getRoute.docsPage(`category/${breadcrumb.slug}`)}
                className={breadcrumbsStyles.link}
              >
                {breadcrumb.name}
              </Link>
            </div>
          </li>
        ))}

        {/* Current document */}
        <li aria-current="page">
          <div className={breadcrumbsStyles.currentItem}>
            <ChevronRight className={breadcrumbsStyles.separator} aria-hidden="true" />
            <span className={breadcrumbsStyles.currentText}>
              {currentTitle}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  )
}