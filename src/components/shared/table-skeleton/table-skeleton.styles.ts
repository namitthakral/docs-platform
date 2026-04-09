export const tableSkeletonStyles = {
  container: 'overflow-x-auto',
  table: 'w-full border-collapse',
  thead: '',
  th: 'px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border',
  headerSkeleton: 'h-4 bg-muted rounded animate-pulse w-20',
  tbody: '',
  tr: 'border-b border-border',
  td: 'px-6 py-4 whitespace-nowrap',
  cellSkeleton: 'h-4 bg-muted rounded animate-pulse',
  firstColumnSkeleton: 'w-32', // Wider for titles/names
  middleColumnSkeleton: 'w-24', // Medium width for status/dates
  lastColumnSkeleton: 'w-16', // Narrower for actions
}