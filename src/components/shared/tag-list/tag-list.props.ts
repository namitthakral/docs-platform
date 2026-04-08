import type { Tag } from '@/types/tag'

export interface TagListProps {
  tags: Tag[]
  onTagRemove?: (tagId: string) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}