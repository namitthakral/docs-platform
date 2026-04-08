export const tagInputStyles = {
  // Container
  container: 'relative w-full',
  
  // Input container
  inputContainer: 'relative',
  searchIcon: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none',
  input: 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 transition-colors text-gray-900 bg-white',
  
  // Dropdown
  dropdown: 'absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto',
  dropdownItem: 'w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors cursor-pointer',
  tagName: 'text-sm text-gray-900 font-medium',
  tagDescription: 'text-xs text-gray-500 mt-0.5',
  
  // Create item
  createItem: 'w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors flex items-center gap-2 text-blue-600 border-t border-gray-100 cursor-pointer',
  createIcon: 'w-4 h-4 flex-shrink-0',
  createText: 'text-sm font-medium',
  
  // Loading state
  loadingItem: 'px-3 py-2 flex items-center gap-2 text-gray-500',
  spinner: 'w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin',
  loadingText: 'text-sm',
  
  // Empty state
  emptyItem: 'px-3 py-2 text-sm text-gray-500 text-center py-4',
  
  // States
  states: {
    focused: 'ring-2 ring-blue-500 border-transparent',
    error: 'border-red-300 ring-2 ring-red-500',
    disabled: 'bg-gray-100 cursor-not-allowed text-gray-500'
  }
} as const