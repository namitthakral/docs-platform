export const confirmationDialogStyles = {
  // Overlay
  overlay: 'fixed inset-0 z-50 overflow-y-auto',
  backdrop: 'fixed inset-0 bg-black/50 transition-opacity',
  
  // Container
  container: 'relative flex min-h-screen items-center justify-center px-4 py-6 text-center',
  spacer: 'hidden sm:inline-block sm:h-screen sm:align-middle',
  
  // Modal
  modal: 'relative inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-card shadow-xl transition-all z-10',
  
  // Header
  header: 'flex items-center',
  iconContainer: 'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10',
  iconContainerDanger: 'bg-destructive/10',
  iconContainerWarning: 'bg-yellow-500/10',
  iconContainerInfo: 'bg-primary/10',
  icon: 'h-6 w-6',
  iconDanger: 'text-destructive',
  iconWarning: 'text-yellow-400',
  iconInfo: 'text-primary',
  
  // Content
  content: 'mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left',
  title: 'text-lg font-medium leading-6 text-foreground',
  message: 'mt-3 text-sm text-muted-foreground',
  
  // Actions
  actions: 'mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-3',
  
  // Buttons
  confirmButton: 'inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors',
  confirmButtonDanger: 'bg-destructive hover:bg-destructive/90 focus:ring-destructive',
  confirmButtonWarning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
  confirmButtonInfo: 'bg-primary hover:bg-primary/90 focus:ring-primary',
  
  cancelButton: 'inline-flex w-full justify-center rounded-md border border-border bg-card px-4 py-2 text-base font-medium text-foreground shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-auto sm:text-sm cursor-pointer transition-colors',
  
  // Loading spinner
  spinner: 'mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent',
  
  // Icon wrapper
  iconWrapper: 'flex items-center justify-center w-12 h-12 rounded-full',
  iconWrapperContainer: 'flex justify-center mb-4',
  
  // Content container
  contentContainer: 'px-6 py-6',
  textCenter: 'text-center',
  
  // Icon styles
  dangerIcon: 'w-6 h-6 text-destructive',
  warningIcon: 'w-6 h-6 text-yellow-400', 
  infoIcon: 'w-6 h-6 text-primary',
  
  // Button styles for variants
  dangerButtonStyle: 'bg-destructive hover:bg-destructive/90 focus:ring-destructive text-white',
  warningButtonStyle: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-white',
  infoButtonStyle: 'bg-primary hover:bg-primary/90 focus:ring-primary text-white'
} as const