// Static routes
export const ROUTES = {
  HOME: '/',
  DOCS: '/docs',
  DASHBOARD: '/dashboard',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  API: {
    DOCUMENTS: '/api/documents',
    CATEGORIES: '/api/categories',
    SEARCH: '/api/search',
    TAGS: '/api/tags',
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
    },
    DASHBOARD: {
      SEARCH: '/api/dashboard/search',
    },
    NAVIGATION: {
      DOCUMENTS: '/api/navigation/documents',
    },
  }
} as const

// Dynamic route functions
export const getRoute = {
  // Public routes
  home: () => ROUTES.HOME,
  docs: () => ROUTES.DOCS,
  docsPage: (slug: string | string[]) => {
    const slugPath = Array.isArray(slug) ? slug.join('/') : slug
    return `/docs/${slugPath}`
  },
  
  // Dashboard routes (user content management)
  dashboard: {
    home: () => ROUTES.DASHBOARD,
    documents: () => `${ROUTES.DASHBOARD}/documents`,
    documentsNew: () => `${ROUTES.DASHBOARD}/documents/new`,
    document: (id: string) => `${ROUTES.DASHBOARD}/documents/${id}`,
    categories: () => `${ROUTES.DASHBOARD}/categories`,
    tags: () => `${ROUTES.DASHBOARD}/tags`,
  },
  
  // Auth routes
  auth: {
    login: (redirect?: string) => 
      `${ROUTES.AUTH.LOGIN}${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`,
    register: () => ROUTES.AUTH.REGISTER,
  },
  
  // API routes
  api: {
    documents: (id?: string) => 
      id ? `${ROUTES.API.DOCUMENTS}/${id}` : ROUTES.API.DOCUMENTS,
    categories: (id?: string) => 
      id ? `${ROUTES.API.CATEGORIES}/${id}` : ROUTES.API.CATEGORIES,
    search: (query: string, limit?: number) => 
      `${ROUTES.API.SEARCH}?q=${encodeURIComponent(query)}${limit ? `&limit=${limit}` : ''}`,
    tags: (id?: string) => 
      id ? `${ROUTES.API.TAGS}/${id}` : ROUTES.API.TAGS,
    documentTags: (documentId: string) => 
      `${ROUTES.API.DOCUMENTS}/${documentId}/tags`,
    auth: {
      login: () => ROUTES.API.AUTH.LOGIN,
      register: () => ROUTES.API.AUTH.REGISTER,
      logout: () => ROUTES.API.AUTH.LOGOUT,
    },
    dashboard: {
      search: (query: string) => 
        `${ROUTES.API.DASHBOARD.SEARCH}?q=${encodeURIComponent(query.trim())}`,
    },
    navigation: {
      documents: () => ROUTES.API.NAVIGATION.DOCUMENTS,
    },
  }
} as const

// Utility functions for common patterns
export const routeUtils = {
  // Check if current path matches route
  isActive: (currentPath: string, targetRoute: string): boolean => {
    // Exact match for dashboard (/dashboard)
    if (targetRoute === ROUTES.DASHBOARD) {
      return currentPath === ROUTES.DASHBOARD
    }
    // For other routes, use exact match or startsWith for nested routes
    return currentPath === targetRoute || 
           (targetRoute !== ROUTES.HOME && currentPath.startsWith(targetRoute + '/'))
  },
  
  // Get breadcrumb segments from slug array
  getBreadcrumbs: (slugArray: string[]) => {
    return slugArray.map((segment, index) => ({
      href: getRoute.docsPage(slugArray.slice(0, index + 1)),
      label: segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      isLast: index === slugArray.length - 1
    }))
  }
} as const