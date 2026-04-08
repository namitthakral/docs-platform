export const tagListStyles = {
  // Container
  container: 'flex flex-wrap gap-2',
  
  // Tag base styles
  tag: {
    base: 'inline-flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full transition-colors hover:bg-blue-200',
    text: 'font-medium truncate select-none',
    removeButton: 'flex-shrink-0 ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
    removeIcon: 'w-3 h-3',
    sizes: {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base'
    }
  },
  
  // Variants
  variants: {
    default: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    danger: 'bg-red-100 text-red-800 hover:bg-red-200'
  },
  
  // States
  states: {
    readonly: 'cursor-default',
    interactive: 'cursor-pointer',
    disabled: 'opacity-50 cursor-not-allowed'
  }
} as const