import { useEffect } from "react"
import { SunMoon } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("theme", "dark")

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  useEffect(() => {
    const root = document.documentElement

    root.classList.add("no-theme-transition")

    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    requestAnimationFrame(() => {
      root.classList.remove("no-theme-transition")
    })
  }, [theme])

  return (
    <button
      onClick={toggleTheme}
      className="flex cursor-pointer items-center justify-center 
      rounded border border-(--border-muted)! bg-(--bg-secondary) 
      p-0.5 transition-colors duration-300 
      hover:bg-(--bg-inverted) hover:text-(--text-inverted)"
    >
      <SunMoon className="h-7 w-7" />
    </button>
  )
}
