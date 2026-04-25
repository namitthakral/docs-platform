"use client"

import { CheckCircle } from "lucide-react"
import { saveStatusStyles } from "./save-status.styles"
import { SaveStatusProps } from "./save-status.props"

export default function SaveStatus({ saving, lastSaved, hasJustSaved }: SaveStatusProps) {
  return (
    <div className={saveStatusStyles.saveStatus}>
      <div className={saveStatusStyles.saveStatusIndicator}>
        {saving && (
          <div className={saveStatusStyles.savingIndicator}>
            <div className={saveStatusStyles.spinner} />
            <span>Saving...</span>
          </div>
        )}

        {hasJustSaved && !saving && (
          <div className={saveStatusStyles.savedIndicator}>
            <CheckCircle className={saveStatusStyles.savedIcon} />
            <span>Saved</span>
          </div>
        )}

        {lastSaved && !saving && !hasJustSaved && (
          <div className={saveStatusStyles.lastSavedIndicator}>
            <span>
              Last saved{" "}
              {lastSaved.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}