export interface Breadcrumb {
  id: string
  name: string
  slug: string
  level: number
}

export interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[]
  currentTitle: string
}