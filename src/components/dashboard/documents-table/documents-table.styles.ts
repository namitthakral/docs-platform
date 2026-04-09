// Documents Table Component Styles
export const documentsTableStyles = {
  // Container styles
  container: "bg-card rounded-lg border border-border overflow-x-auto",
  emptyContainer: "bg-card rounded-lg border border-border p-8 text-center",

  // Table styles
  table: "min-w-full divide-y divide-border",
  tableHead: "bg-muted",
  tableBody: "bg-card divide-y divide-border",
  tableRow: "hover:bg-muted/50",

  // Header styles
  headerCell:
    "px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
  headerCellCenter:
    "px-3 md:px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider",
  headerCellRight:
    "px-3 md:px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider",

  // Cell styles
  cell: "px-3 md:px-6 py-4 whitespace-nowrap",
  cellCenter: "px-3 md:px-6 py-4 whitespace-nowrap text-center",
  cellRight:
    "px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-1 md:space-x-2",

  // Content styles
  titleContainer: "",
  title: "text-sm font-medium text-foreground",
  slug: "text-sm text-muted-foreground",

  // Category styles
  categoryBadge:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary",
  uncategorized: "text-sm text-muted-foreground",

  // Status styles
  statusButton:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
  statusPublished: "bg-green-500/10 text-green-400 hover:bg-green-500/20",
  statusDraft: "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20",
  statusLoading: "opacity-50 cursor-not-allowed",
  statusClickable: "cursor-pointer",

  // Loading indicator
  loadingSpinner:
    "w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1",

  // Action styles
  viewLink:
    "inline-flex items-center justify-center w-8 h-8 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors cursor-pointer",
  shareButton:
    "inline-flex items-center justify-center w-8 h-8 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-md transition-colors cursor-pointer",
  editLink:
    "inline-flex items-center justify-center w-8 h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors cursor-pointer",
  deleteButton:
    "inline-flex items-center justify-center w-8 h-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",

  // Empty state styles
  emptyIcon: "mx-auto h-12 w-12 text-muted-foreground",
  emptyTitle: "mt-2 text-sm font-medium text-foreground",
  emptyDescription: "mt-1 text-sm text-muted-foreground",
  emptyActions: "mt-6",
  createButton:
    "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 cursor-pointer",

  // Time styles
  timeText: "text-sm text-muted-foreground",
  
  // Icon styles
  actionIcon: "w-4 h-4",
} as const

export type DocumentsTableStyleKeys = keyof typeof documentsTableStyles
