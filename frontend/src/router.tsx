import { AppLayout } from "@/components/layout/AppLayout"
import { createBrowserRouter, createHashRouter } from "react-router-dom"
import { Home } from "@/pages/Home"
import { ProtectedRoute } from "@/auth/ProtectedRoute"
import { AccountSettings } from "@/pages/AccountSettings"
import { NotFound } from "./pages/NotFound"
import { RecipePage } from "./pages/RecipePage"
import recipePierogi from "./pages/recipePierogi.json"
import { RecipeForm } from "@/forms/recipes/RecipeForm"
import { DEMO_MODE } from "@/constants"

export const ROUTES = {
  home: "/",
  accountSettings: "/account-settings",
  recipeDetails: "/recipe/1",
  recipeCreate: "/recipe/create",
}

const selectedRouter = DEMO_MODE? createHashRouter : createBrowserRouter

export const router = selectedRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: ROUTES.home, element: <Home /> },

      {
        path: ROUTES.accountSettings,
        element: (
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        ),
      },

      {
        path: "recipe",
        children: [
          {
            path: "create",
            element: <RecipeForm />,
          },
          {
            path: ":id",
            element: <RecipePage recipe={recipePierogi} />,
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
])
