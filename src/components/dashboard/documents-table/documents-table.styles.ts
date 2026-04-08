// Documents Table Component Styles
export const documentsTableStyles = {
  // Container styles
  container: "bg-white rounded-lg border border-gray-200 overflow-x-auto",
  emptyContainer: "bg-white rounded-lg border border-gray-200 p-8 text-center",

  // Table styles
  table: "min-w-full divide-y divide-gray-200",
  tableHead: "bg-gray-50",
  tableBody: "bg-white divide-y divide-gray-200",
  tableRow: "hover:bg-gray-50",

  // Header styles
  headerCell:
    "px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  headerCellCenter:
    "px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider",
  headerCellRight:
    "px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider",

  // Cell styles
  cell: "px-3 md:px-6 py-4 whitespace-nowrap",
  cellCenter: "px-3 md:px-6 py-4 whitespace-nowrap text-center",
  cellRight:
    "px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-1 md:space-x-2",

  // Content styles
  titleContainer: "",
  title: "text-sm font-medium text-gray-900",
  slug: "text-sm text-gray-500",

  // Category styles
  categoryBadge:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
  uncategorized: "text-sm text-gray-500",

  // Status styles
  statusButton:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
  statusPublished: "bg-green-100 text-green-800 hover:bg-green-200",
  statusDraft: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  statusLoading: "opacity-50 cursor-not-allowed",
  statusClickable: "cursor-pointer",

  // Loading indicator
  loadingSpinner:
    "w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1",

  // Action styles
  viewLink:
    "inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors cursor-pointer",
  shareButton:
    "inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors cursor-pointer",
  editLink:
    "inline-flex items-center justify-center w-8 h-8 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer",
  deleteButton:
    "inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",

  // Empty state styles
  emptyIcon: "mx-auto h-12 w-12 text-gray-400",
  emptyTitle: "mt-2 text-sm font-medium text-gray-900",
  emptyDescription: "mt-1 text-sm text-gray-500",
  emptyActions: "mt-6",
  createButton:
    "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer",

  // Time styles
  timeText: "text-sm text-gray-500",
  
  // Icon styles
  actionIcon: "w-4 h-4",
} as const

export type DocumentsTableStyleKeys = keyof typeof documentsTableStyles
