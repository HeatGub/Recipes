import { toast, Toaster } from "react-hot-toast"
import { Check, CircleAlert, X } from "lucide-react"

const MAX_TOAST_LEN = 200

const variantConfig = {
  success: {
    Icon: Check,
    iconColor: "text-[var(--text-success)]",
  },
  error: {
    Icon: CircleAlert,
    iconColor: "text-[var(--text-danger)]",
  },
}

type ToastVariant = "success" | "error"

export function ToasterSetup() {
  return <Toaster position="bottom-left" />
}

export const showToast = (variant: ToastVariant, msg: string) => {
  const truncated = msg.length > MAX_TOAST_LEN ? msg.slice(0, MAX_TOAST_LEN - 1) + "…" : msg

  const { Icon, iconColor } = variantConfig[variant]

  toast.custom((t) => (
    <div
      className={`flex max-w-xl rounded-lg border px-3 py-2 shadow-md transition-opacity ${
        t.visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-default)",
        color: "var(--text-primary)",
      }}
    >
      {/* Content */}
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
        <span className="wrap-break text-sm">{truncated}</span>
      </div>

      {/* Close button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="ml-3 shrink-0 text-(--text-primary) transition hover:text-(--text-inverted)"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  ))
}
