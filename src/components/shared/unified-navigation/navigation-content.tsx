"use client"

import { usePathname } from "next/navigation"
import { 
  UnifiedNavigationProps, 
  UseNavigationReturn
} from "./unified-navigation.props"
import { unifiedNavigationStyles, mergeNavigationStyles } from "./unified-navigation.styles"
import { StaticNavigationItems } from "./static-navigation-items"
import { DynamicNavigationItems } from "./dynamic-navigation-items"
import { UserSection } from "./user-section"

interface NavigationContentProps extends Omit<UnifiedNavigationProps, 'isMobile' | 'styles'> {
  navigation: UseNavigationReturn
  styles?: typeof unifiedNavigationStyles
}

export function NavigationContent({
  variant,
  staticItems,
  dynamicConfig,
  user,
  showUserSection = true,
  onNavigate,
  className = "",
  styles: customStyles,
  navigation
}: NavigationContentProps) {
  const pathname = usePathname()
  const styles = mergeNavigationStyles(unifiedNavigationStyles, variant, customStyles)

  // Show loading state for dynamic navigation
  if (navigation.state.loading && variant === 'docs') {
    return (
      <div className={styles.loading.container}>
        <div className={styles.loading.skeleton}>
          <div className={styles.loading.skeletonItem.large}></div>
          <div className={styles.loading.skeletonItem.medium}></div>
          <div className={styles.loading.skeletonItem.small}></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Navigation Items - takes up available space */}
      <div className="flex-1 space-y-4">
        {/* Static Navigation Items */}
        {variant === 'dashboard' && staticItems && (
          <StaticNavigationItems
            items={staticItems}
            pathname={pathname}
            onNavigate={onNavigate}
            styles={styles}
          />
        )}

        {/* Dynamic Navigation Items */}
        {variant === 'docs' && dynamicConfig && (
          <DynamicNavigationItems
            config={dynamicConfig}
            navigation={navigation}
            pathname={pathname}
            onNavigate={onNavigate}
            styles={styles}
          />
        )}

        {/* Custom Navigation - placeholder for future implementations */}
        {variant === 'custom' && (
          <div>
            {/* Custom navigation logic can be implemented here */}
            {staticItems && (
              <StaticNavigationItems
                items={staticItems}
                pathname={pathname}
                onNavigate={onNavigate}
                styles={styles}
              />
            )}
            {dynamicConfig && (
              <DynamicNavigationItems
                config={dynamicConfig}
                navigation={navigation}
                pathname={pathname}
                onNavigate={onNavigate}
                styles={styles}
              />
            )}
          </div>
        )}
      </div>

      {/* User Section - pinned to bottom */}
      {showUserSection && user && (
        <UserSection
          user={user}
          onSignOut={navigation.actions.handleSignOut}
          styles={styles}
        />
      )}
    </div>
  )
}