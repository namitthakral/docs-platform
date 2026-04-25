"use client"

import { useController } from "react-hook-form"
import { descriptionInputStyles } from "./description-input.styles"
import type { DescriptionInputProps } from "./description-input.props"

export default function DescriptionInput({ control }: DescriptionInputProps) {
  const { field } = useController({
    control,
    name: "description",
  })

  return (
    <div className={descriptionInputStyles.formSection}>
      <label htmlFor="description" className={descriptionInputStyles.inputLabel}>
        Description
      </label>
      <textarea
        id="description"
        rows={3}
        value={field.value || ""}
        onChange={(e) => field.onChange(e.target.value)}
        className={descriptionInputStyles.textarea}
        placeholder="Write a brief description for SEO and document previews..."
      />
      <p className={descriptionInputStyles.helperText}>
        This description will appear in search results and document previews.
      </p>
    </div>
  )
}