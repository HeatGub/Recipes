import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"

interface Props {
  register: UseFormRegister<RecipeFormData>
  errors: FieldErrors<RecipeFormData>
}

export function RecipeDetailsCardForm({ register }: Props) {
  return (
    <div className="flex flex-wrap justify-between w-full rounded-xl bg-(--bg-secondary) p-4 gap-4 md:flex-nowrap">
      <div className="flex-1 flex flex-col items-center space-y-1">
        <p className="text-sm text-(--text-muted)">Author</p>
        <input {...register("details.author")} className="text-center bg-transparent outline-none" />
      </div>

      <div className="flex-1 flex flex-col items-center space-y-1">
        <p className="text-sm text-(--text-muted)">Portions</p>
        <input
          type="number"
          {...register("details.portions", { valueAsNumber: true })}
          className="text-center bg-transparent outline-none"
        />
      </div>
    </div>
  )
}