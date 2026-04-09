export const tagListStyles = {
  // Container
  container: 'flex flex-wrap gap-2',
  
  // Tag base styles
  tag: {
    base: 'inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full transition-colors hover:bg-primary/20',
    text: 'font-medium truncate select-none',
    removeButton: 'flex-shrink-0 ml-1 hover:bg-primary/30 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
    removeIcon: 'w-3 h-3',
    sizes: {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base'
    }
  },
  
  // Variants
  variants: {
    default: 'bg-primary/10 text-primary hover:bg-primary/20',
    secondary: 'bg-muted text-muted-foreground hover:bg-accent',
    success: 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20',
    danger: 'bg-destructive/10 text-destructive hover:bg-destructive/20'
  },
  
  // States
  states: {
    readonly: 'cursor-default',
    interactive: 'cursor-pointer',
    disabled: 'opacity-50 cursor-not-allowed'
  }
} as const