import SyncLoader from "react-spinners/SyncLoader"

type LoadingOverlayProps = {
  size?: number
  color?: string
  loader?: React.ComponentType<{ size?: number; color?: string }>
}

export function LoadingOverlay({
  size = 8,
  color = "var(--accent-primary)",
  loader: Loader = SyncLoader,
}: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <Loader size={size} color={color} />
    </div>
  )
}
