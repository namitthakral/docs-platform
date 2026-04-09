// Categories Manager Component Styles
export const categoriesManagerStyles = {
  // Container styles
  container: "space-y-6",

  // Header styles
  header: "flex justify-between items-center",
  headerSpacer: "",
  addButton:
    "bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer",

  // Form styles
  formContainer: "bg-card border border-border rounded-lg p-6",
  formTitle: "text-lg font-medium text-foreground mb-4",
  formGrid: "space-y-4",
  formGridCols: "grid grid-cols-1 md:grid-cols-2 gap-4",

  // Input styles
  inputGroup: "",
  inputLabel: "block text-sm font-medium text-foreground mb-1",
  textInput:
    "w-full px-3 py-2 border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring bg-input",
  textarea:
    "w-full px-3 py-2 border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring bg-input",

  // Button styles
  buttonGroup: "flex justify-end space-x-3",
  cancelButton:
    "px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground bg-card hover:bg-muted cursor-pointer",
  submitButton:
    "px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed",

  // Table styles
  tableContainer: "bg-card rounded-lg border border-border overflow-x-auto",
  table: "min-w-full divide-y divide-border",
  tableHead: "bg-muted",
  tableBody: "bg-card divide-y divide-border",
  tableRow: "hover:bg-muted/50",

  // Table cell styles
  headerCell:
    "px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
  headerCellCenter:
    "px-3 md:px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider",
  headerCellRight:
    "px-3 md:px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider",
  cell: "px-3 md:px-6 py-4 whitespace-nowrap",
  cellCenter: "px-3 md:px-6 py-4 whitespace-nowrap text-center",
  cellRight:
    "px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-1 md:space-x-2",

  // Content styles
  categoryName: "text-sm font-medium text-foreground",
  categoryDescription: "text-sm text-muted-foreground",
  categorySlug: "text-sm text-muted-foreground",
  documentCount: "text-sm text-muted-foreground",

  // Action styles
  editButton:
    "inline-flex items-center justify-center w-8 h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors cursor-pointer",
  deleteButton:
    "inline-flex items-center justify-center w-8 h-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
  actionIcon: "w-4 h-4",

  // Empty state styles
  emptyContainer: "p-8 text-center",
  emptyIcon: "mx-auto h-12 w-12 text-muted-foreground",
  emptyTitle: "mt-2 text-sm font-medium text-foreground",
  emptyDescription: "mt-1 text-sm text-muted-foreground",
}
