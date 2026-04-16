'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { TableOfContentsProps, Heading } from './table-of-contents.props'
import { tableOfContentsStyles } from './table-of-contents.styles'

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  // Memoize heading extraction to avoid re-parsing on every render
  const headings = useMemo(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const extractedHeadings: Heading[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

      extractedHeadings.push({ id, text, level })
    }

    return extractedHeadings
  }, [content])

  useEffect(() => {
    // Track which heading is currently visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -35% 0%',
      }
    )

    // Observe all headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [headings])

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  if (headings.length === 0) {
    return null
  }

  return (
    <div className={tableOfContentsStyles.container}>
      <h3 className={tableOfContentsStyles.title}>
        Table of Contents
      </h3>
      <nav className={tableOfContentsStyles.nav}>
        <ul className={tableOfContentsStyles.list}>
          {headings.map((heading) => (
            <li key={heading.id} className={tableOfContentsStyles.listItem}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`${tableOfContentsStyles.button.base} ${
                  activeId === heading.id
                    ? tableOfContentsStyles.button.active
                    : tableOfContentsStyles.button.inactive
                }`}
                style={{
                  paddingLeft: `${(heading.level - 1) * 0.75}rem`,
                }}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}