export const docsLayoutStyles = {
  container: "min-h-screen bg-gray-50",
  mobileOverlay: {
    container: "fixed inset-0 z-50 md:hidden",
    backdrop: "fixed inset-0 bg-gray-500 opacity-50",
    sidebar: "fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto"
  },
  mobileHeader: {
    container: "p-3 border-b border-gray-200",
    content: "flex items-center justify-between",
    title: "text-lg font-semibold text-gray-900",
    closeButton: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md",
    closeIcon: "w-5 h-5"
  },
  mobileNavContainer: "p-2",
  mainLayout: "flex h-[calc(100vh-4rem)]",
  mainContent: "flex-1 p-4 md:p-6 lg:p-8 bg-white lg:m-4 lg:rounded-lg lg:shadow-sm lg:border lg:border-gray-200 overflow-auto"
}