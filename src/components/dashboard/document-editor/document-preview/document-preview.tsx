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
                <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-6">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-5">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
                  {children}
                </h4>
              ),
              h5: ({ children }) => (
                <h5 className="text-base font-semibold text-gray-900 mb-2 mt-3">
                  {children}
                </h5>
              ),
              h6: ({ children }) => (
                <h6 className="text-sm font-semibold text-gray-900 mb-2 mt-3">
                  {children}
                </h6>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-700">{children}</em>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
                  {children}
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-700">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <table className="min-w-full border border-gray-300 mb-4">
                  {children}
                </table>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-50">{children}</thead>
              ),
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => (
                <tr className="border-b border-gray-200">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 text-left font-semibold text-gray-900">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 text-gray-700">{children}</td>
              ),
              hr: () => <hr className="border-gray-300 my-6" />,
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
