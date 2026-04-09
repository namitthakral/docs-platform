export const dashboardPageClientStyles = {
  container: "space-y-8",
  
  // Header
  header: "space-y-2",
  title: "text-3xl font-bold text-foreground",
  description: "text-muted-foreground",
  
  // Stats Grid
  statsGrid: "grid grid-cols-1 md:grid-cols-3 gap-6",
  statCard: "bg-card p-6 rounded-lg shadow border border-border",
  statCardContent: "flex items-center",
  statIconContainer: "shrink-0",
  statIconWrapper: "w-8 h-8 rounded-md flex items-center justify-center",
  statIcon: "w-5 h-5",
  statTextContainer: "ml-4",
  statLabel: "text-sm font-medium text-muted-foreground",
  statValue: "text-2xl font-semibold text-foreground",
  
  // Icon colors
  totalDocsIcon: "bg-primary/10 text-primary",
  publishedIcon: "bg-green-500/10 text-green-400", 
  draftsIcon: "bg-yellow-500/10 text-yellow-400",
  
  // Quick Actions
  quickActionsCard: "bg-card rounded-lg shadow border border-border",
  quickActionsContent: "p-6",
  quickActionsTitle: "text-lg font-medium text-foreground mb-4",
  quickActionsGrid: "grid grid-cols-1 md:grid-cols-2 gap-4",
  quickActionLink: "flex items-center p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors",
  quickActionIconContainer: "shrink-0",
  quickActionIconWrapper: "w-8 h-8 rounded-md flex items-center justify-center",
  quickActionIcon: "w-5 h-5",
  quickActionTextContainer: "ml-4",
  quickActionTitle: "text-sm font-medium text-foreground",
  quickActionDescription: "text-sm text-muted-foreground",
  
  // Quick action icon colors
  createIcon: "bg-primary/10 text-primary",
  manageIcon: "bg-green-500/10 text-green-400",
  
  // Loading states
  loading: "flex flex-col items-center justify-center py-12",
  loadingContent: "flex items-center gap-3",
  spinner: "w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin",
  loadingText: "text-muted-foreground",
  skeletonValue: "h-8 bg-muted rounded w-16 animate-pulse",
  
  // Error states
  error: "flex flex-col items-center justify-center py-12",
  errorContent: "text-destructive text-center",
  errorTitle: "text-lg font-medium",
  errorMessage: "text-sm text-muted-foreground mt-1",
} as const