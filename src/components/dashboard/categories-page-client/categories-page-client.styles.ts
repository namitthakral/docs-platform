export const categoriesPageClientStyles = {
  container: "space-y-6",

  // Desktop header
  desktopHeader: "hidden md:flex items-center justify-between",
  headerContent: "",
  title: "text-2xl font-bold text-foreground",
  description: "text-muted-foreground",
  addButton:
    "inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer",
  addIcon: "w-4 h-4",

  // Mobile header
  mobileHeader: "md:hidden space-y-4",
  mobileHeaderContent: "",
  mobileAddButton:
    "w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors cursor-pointer",

  // Error state
  errorContainer: "flex flex-col items-center justify-center py-12",
  errorContent: "text-red-500 text-center",
  errorTitle: "text-lg font-medium",
  errorMessage: "text-sm text-gray-600 mt-1",

  // Empty state
  emptyContainer: "flex flex-col items-center justify-center py-12",
  emptyIcon: "w-12 h-12 text-gray-400 mb-4",
  emptyTitle: "text-lg font-medium text-gray-900 mb-2",
  emptyDescription: "text-gray-500 text-center mb-4",
  emptyButton:
    "inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors",
}
