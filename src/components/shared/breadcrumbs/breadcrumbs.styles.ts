export const breadcrumbsStyles = {
  // Navigation container
  nav: 'flex mb-6',
  
  // Breadcrumb list
  list: 'inline-flex items-center space-x-1 md:space-x-3',
  
  // Home item
  homeItem: 'inline-flex items-center',
  homeLink: 'inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors',
  homeIcon: 'w-3 h-3 mr-2.5',
  
  // Breadcrumb items
  item: 'flex items-center',
  separator: 'w-3 h-3 text-gray-400 mx-1',
  link: 'ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 transition-colors',
  
  // Current page
  currentItem: 'flex items-center',
  currentText: 'ml-1 text-sm font-medium text-gray-500 md:ml-2',
  
  // Accessibility
  ariaLabel: 'Breadcrumb'
} as const