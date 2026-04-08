"use client"

import { Info, ExternalLink } from "lucide-react"
import { markdownHelpStyles } from "./markdown-help.styles"

export default function MarkdownHelp() {
  return (
    <div className={markdownHelpStyles.helpContainer}>
      <div className={markdownHelpStyles.helpHeader}>
        <Info className={markdownHelpStyles.helpIcon} />
        <h3 className={markdownHelpStyles.helpTitle}>Markdown Guide</h3>
      </div>
      <div className={markdownHelpStyles.helpContent}>
        <div className={markdownHelpStyles.helpItem}>
          <span className={markdownHelpStyles.helpLabel}>Headers:</span>
          <code className={markdownHelpStyles.helpCode}># ## ###</code>
        </div>
        <div className={markdownHelpStyles.helpItem}>
          <span className={markdownHelpStyles.helpLabel}>Bold:</span>
          <code className={markdownHelpStyles.helpCode}>**text**</code>
        </div>
        <div className={markdownHelpStyles.helpItem}>
          <span className={markdownHelpStyles.helpLabel}>Italic:</span>
          <code className={markdownHelpStyles.helpCode}>*text*</code>
        </div>
        <div className={markdownHelpStyles.helpItem}>
          <span className={markdownHelpStyles.helpLabel}>Code:</span>
          <code className={markdownHelpStyles.helpCode}>`code`</code>
        </div>
        <div className={markdownHelpStyles.helpItem}>
          <span className={markdownHelpStyles.helpLabel}>Link:</span>
          <code className={markdownHelpStyles.helpCode}>[text](url)</code>
        </div>
        <div className={markdownHelpStyles.helpItem}>
          <span className={markdownHelpStyles.helpLabel}>List:</span>
          <code className={markdownHelpStyles.helpCode}>- item</code>
        </div>
      </div>
      <div className={markdownHelpStyles.helpFooter}>
        <a
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
          rel="noopener noreferrer"
          className={markdownHelpStyles.helpLink}
        >
          <span>View full Markdown guide</span>
          <ExternalLink className={markdownHelpStyles.helpLinkIcon} />
        </a>
      </div>
    </div>
  )
}