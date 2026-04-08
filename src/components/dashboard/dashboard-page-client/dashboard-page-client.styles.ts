export const dashboardPageClientStyles = {
  container: "space-y-8",
  
  // Header
  header: "space-y-2",
  title: "text-3xl font-bold text-gray-900",
  description: "text-gray-600",
  
  // Stats Grid
  statsGrid: "grid grid-cols-1 md:grid-cols-3 gap-6",
  statCard: "bg-white p-6 rounded-lg shadow",
  statCardContent: "flex items-center",
  statIconContainer: "shrink-0",
  statIconWrapper: "w-8 h-8 rounded-md flex items-center justify-center",
  statIcon: "w-5 h-5",
  statTextContainer: "ml-4",
  statLabel: "text-sm font-medium text-gray-500",
  statValue: "text-2xl font-semibold text-gray-900",
  
  // Icon colors
  totalDocsIcon: "bg-blue-100 text-blue-600",
  publishedIcon: "bg-green-100 text-green-600", 
  draftsIcon: "bg-yellow-100 text-yellow-600",
  
  // Quick Actions
  quickActionsCard: "bg-white rounded-lg shadow",
  quickActionsContent: "p-6",
  quickActionsTitle: "text-lg font-medium text-gray-900 mb-4",
  quickActionsGrid: "grid grid-cols-1 md:grid-cols-2 gap-4",
  quickActionLink: "flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors",
  quickActionIconContainer: "shrink-0",
  quickActionIconWrapper: "w-8 h-8 rounded-md flex items-center justify-center",
  quickActionIcon: "w-5 h-5",
  quickActionTextContainer: "ml-4",
  quickActionTitle: "text-sm font-medium text-gray-900",
  quickActionDescription: "text-sm text-gray-500",
  
  // Quick action icon colors
  createIcon: "bg-blue-100 text-blue-600",
  manageIcon: "bg-green-100 text-green-600",
  
  // Loading states
  loading: "flex flex-col items-center justify-center py-12",
  loadingContent: "flex items-center gap-3",
  spinner: "w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin",
  loadingText: "text-gray-600",
  skeletonValue: "h-8 bg-gray-200 rounded w-16 animate-pulse",
  
  // Error states
  error: "flex flex-col items-center justify-center py-12",
  errorContent: "text-red-500 text-center",
  errorTitle: "text-lg font-medium",
  errorMessage: "text-sm text-gray-600 mt-1",
} as const