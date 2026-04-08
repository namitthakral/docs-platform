"use client"

import { useState } from "react"
import UnifiedNavigation from "@/components/shared/unified-navigation/unified-navigation"
import DocsHeader from "../docs-header/docs-header"
import { DocsLayoutProps } from "./docs-layout.props"
import { docsLayoutStyles } from "./docs-layout.styles"

export default function DocsLayoutClient({
  children,
  categories,
  user,
}: DocsLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={docsLayoutStyles.container}>
      <DocsHeader
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <UnifiedNavigation
          variant="docs"
          dynamicConfig={{
            categories,
            fetchDocuments: true,
            showCounts: true,
            expandable: true
          }}
          user={user}
          showUserSection={true}
          isMobile={true}
          onNavigate={() => setMobileMenuOpen(false)}
          title="Documentation"
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={docsLayoutStyles.mainLayout}>
        <UnifiedNavigation
          variant="docs"
          dynamicConfig={{
            categories,
            fetchDocuments: true,
            showCounts: true,
            expandable: true
          }}
          user={user}
          showUserSection={true}
          isMobile={false}
        />
        <main className={docsLayoutStyles.mainContent}>{children}</main>
      </div>
    </div>
  )
}
