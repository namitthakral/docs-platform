"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { dropdownStyles } from "./dropdown.styles"
import type { DropdownProps } from "./dropdown.props"

export default function Dropdown({
  trigger,
  children,
  placeholder = "Select option",
  isOpen: controlledIsOpen,
  onToggle,
  disabled = false,
  className = "",
  dropdownClassName = "",
}: DropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Use controlled state if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = onToggle || setInternalIsOpen

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  // Set dropdown width to match trigger width
  useEffect(() => {
    if (isOpen && triggerRef.current && dropdownRef.current) {
      const triggerWidth = triggerRef.current.offsetWidth
      dropdownRef.current.style.width = `${triggerWidth}px`
    }
  }, [isOpen, trigger])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "Escape":
          setIsOpen(false)
          triggerRef.current?.focus()
          break
        case "Tab":
          setIsOpen(false)
          break
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, setIsOpen])

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`${dropdownStyles.container} ${className}`}
    >
      <button
        ref={triggerRef}
        onClick={handleToggle}
        disabled={disabled}
        className={`${dropdownStyles.trigger} ${
          isOpen ? dropdownStyles.triggerOpen : dropdownStyles.triggerClosed
        } ${disabled ? dropdownStyles.triggerDisabled : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={dropdownStyles.triggerContent}>
          {trigger || placeholder}
        </span>
        <span className={dropdownStyles.triggerIcon}>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`${dropdownStyles.dropdown} ${dropdownClassName}`}
          role="listbox"
        >
          <div className={dropdownStyles.dropdownContent}>{children}</div>
        </div>
      )}
    </div>
  )
}
