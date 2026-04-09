// Unified Navigation Component Styles
export const unifiedNavigationStyles = {
  // Desktop sidebar styles
  desktop: {
    container:
      "hidden md:block w-64 bg-card shadow-sm border-r border-border overflow-y-auto shrink-0 h-full",
    nav: "p-4",
    navList: "space-y-2",
    navItem: "",
  },

  // Mobile overlay styles (using docs approach - better UX)
  mobile: {
    overlay: {
      container: "fixed inset-0 z-50 md:hidden",
      backdrop: "fixed inset-0 bg-black/50",
      sidebar:
        "fixed left-0 top-0 h-full w-64 bg-card shadow-lg border-r border-border overflow-y-auto",
    },
    header: {
      container: "p-3 border-b border-border",
      content: "flex items-center justify-between",
      title: "text-lg font-semibold text-foreground",
      closeButton:
        "p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md",
      closeIcon: "w-5 h-5",
    },
    nav: "p-2",
  },

  // Navigation link styles
  navLink: {
    base: "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
    active: "bg-primary/10 text-primary",
    inactive: "text-muted-foreground hover:text-foreground hover:bg-muted",
    disabled: "text-muted-foreground/50 cursor-not-allowed",
  },

  // Icon and text styles
  navIcon: "w-4 h-4 flex-shrink-0 mr-3",
  navText: "",
  navBadge:
    "ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary",

  // Category styles (for docs navigation)
  category: {
    button: {
      base: "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
      withDocs:
        "text-foreground/80 hover:text-foreground hover:bg-muted cursor-pointer",
      withoutDocs: "text-muted-foreground cursor-default",
    },
    icon: "w-4 h-4 mr-2",
    count: "ml-2 text-xs text-muted-foreground",
    expandIcon: {
      base: "w-4 h-4 transition-transform",
      expanded: "rotate-90",
    },
  },

  // Document styles (for docs navigation)
  documents: {
    list: "ml-6 mt-1 space-y-1",
    link: {
      base: "flex items-center px-3 py-1.5 text-sm rounded-md transition-colors",
      active: "bg-primary/10 text-primary font-medium",
      inactive: "text-muted-foreground hover:text-foreground hover:bg-muted",
    },
    icon: "w-3 h-3 mr-2",
  },

  // User section styles
  userSection: {
    container: "p-4 border-t border-border",
    content: "space-y-3",
    userInfo: {
      container: "flex items-center space-x-2",
      avatar:
        "w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center",
      avatarIcon: "w-4 h-4 text-primary",
      email: "flex-1 min-w-0",
      emailText: "text-sm text-foreground truncate",
    },
    signOut: {
      button:
        "flex items-center space-x-2 w-full text-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer",
      icon: "w-4 h-4",
    },
  },

  // Loading states
  loading: {
    container: "p-6",
    skeleton: "animate-pulse space-y-4",
    skeletonItem: {
      large: "h-4 bg-muted rounded w-3/4",
      medium: "h-4 bg-muted rounded w-1/2",
      small: "h-4 bg-muted rounded w-2/3",
    },
  },

  // Special link styles (like "All Documentation")
  specialLink: {
    base: "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors mb-4",
    active: "bg-primary/10 text-primary",
    inactive: "text-muted-foreground hover:text-foreground hover:bg-muted",
  },
}

// Variant-specific style overrides
export const variantStyles = {
  dashboard: {
    // Dashboard-specific overrides
    navIcon: "w-4 h-4 flex-shrink-0 mr-3",
  },
  docs: {
    // Docs-specific overrides
    navIcon: "w-4 h-4 mr-2",
  },
  custom: {
    // Custom variant can override any styles
  },
}

// Helper function to merge styles
export function mergeNavigationStyles(
  baseStyles: typeof unifiedNavigationStyles,
  variant: "dashboard" | "docs" | "custom",
): typeof unifiedNavigationStyles {
  const variantOverrides = variantStyles[variant] as Partial<typeof unifiedNavigationStyles>

  // Deep merge the variant overrides into base styles
  const mergedStyles = { ...baseStyles }

  if (variantOverrides) {
    // Merge userSection container styles specifically
    if (variantOverrides.userSection?.container) {
      mergedStyles.userSection = {
        ...mergedStyles.userSection,
        container: variantOverrides.userSection.container,
      }
    }

    // Merge navIcon if specified
    if (variantOverrides.navIcon) {
      mergedStyles.navIcon = variantOverrides.navIcon
    }
  }

  return mergedStyles
}
