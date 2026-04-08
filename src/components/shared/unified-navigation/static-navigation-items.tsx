"use client"

import Link from "next/link"
import { cn } from "@/lib/helpers"
import { routeUtils } from "@/config/routes"
import { StaticNavigationItem } from "./unified-navigation.props"
import { unifiedNavigationStyles } from "./unified-navigation.styles"

interface StaticNavigationItemsProps {
  items: StaticNavigationItem[]
  pathname: string
  onNavigate?: () => void
  styles: typeof unifiedNavigationStyles
}

export function StaticNavigationItems({
  items,
  pathname,
  onNavigate,
  styles
}: StaticNavigationItemsProps) {
  return (
    <nav>
      <ul className={styles.desktop.navList}>
        {items.map((item) => {
          const isActive = routeUtils.isActive(pathname, item.href)
          const isDisabled = item.disabled

          return (
            <li key={item.id} className={styles.desktop.navItem}>
              <Link
                href={isDisabled ? "#" : item.href}
                onClick={isDisabled ? (e) => e.preventDefault() : onNavigate}
                className={cn(
                  styles.navLink.base,
                  isActive && !isDisabled
                    ? styles.navLink.active
                    : isDisabled
                    ? styles.navLink.disabled
                    : styles.navLink.inactive
                )}
              >
                {item.icon && (
                  <span className={styles.navIcon}>
                    {item.icon}
                  </span>
                )}
                <span className={styles.navText}>
                  {item.name}
                </span>
                {item.badge && (
                  <span className={styles.navBadge}>
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}