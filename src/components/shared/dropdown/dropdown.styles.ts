export const dropdownStyles = {
  // Container - relative positioning for dropdown
  container: 'relative',
  
  // Trigger button
  trigger: 'w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  triggerClosed: 'hover:bg-gray-100 hover:border-gray-300',
  triggerOpen: 'bg-white border-gray-300 shadow-sm',
  triggerDisabled: 'opacity-50 cursor-not-allowed hover:bg-gray-50 hover:border-gray-200',
  
  // Trigger content
  triggerContent: 'flex items-center gap-2 text-left text-gray-700',
  triggerIcon: 'flex-shrink-0 text-gray-400 pl-2',
  
  // Dropdown
  dropdown: 'absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50',
  dropdownContent: 'max-h-48 overflow-y-auto py-1',
  
  // Option styles (to be used by children)
  option: 'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-gray-50',
  optionDefault: 'text-gray-900 hover:bg-gray-50',
  optionSelected: 'text-blue-700 bg-blue-50 hover:bg-blue-100',
  optionDisabled: 'text-gray-400 cursor-not-allowed hover:bg-white',
  
  // Checkmark for selected options
  checkmark: 'text-blue-600 font-semibold',
  
  // Empty state
  emptyState: 'px-3 py-2 text-sm text-gray-500',
} as const