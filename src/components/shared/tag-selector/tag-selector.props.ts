import type { Tag } from '@/types/tag'

export interface TagSelectorProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  placeholder?: string
  disabled?: boolean
}