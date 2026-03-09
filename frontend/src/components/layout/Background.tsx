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

type Breakpoint = "sm" | "md" | "lg"

function useBreakpoint(): Breakpoint {
  function getBreakpoint(width: number): Breakpoint {
    if (width < 640) return "sm"
    if (width < 1024) return "md"
    return "lg"
  }

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => getBreakpoint(window.innerWidth))

  useEffect(() => {
    const handleResize = () => {
      const next = getBreakpoint(window.innerWidth)

      setBreakpoint((prev) => (prev === next ? prev : next))
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return breakpoint
}

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return size
}

export function Background() {
  const [icons, setIcons] = useState<IconItem[]>([])
  const breakpoint = useBreakpoint()
  const { width, height } = useWindowSize() // new

  const ANIMATE = breakpoint === "lg"

  useEffect(() => {
    const placed: IconItem[] = []

    const MAX_ICONS = breakpoint === "sm" ? 10 : breakpoint === "md" ? 12 : 20
    const MIN_SIZE = breakpoint === "sm" ? 75 : breakpoint === "md" ? 75 : 50
    const MAX_SIZE = breakpoint === "sm" ? 150 : breakpoint === "md" ? 200 : 300
    const PADDING = breakpoint === "sm" ? 50 : breakpoint === "md" ? 100 : 150
    const MAX_ATTEMPTS = breakpoint === "sm" ? 100 : breakpoint === "md" ? 250 : 500

    let attempts = 0

    while (placed.length < MAX_ICONS && attempts < MAX_ATTEMPTS) {
      attempts++

      const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE

      // generate pixel positions for calculation
      const xPx = Math.random() * width
      const yPx = Math.random() * height
      const radius = size / 2

      const tooClose = placed.some((icon) => {
        const dx = xPx - (icon.x / 100) * width
        const dy = yPx - (icon.y / 100) * height
        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDist = radius + icon.size / 2 + PADDING
        return distance < minDist
      })
      if (tooClose) continue

      const sizeRatio = (size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)
      const opacity = 0.25 - sizeRatio * 0.2
      const blur = 1 + 3 * (1 - sizeRatio)

      // store positions as percentages
      placed.push({
        Icon: ICONS_POOL[Math.floor(Math.random() * ICONS_POOL.length)],
        x: (xPx / width) * 100,
        y: (yPx / height) * 100,
        size,
        opacity,
        blur,
        initialRotation: Math.random() * 360,
        duration: 60 + Math.random() * 90,
        direction: Math.random() > 0.5 ? 1 : -1,
      })
    }

    setIcons(placed)
  }, [breakpoint, width, height]) // regenerate on size change

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {icons.map((item, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${item.x}%`, // now percentages
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

              animationName: ANIMATE ? "spin" : undefined,
              animationDuration: ANIMATE ? `${item.duration}s` : undefined,
              animationTimingFunction: ANIMATE ? "linear" : undefined,
              animationIterationCount: ANIMATE ? "infinite" : undefined,
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
