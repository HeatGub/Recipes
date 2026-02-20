import { ThemeToggle } from "@/components/common/ThemeToggle"
import { AuthTest } from "@/components/auth/AuthTest"
import clsx from "clsx"

export function Home() {
    return (
      <div
        // clsx holds back prettier from keeping className in one line
        className={clsx(
          "flex min-h-screen flex-col items-center justify-center",
          "gap-4 sm:gap-6 lg:gap-10",
          "transition-colors"
        )}
      >
        <div className="text-sm font-bold text-(--accent-primary) sm:text-lg lg:text-2xl">
          Responsive Primary Accent
        </div>
  
        <div className="text-xs font-semibold text-(--accent-secondary) sm:text-base lg:text-xl">
          Responsive Secondary Accent
        </div>
  
        <div className="text-2xl text-(--text-secondary)">
          <span className="sm:hidden">Mobile view</span>
          <span className="hidden sm:inline lg:hidden">Tablet view</span>
          <span className="hidden lg:inline">Desktop view</span>
        </div>
        
        <ThemeToggle />

        <AuthTest />
      </div>
    )
}