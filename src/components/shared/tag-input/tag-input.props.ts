import type { Tag } from '@/types/tag'

export interface TagInputProps {
  onTagCreate: (name: string) => Promise<Tag | null>
  onTagSelect: (tag: Tag) => void
  placeholder?: string
  disabled?: boolean
}