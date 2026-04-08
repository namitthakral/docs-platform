"use client"

import { useState } from "react"
import UnifiedNavigation from "@/components/shared/unified-navigation/unified-navigation"
import { dashboardNavigationItems } from "@/config/dashboard-navigation"
import DashboardHeader from "../dashboard-header/dashboard-header"
import { dashboardLayoutClientStyles } from "./dashboard-layout-client.styles"
import type { DashboardLayoutClientProps } from "./dashboard-layout-client.props"

export default function DashboardLayoutClient({
  children,
  user,
}: DashboardLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={dashboardLayoutClientStyles.container}>
      <DashboardHeader 
        user={user} 
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <UnifiedNavigation
          variant="dashboard"
          staticItems={dashboardNavigationItems}
          user={user}
          showUserSection={true}
          isMobile={true}
          onNavigate={() => setMobileMenuOpen(false)}
          title="Dashboard"
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={dashboardLayoutClientStyles.contentWrapper}>
        <UnifiedNavigation
          variant="dashboard"
          staticItems={dashboardNavigationItems}
          user={user}
          showUserSection={true}
          isMobile={false}
        />
        <main className={dashboardLayoutClientStyles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}