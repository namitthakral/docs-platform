export const tagSelectorStyles = {
  // Main container
  container: 'space-y-4 w-full',
  
  // Input section
  inputSection: 'space-y-2',
  inputLabel: 'block text-sm font-medium text-gray-700',
  inputDescription: 'text-sm text-gray-600',
  
  // Error handling
  error: 'text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2 flex items-center gap-2',
  errorIcon: 'w-4 h-4 text-red-500 flex-shrink-0',
  
  // Selected tags section
  selectedSection: 'space-y-3 p-3 bg-gray-50 rounded-md border border-gray-200',
  selectedLabel: 'block text-sm font-medium text-gray-700 flex items-center justify-between',
  selectedCount: 'text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full',
  selectedEmpty: 'text-sm text-gray-500 italic',
  
  // Actions
  actions: 'flex items-center gap-2 pt-2',
  clearButton: 'text-xs text-red-600 hover:text-red-700 transition-colors cursor-pointer',
  
  // States
  states: {
    loading: 'opacity-50 pointer-events-none',
    disabled: 'opacity-50 cursor-not-allowed',
    readonly: 'bg-gray-100 border-gray-300'
  }
} as const