export const tableSkeletonStyles = {
  container: 'overflow-x-auto',
  table: 'w-full border-collapse',
  thead: '',
  th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200',
  headerSkeleton: 'h-4 bg-gray-200 rounded animate-pulse w-20',
  tbody: '',
  tr: 'border-b border-gray-100',
  td: 'px-6 py-4 whitespace-nowrap',
  cellSkeleton: 'h-4 bg-gray-200 rounded animate-pulse',
  firstColumnSkeleton: 'w-32', // Wider for titles/names
  middleColumnSkeleton: 'w-24', // Medium width for status/dates
  lastColumnSkeleton: 'w-16', // Narrower for actions
}