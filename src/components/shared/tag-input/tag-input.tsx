'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { useTags } from '@/hooks/use-tags'
import type { TagInputProps } from './tag-input.props'
import { tagInputStyles } from './tag-input.styles'

export default function TagInput({ 
  onTagCreate, 
  onTagSelect, 
  placeholder = 'Search or create tags...', 
  disabled = false 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { tags, isLoading } = useTags({ 
    search: inputValue.trim(),
    enabled: inputValue.trim().length > 0
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setIsOpen(value.trim().length > 0)
  }

  const handleTagSelect = (tag: any) => {
    onTagSelect(tag)
    setInputValue('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleCreateTag = async () => {
    const trimmedValue = inputValue.trim()
    if (!trimmedValue || isCreating) return

    setIsCreating(true)
    try {
      const newTag = await onTagCreate(trimmedValue)
      if (newTag) {
        onTagSelect(newTag)
        setInputValue('')
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Error creating tag:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (tags.length === 1) {
        handleTagSelect(tags[0])
      } else if (inputValue.trim() && !tags.some(tag => 
        tag.name.toLowerCase() === inputValue.trim().toLowerCase()
      )) {
        handleCreateTag()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setInputValue('')
    }
  }

  const exactMatch = tags.find(tag => 
    tag.name.toLowerCase() === inputValue.trim().toLowerCase()
  )

  const showCreateOption = inputValue.trim().length > 0 && !exactMatch && !isLoading

  return (
    <div className={tagInputStyles.container}>
      <div className={tagInputStyles.inputContainer}>
        <Search className={tagInputStyles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim() && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={tagInputStyles.input}
        />
      </div>

      {isOpen && (
        <div ref={dropdownRef} className={tagInputStyles.dropdown}>
          {isLoading && (
            <div className={tagInputStyles.loadingItem}>
              <div className={tagInputStyles.spinner} />
              <span>Searching...</span>
            </div>
          )}

          {!isLoading && tags.length === 0 && !showCreateOption && (
            <div className={tagInputStyles.emptyItem}>
              No tags found
            </div>
          )}

          {!isLoading && tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagSelect(tag)}
              className={tagInputStyles.dropdownItem}
              type="button"
            >
              <span className={tagInputStyles.tagName}>{tag.name}</span>
            </button>
          ))}

          {showCreateOption && (
            <button
              onClick={handleCreateTag}
              disabled={isCreating}
              className={tagInputStyles.createItem}
              type="button"
            >
              <Plus className={tagInputStyles.createIcon} />
              <span>
                {isCreating ? 'Creating...' : `Create "${inputValue.trim()}"`}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}