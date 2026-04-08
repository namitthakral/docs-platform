export const confirmationDialogStyles = {
  // Overlay
  overlay: 'fixed inset-0 z-50 overflow-y-auto',
  backdrop: 'fixed inset-0 bg-black/50 transition-opacity',
  
  // Container
  container: 'relative flex min-h-screen items-center justify-center px-4 py-6 text-center',
  spacer: 'hidden sm:inline-block sm:h-screen sm:align-middle',
  
  // Modal
  modal: 'relative inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all z-10',
  
  // Header
  header: 'flex items-center',
  iconContainer: 'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10',
  iconContainerDanger: 'bg-red-100',
  iconContainerWarning: 'bg-yellow-100',
  iconContainerInfo: 'bg-blue-100',
  icon: 'h-6 w-6',
  iconDanger: 'text-red-600',
  iconWarning: 'text-yellow-600',
  iconInfo: 'text-blue-600',
  
  // Content
  content: 'mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left',
  title: 'text-lg font-medium leading-6 text-gray-900',
  message: 'mt-3 text-sm text-gray-500',
  
  // Actions
  actions: 'mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-3',
  
  // Buttons
  confirmButton: 'inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors',
  confirmButtonDanger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  confirmButtonWarning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  confirmButtonInfo: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  
  cancelButton: 'inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto sm:text-sm cursor-pointer transition-colors',
  
  // Loading spinner
  spinner: 'mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent',
  
  // Icon wrapper
  iconWrapper: 'flex items-center justify-center w-12 h-12 rounded-full',
  iconWrapperContainer: 'flex justify-center mb-4',
  
  // Content container
  contentContainer: 'px-6 py-6',
  textCenter: 'text-center',
  
  // Icon styles
  dangerIcon: 'w-6 h-6 text-red-600',
  warningIcon: 'w-6 h-6 text-yellow-600', 
  infoIcon: 'w-6 h-6 text-blue-600',
  
  // Button styles for variants
  dangerButtonStyle: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
  warningButtonStyle: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white',
  infoButtonStyle: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'
} as const