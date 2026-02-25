interface RecipeLayoutProps {
  header: React.ReactNode
  details: React.ReactNode
  ingredients: React.ReactNode
  preparation: React.ReactNode
  footer?: React.ReactNode
  variant: "view" | "edit"
}

export function RecipeLayout({ header, details, ingredients, preparation, footer, variant }: RecipeLayoutProps) {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-md bg-(--bg-secondary) p-2 shadow-md">
      <article className="overflow-hidden rounded-xl border-2 bg-(--bg-primary) shadow-sm">
        <header className="border-b px-4 sm:px-8 lg:px-16 py-8">
          <div className="flex flex-col gap-6">
            {header}
            {details}
          </div>
        </header>

        <div className="px-4 sm:px-8 lg:px-16 py-8">
          <div className={`float-left mr-8 mb-3 w-full ${variant === "view" ? "md:w-85" : ""} float-left`}>
            {ingredients}
          </div>

          {preparation}
        </div>

        {footer}
      </article>
    </div>
  )
}
