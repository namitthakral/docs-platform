// Dashboard Header Component Styles
export const dashboardHeaderStyles = {
  // Container styles - Mobile responsive
  header: "bg-card border-b border-border",
  container: "px-4 md:px-6 lg:px-8 py-3 md:py-4 shadow-sm",
  content: "flex items-center justify-between",

  // Left side styles
  leftSection: "flex items-center space-x-2 md:space-x-4",
  logo: "text-lg md:text-xl font-bold text-foreground truncate",
  dashboardBadge:
    "hidden sm:inline text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full",

  // Right side styles
  rightSection: "flex items-center space-x-2 md:space-x-4",
  publicDocsLink: "flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors",
  publicDocsIcon: "w-4 h-4 mr-1",
  publicDocsText: "hidden lg:inline",
  userSection: "flex items-center space-x-2",
  userEmail: "text-sm text-foreground/80",
  signOutButton: "text-sm text-muted-foreground hover:text-foreground",
  
  // Mobile menu button
  mobileMenuButton: "md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md",
  mobileMenuIcon: "w-5 h-5",
  
  // Search button
  searchButton: "flex items-center space-x-2 px-2 md:px-3 py-2 text-sm text-muted-foreground bg-muted rounded-md hover:bg-accent transition-colors cursor-pointer",
  searchIcon: "w-4 h-4",
  searchText: "hidden sm:inline",
  searchKbd: "hidden lg:inline-block px-2 py-1 text-xs bg-card border border-border rounded",
}
