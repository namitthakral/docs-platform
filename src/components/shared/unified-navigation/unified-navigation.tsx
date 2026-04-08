"use client"

import { UnifiedNavigationProps } from "./unified-navigation.props"
import { MobileNavigationOverlay } from "./mobile-navigation-overlay"
import { DesktopNavigationSidebar } from "./desktop-navigation-sidebar"
import { NavigationContent } from "./navigation-content"
import { useNavigation } from "./use-navigation"

export default function UnifiedNavigation(props: UnifiedNavigationProps) {
  const {
    variant,
    isMobile = false,
    dynamicConfig,
    isOpen,
    onClose,
    title,
    className,
    styles,
    staticItems,
    user,
    showUserSection,
    onNavigate,
    isLoading
  } = props

  // Use navigation hook for dynamic content
  const navigation = useNavigation(dynamicConfig)

  // Common props for NavigationContent (only the props it expects)
  const contentProps = {
    variant,
    staticItems,
    dynamicConfig,
    user,
    showUserSection,
    onNavigate,
    isLoading,
    navigation
  }

  if (isMobile) {
    return (
      <MobileNavigationOverlay 
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        className={className}
      >
        <NavigationContent {...contentProps} />
      </MobileNavigationOverlay>
    )
  }

  return (
    <DesktopNavigationSidebar className={className}>
      <NavigationContent {...contentProps} />
    </DesktopNavigationSidebar>
  )
}