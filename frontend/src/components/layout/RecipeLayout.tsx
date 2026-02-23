interface RecipeLayoutProps {
  header: React.ReactNode
  details: React.ReactNode
  ingredients: React.ReactNode
  preparation: React.ReactNode
  footer?: React.ReactNode
}

export function RecipeLayout({
  header,
  details,
  ingredients,
  preparation,
  footer,
}: RecipeLayoutProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <article className="overflow-hidden rounded-xl border border-(--border-muted)! shadow-[0_0_6px_var(--shadow-color)]">
        <header className="border-b p-8">
          <div className="flex flex-col gap-6">
            {header}
            {details}
          </div>
        </header>

        <div className="py-10 px-16">
          <div className="float-left mr-8 mb-3 w-full md:w-85">
            {ingredients}
          </div>

          {preparation}
        </div>

        {footer}
      </article>
    </div>
  )
}