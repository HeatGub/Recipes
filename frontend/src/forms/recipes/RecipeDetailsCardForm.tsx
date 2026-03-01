import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { FormInput } from "@/components/ui/FormInput"
import { FormNumberInput } from "@/components/ui/FormNumberInput"
import { useFormContext } from "react-hook-form"
import { RECIPE } from "@/forms/core/constants"


interface Props {
  register: UseFormRegister<RecipeFormData>
  errors: FieldErrors<RecipeFormData>["details"]
}

export function RecipeDetailsCardForm({ register, errors }: Props) {
  const { watch, setValue, trigger } = useFormContext<RecipeFormData>()
  const servings = watch("details.servings") ?? 0

  const handleChange = (val: number) => {
    setValue("details.servings", val, { shouldValidate: true, shouldDirty: true })
    trigger("details.servings") // make sure RHF re-runs validation immediately
  }

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
        <p className="text-sm text-(--text-muted)">Servings</p>
        <FormNumberInput
          required
          value={servings}
          onChange={handleChange}
          min={RECIPE.SERVINGS.MIN}
          max={RECIPE.SERVINGS.MAX}
          step={1}
          error={errors?.servings}
          className="text-center max-w-30"
        />
      </div>
    </div>
  )
}