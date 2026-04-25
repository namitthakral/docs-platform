"use client"

import { AlertCircle } from "lucide-react"
import { useController } from "react-hook-form"
import { contentEditorStyles } from "./content-editor.styles"
import type { ContentEditorProps } from "./content-editor.props"

export default function ContentEditor({ control }: ContentEditorProps) {
  const { field, fieldState } = useController({
    control,
    name: "content",
  })

  return (
    <div className={contentEditorStyles.formSection}>
      <label htmlFor="content" className={contentEditorStyles.inputLabel}>
        Content (Markdown)
      </label>
      <div className="relative">
        <textarea
          id="content"
          rows={20}
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
          className={
            fieldState.error
              ? contentEditorStyles.contentTextareaError
              : contentEditorStyles.contentTextarea
          }
          placeholder="# Your Document Title

Start writing your documentation here using Markdown syntax...

## Features
- Feature 1
- Feature 2

## Code Example
```javascript
console.log('Hello, World!');
```"
        />
        <div className={contentEditorStyles.characterCounter}>
          {(field.value || "").length} characters
        </div>
      </div>
      {fieldState.error && (
        <p className={contentEditorStyles.errorText}>
          <AlertCircle className={contentEditorStyles.errorIcon} />
          {fieldState.error.message}
        </p>
      )}
    </div>
  )
}