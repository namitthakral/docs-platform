// Unified Navigation Component Styles
export const unifiedNavigationStyles = {
  // Desktop sidebar styles
  desktop: {
    container:
      "hidden md:block w-64 bg-white shadow-sm border-r border-gray-200 overflow-y-auto shrink-0 h-full",
    nav: "p-4",
    navList: "space-y-2",
    navItem: "",
  },

  // Mobile overlay styles (using docs approach - better UX)
  mobile: {
    overlay: {
      container: "fixed inset-0 z-50 md:hidden",
      backdrop: "fixed inset-0 bg-gray-500 opacity-50",
      sidebar:
        "fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto",
    },
    header: {
      container: "p-3 border-b border-gray-200",
      content: "flex items-center justify-between",
      title: "text-lg font-semibold text-gray-900",
      closeButton:
        "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md",
      closeIcon: "w-5 h-5",
    },
    nav: "p-2",
  },

  // Navigation link styles
  navLink: {
    base: "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
    active: "bg-blue-100 text-blue-700",
    inactive: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
    disabled: "text-gray-400 cursor-not-allowed",
  },

  // Icon and text styles
  navIcon: "w-4 h-4 flex-shrink-0 mr-3",
  navText: "",
  navBadge:
    "ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",

  // Category styles (for docs navigation)
  category: {
    button: {
      base: "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
      withDocs:
        "text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer",
      withoutDocs: "text-gray-500 cursor-default",
    },
    icon: "w-4 h-4 mr-2",
    count: "ml-2 text-xs text-gray-500",
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
      active: "bg-blue-50 text-blue-700 font-medium",
      inactive: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
    },
    icon: "w-3 h-3 mr-2",
  },

  // User section styles
  userSection: {
    container: "p-4 border-t border-gray-200",
    content: "space-y-3",
    userInfo: {
      container: "flex items-center space-x-2",
      avatar:
        "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center",
      avatarIcon: "w-4 h-4 text-blue-600",
      email: "flex-1 min-w-0",
      emailText: "text-sm text-gray-900 truncate",
    },
    signOut: {
      button:
        "flex items-center space-x-2 w-full text-sm text-gray-600 hover:text-red-600 transition-colors cursor-pointer",
      icon: "w-4 h-4",
    },
  },

  // Loading states
  loading: {
    container: "p-6",
    skeleton: "animate-pulse space-y-4",
    skeletonItem: {
      large: "h-4 bg-gray-200 rounded w-3/4",
      medium: "h-4 bg-gray-200 rounded w-1/2",
      small: "h-4 bg-gray-200 rounded w-2/3",
    },
  },

  // Special link styles (like "All Documentation")
  specialLink: {
    base: "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors mb-4",
    active: "bg-blue-100 text-blue-700",
    inactive: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
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
  _customStyles?: unknown,
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
