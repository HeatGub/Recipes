import { useState } from "react"
import { SunMoon } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"))

const toggleTheme = () => {
  const root = document.documentElement

  root.classList.add("no-theme-transition")
  root.classList.toggle("dark")

  requestAnimationFrame(() => {
    root.classList.remove("no-theme-transition")
  })

  setIsDark(!isDark)
}
  return (
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center 
        p-0.5
        border border-(--border-muted)!
        cursor-pointer rounded bg-(--bg-secondary) 
        transition-colors duration-300 
        hover:bg-(--bg-inverted) hover:text-(--text-inverted)"
      >
        <SunMoon className="h-7 w-7"/>
      </button>
  )
}