export interface UnifiedSearchModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "public" | "dashboard"
}