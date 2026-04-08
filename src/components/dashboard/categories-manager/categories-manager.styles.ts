// Categories Manager Component Styles
export const categoriesManagerStyles = {
  // Container styles
  container: "space-y-6",

  // Header styles
  header: "flex justify-between items-center",
  headerSpacer: "",
  addButton:
    "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer",

  // Form styles
  formContainer: "bg-white border border-gray-200 rounded-lg p-6",
  formTitle: "text-lg font-medium text-gray-900 mb-4",
  formGrid: "space-y-4",
  formGridCols: "grid grid-cols-1 md:grid-cols-2 gap-4",

  // Input styles
  inputGroup: "",
  inputLabel: "block text-sm font-medium text-gray-700 mb-1",
  textInput:
    "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
  textarea:
    "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500",

  // Button styles
  buttonGroup: "flex justify-end space-x-3",
  cancelButton:
    "px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer",
  submitButton:
    "px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed",

  // Table styles
  tableContainer: "bg-white rounded-lg border border-gray-200 overflow-x-auto",
  table: "min-w-full divide-y divide-gray-200",
  tableHead: "bg-gray-50",
  tableBody: "bg-white divide-y divide-gray-200",
  tableRow: "hover:bg-gray-50",

  // Table cell styles
  headerCell:
    "px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  headerCellCenter:
    "px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider",
  headerCellRight:
    "px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider",
  cell: "px-3 md:px-6 py-4 whitespace-nowrap",
  cellCenter: "px-3 md:px-6 py-4 whitespace-nowrap text-center",
  cellRight:
    "px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-1 md:space-x-2",

  // Content styles
  categoryName: "text-sm font-medium text-gray-900",
  categoryDescription: "text-sm text-gray-500",
  categorySlug: "text-sm text-gray-500",
  documentCount: "text-sm text-gray-500",

  // Action styles
  editButton:
    "inline-flex items-center justify-center w-8 h-8 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer",
  deleteButton:
    "inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
  actionIcon: "w-4 h-4",

  // Empty state styles
  emptyContainer: "p-8 text-center",
  emptyIcon: "mx-auto h-12 w-12 text-gray-400",
  emptyTitle: "mt-2 text-sm font-medium text-gray-900",
  emptyDescription: "mt-1 text-sm text-gray-500",
}
