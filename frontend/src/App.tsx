import { RouterProvider } from "react-router-dom"
import { router } from "@/router"
import { ToasterSetup } from "@/components/ui/Toasts"
import { useVisitCounter } from "@/hooks/useVisitCounter"

export function App() {
  useVisitCounter()
  return (
    <>
      <ToasterSetup />
      <RouterProvider router={router} />
    </>
  )
}
