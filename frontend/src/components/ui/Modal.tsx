import React, { useState, useEffect } from "react"
import { Button } from "./Button"
import type { ButtonVariant } from "./Button"
import SyncLoader from "react-spinners/SyncLoader"
import { useTranslation } from "react-i18next"

interface ModalProps {
  isOpen: boolean
  title: string
  description: string
  onClose: () => void
  onConfirm?: () => Promise<void> | void
  confirmText?: string
  cancelText?: string
  confirmVariant?: ButtonVariant
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  confirmText = "general.confirm",
  cancelText = "general.cancel",
  confirmVariant = "primary",
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (!onConfirm) return
    try {
      setIsLoading(true)
      await onConfirm()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-xl bg-(--bg-primary) p-6 text-(--text-primary) shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>

        {/* Description */}
        <p className="mb-6 text-(--text-secondary)">{description}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 font-semibold">
          <Button variant="tertiary" onClick={onClose} disabled={isLoading} className="px-4 py-2">
            {t(cancelText)}
          </Button>

          {onConfirm && (
            <Button variant={confirmVariant} onClick={handleConfirm} disabled={isLoading} className={`px-4 py-2`}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-1 text-center">
                  <a>Processing</a>
                  <SyncLoader size={3} color="var(--text-primary)" />
                </div>
              ) : (
                t(confirmText)
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
