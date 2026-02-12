import { AppLayout } from "@/layouts/AppLayout"
import { createBrowserRouter } from "react-router-dom"
import { Home } from "@/pages/Home"
import { AccountSettings } from "@/pages/AccountSettings"

export const ROUTES = {
  home: "/",
  accountSettings: "/account-settings",
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: ROUTES.home, element: <Home /> },
      { path: ROUTES.accountSettings, element: <AccountSettings /> },
    ],
  },
])