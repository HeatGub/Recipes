import { useEffect, useState } from "react"
import {
  Apple,
  Banana,
  Beef,
  Carrot,
  Cherry,
  Citrus,
  Cookie,
  Croissant,
  Fish,
  Hamburger,
  Ham,
  IceCreamCone,
  Nut,
  Pizza,
  Shrimp,
  Wheat,
} from "lucide-react"

type IconType = typeof Apple

interface IconItem {
  Icon: IconType
  x: number
  y: number
  size: number
  opacity: number
  blur: number
  initialRotation: number
  duration: number
  direction: 1 | -1
}

const ICONS_POOL = [
  Apple,
  Banana,
  Beef,
  Carrot,
  Cherry,
  Citrus,
  Cookie,
  Croissant,
  Fish,
  Hamburger,
  Ham,
  IceCreamCone,
  Nut,
  Pizza,
  Shrimp,
  Wheat,
]

export function Background() {
  const [icons, setIcons] = useState<IconItem[]>([])

  const MAX_ATTEMPTS = 100

  const ANIMATE = window.innerWidth > 1024

  useEffect(() => { // checks screen size once
    const placed: IconItem[] = []

    const MAX_ICONS = (() => {
      if (window.innerWidth < 640) return 10
      if (window.innerWidth < 1024) return 15
      return 20
    })()

    const MIN_SIZE = (() => {
      if (window.innerWidth < 640) return 100
      if (window.innerWidth < 1024) return 70
      return 50
    })()

    const MAX_SIZE = (() => {
      if (window.innerWidth < 640) return 200
      if (window.innerWidth < 1024) return 250
      return 300
    })()

    const PADDING = (() => {
      if (window.innerWidth < 640) return 100
      if (window.innerWidth < 1024) return 50
      return 20
    })()

    let attempts = 0

    while (placed.length < MAX_ICONS && attempts < MAX_ATTEMPTS) {
      attempts++

      const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE
      const x = Math.random() * 100
      const y = Math.random() * 100

      const radius = size / 2

      const tooClose = placed.some((icon) => {
        const dx = x - icon.x
        const dy = y - icon.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        const minDist = radius + icon.size / 2 + PADDING
        return distance * 10 < minDist
      })

      if (tooClose) continue

      const sizeRatio = (size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)
      const opacity = 0.25 - sizeRatio * 0.2
      const blur = 1 + 3 * (1 - sizeRatio)

      placed.push({
        Icon: ICONS_POOL[Math.floor(Math.random() * ICONS_POOL.length)],
        x,
        y,
        size,
        opacity,
        blur,
        initialRotation: Math.random() * 360,
        duration: 60 + Math.random() * 90,
        direction: Math.random() > 0.5 ? 1 : -1,
      })
    }
    setIcons(placed)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {icons.map((item, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translate(-50%, -50%) rotate(${item.initialRotation}deg)`,
          }}
        >
          <item.Icon
            size={item.size}
            strokeWidth={1.5}
            style={{
              opacity: item.opacity,
              willChange: "transform",
              filter: `blur(${item.blur}px)`,
              color: "var(--text-muted)",
              animation: ANIMATE ? `spin ${item.duration}s linear infinite` : undefined,
              animationDirection: ANIMATE ? (item.direction === 1 ? "normal" : "reverse") : undefined,
            }}
          />
        </div>
      ))}

      {ANIMATE && (
        <style>
          {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}
        </style>
      )}
    </div>
  )
}
