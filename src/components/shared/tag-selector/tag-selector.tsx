'use client'

import { useState } from 'react'
import TagInput from '../tag-input/tag-input'
import TagList from '../tag-list/tag-list'
import { useCreateTag } from '@/hooks/use-tag-mutations'
import type { TagSelectorProps } from './tag-selector.props'
import { tagSelectorStyles } from './tag-selector.styles'

export default function TagSelector({ 
  selectedTags, 
  onTagsChange, 
  placeholder = 'Add tags...', 
  disabled = false 
}: TagSelectorProps) {
  const [error, setError] = useState<string | null>(null)
  const createTagMutation = useCreateTag()

  const handleTagCreate = async (name: string) => {
    try {
      setError(null)
      const newTag = await createTagMutation.mutateAsync({ name })
      return newTag
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create tag'
      setError(errorMessage)
      return null
    }
  }

  const handleTagSelect = (tag: any) => {
    // Check if tag is already selected
    if (selectedTags.some(selectedTag => selectedTag.id === tag.id)) {
      return
    }
    
    onTagsChange([...selectedTags, tag])
    setError(null)
  }

  const handleTagRemove = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId))
  }

  return (
    <div className={tagSelectorStyles.container}>
      <div className={tagSelectorStyles.inputSection}>
        <TagInput
          onTagCreate={handleTagCreate}
          onTagSelect={handleTagSelect}
          placeholder={placeholder}
          disabled={disabled}
        />
        {error && (
          <p className={tagSelectorStyles.error}>
            {error}
          </p>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className={tagSelectorStyles.selectedSection}>
          <label className={tagSelectorStyles.selectedLabel}>
            Selected Tags ({selectedTags.length})
          </label>
          <TagList
            tags={selectedTags}
            onTagRemove={handleTagRemove}
            readonly={disabled}
            size="md"
          />
        </div>
      )}
    </div>
  )
}