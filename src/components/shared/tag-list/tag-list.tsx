'use client'

import { X } from 'lucide-react'
import type { TagListProps } from './tag-list.props'
import { tagListStyles } from './tag-list.styles'

export default function TagList({ 
  tags, 
  onTagRemove, 
  readonly = false, 
  size = 'md' 
}: TagListProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className={tagListStyles.container}>
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={`${tagListStyles.tag.base} ${tagListStyles.tag.sizes[size]}`}
        >
          <span className={tagListStyles.tag.text}>
            {tag.name}
          </span>
          {!readonly && onTagRemove && (
            <button
              onClick={() => onTagRemove(tag.id)}
              className={tagListStyles.tag.removeButton}
              type="button"
              aria-label={`Remove ${tag.name} tag`}
            >
              <X className={tagListStyles.tag.removeIcon} />
            </button>
          )}
        </span>
      ))}
    </div>
  )
}