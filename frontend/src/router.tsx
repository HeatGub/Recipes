import { AppLayout } from "@/components/layout/AppLayout"
import { createBrowserRouter } from "react-router-dom"
import { Home } from "@/pages/Home"
import { ProtectedRoute } from "@/auth/ProtectedRoute"
import { AccountSettings } from "@/pages/AccountSettings"
import { NotFound } from "./pages/NotFound"
import { RecipePage } from "./pages/RecipePage"
// import recipe from "./pages/recipe.json"
import recipeLongSteps from "./pages/recipeLongSteps.json"
// import recipeManySteps from "./pages/recipeManySteps.json"
import { RecipeForm } from "@/forms/recipes/RecipeForm"

export const ROUTES = {
  home: "/",
  accountSettings: "/account-settings",
  recipeDetails: "/recipe",
  recipeCreate: "/recipe/create"
}

export const router = createBrowserRouter([
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
        path: ROUTES.recipeDetails,
        element: <RecipePage recipe={recipeLongSteps} />,
      },

      {
        path: ROUTES.recipeCreate,
        element: <RecipeForm onSubmit={async (form_data)=>{console.log(form_data)}}/>,
      },

      { path: "*", element: <NotFound /> },
    ],
  },
])
