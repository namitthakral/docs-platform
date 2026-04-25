"use client"

import { useController } from "react-hook-form"
import TagSelector from "@/components/shared/tag-selector/tag-selector"
import { tagsInputStyles } from "./tags-input.styles"
import type { TagsInputProps } from "./tags-input.props"

export default function TagsInput({ control }: TagsInputProps) {
  const { field } = useController({
    control,
    name: "tags",
  })

  return (
    <div className={tagsInputStyles.formSection}>
      <label className={tagsInputStyles.inputLabel}>Tags</label>
      <p className={tagsInputStyles.inputDescription}>
        Add tags to help organize and categorize your content
      </p>
      <TagSelector
        selectedTags={field.value || []}
        onTagsChange={field.onChange}
        placeholder="Search or create tags..."
      />
    </div>
  )
}