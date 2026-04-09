"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { documentPreviewStyles } from "./document-preview.styles"
import type { DocumentPreviewProps } from "./document-preview.props"

export default function DocumentPreview({ formData }: DocumentPreviewProps) {
  return (
    <div className={documentPreviewStyles.previewContainer}>
      <div className={documentPreviewStyles.previewHeader}>
        <h1 className={documentPreviewStyles.previewTitle}>
          {formData.title || "Untitled Document"}
        </h1>
        {formData.description && (
          <p className={documentPreviewStyles.previewDescription}>
            {formData.description}
          </p>
        )}
      </div>
      <div className={documentPreviewStyles.previewContent}>
        <div className="markdown-preview">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-foreground mb-6 mt-8 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-foreground mb-4 mt-6">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-foreground mb-3 mt-5">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-semibold text-foreground mb-2 mt-4">
                  {children}
                </h4>
              ),
              h5: ({ children }) => (
                <h5 className="text-base font-semibold text-foreground mb-2 mt-3">
                  {children}
                </h5>
              ),
              h6: ({ children }) => (
                <h6 className="text-sm font-semibold text-foreground mb-2 mt-3">
                  {children}
                </h6>
              ),
              p: ({ children }) => (
                <p className="text-foreground/80 mb-4 leading-relaxed">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-foreground/80">{children}</em>
              ),
              code: ({ children }) => (
                <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted text-foreground p-4 rounded-lg mb-4 overflow-x-auto border border-border">
                  {children}
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 text-foreground/80 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 text-foreground/80 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-foreground/80">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4 bg-primary/5 py-2 rounded-r">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-primary hover:text-primary/80 underline"
                >
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <table className="min-w-full border border-border mb-4">
                  {children}
                </table>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted">{children}</thead>
              ),
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => (
                <tr className="border-b border-border">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 text-left font-semibold text-foreground border-r border-border last:border-r-0">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 text-foreground/80 border-r border-border last:border-r-0">{children}</td>
              ),
              hr: () => <hr className="border-border my-6" />,
            }}
          >
            {formData.content ||
              "*No content yet... Switch to edit mode to start writing.*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
