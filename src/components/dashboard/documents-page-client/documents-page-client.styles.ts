export const documentsPageClientStyles = {
  container: "space-y-4",

  // Headers
  desktopHeader: "hidden md:flex items-center justify-between",
  headerContent: "",
  title: "text-2xl font-bold text-foreground",
  description: "text-muted-foreground",
  createButton:
    "inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors",
  createIcon: "w-4 h-4",

  mobileHeader: "md:hidden space-y-4",
  mobileCreateButton:
    "w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors",

  // Error state
  errorContainer: "flex flex-col items-center justify-center py-12",
  errorContent: "text-red-500 text-center",
  errorTitle: "text-lg font-medium",
  errorMessage: "text-sm text-gray-600 mt-1",

  // Empty state
  emptyContainer: "flex flex-col items-center justify-center p-12 text-center",
  emptyIcon: "w-12 h-12 text-muted-foreground mb-4",
  emptyTitle: "text-lg font-medium text-foreground mb-2",
  emptyDescription: "text-muted-foreground max-w-sm",
  emptyButton:
    "inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors",

  // Search input
  searchContainer: "relative",
  searchIconContainer:
    "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
  searchIcon: "h-5 w-5 text-gray-400",
  searchInput:
    "block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:placeholder-muted-foreground/60 focus:ring-1 focus:ring-ring focus:border-ring sm:text-sm",
  clearButton: "absolute inset-y-0 right-0 pr-3 flex items-center",
  clearIcon: "h-4 w-4 text-gray-400 hover:text-gray-600",

  // Results
  resultsText: "text-sm text-gray-600",
}
