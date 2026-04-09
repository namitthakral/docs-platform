"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { useTags } from "@/hooks/use-tags"
import Dropdown from "@/components/shared/dropdown/dropdown"
import { dropdownStyles } from "@/components/shared/dropdown/dropdown.styles"
import type { Tag } from "@/types/tag"
import type { TagFilterProps } from "./tag-filter.props"
import { tagFilterStyles } from "./tag-filter.styles"

export default function TagFilter({
  selectedTags,
  onTagsChange,
}: TagFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { tags } = useTags({ withCounts: true })

  // For now, show all tags regardless of usage count
  const showAllTags = tags

  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some((selected) => selected.id === tag.id)

    if (isSelected) {
      onTagsChange(selectedTags.filter((selected) => selected.id !== tag.id))
    } else {
      onTagsChange([...selectedTags, tag])
    }

    // Keep dropdown open for multiple selections
  }



  // Create trigger content
  const triggerContent = (
    <>
      <Filter className="w-4 h-4" />
      <span>Filter by Tags</span>
      {selectedTags.length > 0 && (
        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
          {selectedTags.length}
        </span>
      )}
    </>
  )

  return (
    <Dropdown
      trigger={triggerContent}
      isOpen={isExpanded}
      onToggle={setIsExpanded}
      disabled={showAllTags.length === 0}
      className={tagFilterStyles.dropdownTrigger}
    >
      {showAllTags.length > 0 ? (
        showAllTags.map((tag) => {
          const isSelected = selectedTags.some(
            (selected) => selected.id === tag.id,
          )
          return (
            <button
              key={tag.id}
              onClick={() => handleTagToggle(tag)}
              className={`${dropdownStyles.option} ${
                isSelected
                  ? dropdownStyles.optionSelected
                  : dropdownStyles.optionDefault
              }`}
              title={`${isSelected ? "Remove" : "Add"} ${tag.name} filter`}
            >
              <span
                className={
                  isSelected ? "text-primary font-medium" : "text-foreground"
                }
              >
                {tag.name}
              </span>
              {isSelected && (
                <span className={dropdownStyles.checkmark}>✓</span>
              )}
            </button>
          )
        })
      ) : (
        <div className={dropdownStyles.emptyState}>No tags available</div>
      )}
    </Dropdown>
  )
}
