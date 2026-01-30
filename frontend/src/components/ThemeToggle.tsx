import { useState } from "react"
import clsx from "clsx"

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
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={toggleTheme}
        className={clsx(
          "rounded px-4 py-2",
          "bg-(--bg-secondary)",
          "transition-colors duration-300",
          "hover:bg-(--bg-inverted)",
          "hover:text-(--text-inverted)"
        )}
      >
        {isDark ? "Light" : "Dark"}
      </button>
    </div>
  )
}