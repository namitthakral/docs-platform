"use client"

import { useEffect } from "react"
import { AlertTriangle, Info } from "lucide-react"
import type { ConfirmationDialogProps } from './confirmation-dialog.props'
import { confirmationDialogStyles } from './confirmation-dialog.styles'

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationDialogProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      // Prevent body scroll
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose, isLoading])

  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertTriangle className={confirmationDialogStyles.dangerIcon} />,
          confirmButton: confirmationDialogStyles.dangerButtonStyle,
          iconBg: confirmationDialogStyles.iconContainerDanger,
        }
      case "warning":
        return {
          icon: <AlertTriangle className={confirmationDialogStyles.warningIcon} />,
          confirmButton: confirmationDialogStyles.warningButtonStyle,
          iconBg: confirmationDialogStyles.iconContainerWarning,
        }
      default:
        return {
          icon: <Info className={confirmationDialogStyles.infoIcon} />,
          confirmButton: confirmationDialogStyles.infoButtonStyle,
          iconBg: confirmationDialogStyles.iconContainerInfo,
        }
    }
  }

  const styles = getVariantStyles()

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <div className={confirmationDialogStyles.overlay}>
      {/* Backdrop */}
      <div
        className={confirmationDialogStyles.backdrop}
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className={confirmationDialogStyles.container}>
        <div className={confirmationDialogStyles.modal}>
          <div className={confirmationDialogStyles.contentContainer}>
            {/* Icon */}
            <div className={confirmationDialogStyles.iconWrapperContainer}>
              <div
                className={`${confirmationDialogStyles.iconWrapper} ${styles.iconBg}`}
              >
                {styles.icon}
              </div>
            </div>

            {/* Title and Message */}
            <div className={confirmationDialogStyles.textCenter}>
              <h3 className={confirmationDialogStyles.title}>
                {title}
              </h3>
              <p className={confirmationDialogStyles.message}>
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className={confirmationDialogStyles.actions}>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className={confirmationDialogStyles.cancelButton}
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className={`${confirmationDialogStyles.confirmButton} ${styles.confirmButton}`}
              >
                {isLoading && (
                  <div className={confirmationDialogStyles.spinner} />
                )}
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
