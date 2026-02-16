import { RouterProvider } from "react-router-dom"
import { router } from "@/router"
import { ToasterSetup } from "@/components/ui/Toasts"

export function App() {
  return (
    <>
      <ToasterSetup />
      <RouterProvider router={router} />
    </>
  )
}
