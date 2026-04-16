"use client"

import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import { MarkdownRendererProps } from './markdown-renderer.props'
import { markdownRendererStyles } from './markdown-renderer.styles'

function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        rehypeHighlight,
      ]}
      components={{
        h1: ({ children, id }) => (
          <h1 id={id} className={markdownRendererStyles.headings.h1}>
            {children}
          </h1>
        ),
        h2: ({ children, id }) => (
          <h2 id={id} className={markdownRendererStyles.headings.h2}>
            {children}
          </h2>
        ),
        h3: ({ children, id }) => (
          <h3 id={id} className={markdownRendererStyles.headings.h3}>
            {children}
          </h3>
        ),
        h4: ({ children, id }) => (
          <h4 id={id} className={markdownRendererStyles.headings.h4}>
            {children}
          </h4>
        ),
        h5: ({ children, id }) => (
          <h5 id={id} className={markdownRendererStyles.headings.h5}>
            {children}
          </h5>
        ),
        h6: ({ children, id }) => (
          <h6 id={id} className={markdownRendererStyles.headings.h6}>
            {children}
          </h6>
        ),
        p: ({ children }) => (
          <p className={markdownRendererStyles.text.paragraph}>{children}</p>
        ),
        strong: ({ children }) => (
          <strong className={markdownRendererStyles.text.strong}>{children}</strong>
        ),
        em: ({ children }) => (
          <em className={markdownRendererStyles.text.emphasis}>{children}</em>
        ),
        code: ({ children, className }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code className={markdownRendererStyles.code.inline}>
                {children}
              </code>
            )
          }
          return (
            <code className={className}>
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className={markdownRendererStyles.code.block}>
            {children}
          </pre>
        ),
        ul: ({ children }) => (
          <ul className={markdownRendererStyles.lists.unordered}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className={markdownRendererStyles.lists.ordered}>
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className={markdownRendererStyles.lists.item}>{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className={markdownRendererStyles.blockquote}>
            {children}
          </blockquote>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className={markdownRendererStyles.link}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className={markdownRendererStyles.table.container}>
            <table className={markdownRendererStyles.table.table}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className={markdownRendererStyles.table.thead}>{children}</thead>
        ),
        tbody: ({ children }) => <tbody className={markdownRendererStyles.table.tbody}>{children}</tbody>,
        tr: ({ children }) => (
          <tr className={markdownRendererStyles.table.tr}>{children}</tr>
        ),
        th: ({ children }) => (
          <th className={markdownRendererStyles.table.th}>
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className={markdownRendererStyles.table.td}>
            {children}
          </td>
        ),
        hr: () => <hr className={markdownRendererStyles.hr} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// Memoize the entire component to prevent unnecessary re-renders
export default memo(MarkdownRenderer)