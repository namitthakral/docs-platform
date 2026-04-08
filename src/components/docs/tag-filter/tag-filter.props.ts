import type { Tag } from '@/types/tag'

export interface TagFilterProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
}