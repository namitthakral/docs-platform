export const docsLayoutStyles = {
  container: "min-h-screen bg-background",
  mobileOverlay: {
    container: "fixed inset-0 z-50 md:hidden",
    backdrop: "fixed inset-0 bg-black/50",
    sidebar: "fixed left-0 top-0 h-full w-64 bg-card shadow-lg border-r border-border overflow-y-auto"
  },
  mobileHeader: {
    container: "p-3 border-b border-border",
    content: "flex items-center justify-between",
    title: "text-lg font-semibold text-foreground",
    closeButton: "p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md",
    closeIcon: "w-5 h-5"
  },
  mobileNavContainer: "p-2",
  mainLayout: "flex h-[calc(100vh-4rem)]",
  mainContent: "flex-1 p-4 md:p-6 lg:p-8 bg-card lg:m-4 lg:rounded-lg lg:shadow-sm lg:border lg:border-border overflow-auto"
}