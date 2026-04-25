"use client"

import { AlertCircle } from "lucide-react"
import { useController } from "react-hook-form"
import { titleInputStyles } from "./title-input.styles"
import type { TitleInputProps } from "./title-input.props"

export default function TitleInput({ control }: TitleInputProps) {
  const { field, fieldState } = useController({
    control,
    name: "title",
  })

  return (
    <div className={titleInputStyles.formSection}>
      <label htmlFor="title" className={titleInputStyles.inputLabel}>
        Document Title
      </label>
      <input
        type="text"
        id="title"
        value={field.value || ""}
        onChange={(e) => field.onChange(e.target.value)}
        className={
          fieldState.error
            ? titleInputStyles.textInputError
            : titleInputStyles.textInput
        }
        placeholder="Enter a compelling title for your document..."
      />
      {fieldState.error && (
        <p className={titleInputStyles.errorText}>
          <AlertCircle className={titleInputStyles.errorIcon} />
          {fieldState.error.message}
        </p>
      )}
    </div>
  )
}