import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { FormInput } from "@/components/ui/FormInput"

interface Props {
  register: UseFormRegister<RecipeFormData>
  errors: FieldErrors<RecipeFormData>["details"]
}

export function RecipeDetailsCardForm({ register, errors }: Props) {
  return (
    <div className="flex w-full flex-wrap justify-between gap-4 rounded-xl bg-(--bg-secondary) p-4 md:flex-nowrap">
      <div className="flex flex-1 flex-col items-center space-y-1">
        <p className="text-sm text-(--text-muted)">Author</p>
        <FormInput
          {...register("details.author")}
          error={errors?.author}
          className="text-center"
        />
      </div>

      <div className="flex flex-1 flex-col items-center space-y-1">
        <p className="text-sm text-(--text-muted)">Portions</p>

        <FormInput
          type="number"
          {...register("details.portions", { valueAsNumber: true })}
          error={errors?.portions}
          className="text-center outline-none"
        />
      </div>
    </div>
  )
}
