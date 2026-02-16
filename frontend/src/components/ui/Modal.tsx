import React from "react"

interface ModalProps {
  isOpen: boolean
  title: string
  description: string
  onClose: () => void
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl bg-(--bg-primary) p-6 text-(--text-primary) shadow-lg">
        {/* Title */}
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>

        {/* Description */}
        <p className="mb-6 text-(--text-secondary)">{description}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 font-bold">
          <button
            onClick={onClose}
            className="rounded-lg bg-(--bg-secondary) px-4 py-2 text-(--text-primary) transition hover:bg-(--bg-tertiary)"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-(--bg-warning) text-(--text-inverted) px-4 py-2 transition hover:bg-(--bg-danger)"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
