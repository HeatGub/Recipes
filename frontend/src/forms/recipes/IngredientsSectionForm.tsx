import type { Control, UseFormRegister } from "react-hook-form"
import { useFieldArray } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { IngredientCategoryFields } from "./IngredientCategoryFields"
import type { FieldErrors } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { CirclePlus } from "lucide-react"
import { FormFieldError } from "@/forms/core/FormErrors"
import { RECIPE } from "@/forms/core/constants"

interface Props {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  errors?: FieldErrors<RecipeFormData>["ingredients"]
}

export function IngredientsSectionForm({ control, register, errors }: Props) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "ingredients",
  })

  return (
    <section className="mx-2 my-4 rounded-2xl bg-(--bg-secondary) px-2 py-4 sm:mx-4 md:mx-8 md:px-4 lg:mx-16">
      <h2 className="border-b pb-1 text-center text-xl font-semibold text-(--text-secondary)">Ingredients</h2>

      {fields.map((category, catIndex) => (
        <IngredientCategoryFields
          key={category.id}
          control={control}
          register={register}
          catIndex={catIndex}
          errors={errors?.[catIndex]}
          onRemoveCategory={() => {
            remove(catIndex)
          }}
          onMoveUp={() => move(catIndex, catIndex - 1)}
          onMoveDown={() => move(catIndex, catIndex + 1)}
          isFirst={catIndex === 0}
          isLast={catIndex === fields.length - 1}
        />
      ))}

      {fields.length < RECIPE.INGREDIENTS.CATEGORY.MAX && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            append({
              title: "",
              items: [{ name: "", amount: undefined, unit: "", notes: undefined }],
            })
          }}
          className="items-left mt-2 w-full bg-transparent p-0! text-(--text-muted)! hover:text-(--accent-secondary)!"
        >
          <div className="flex items-center gap-2 pl-2">
            <CirclePlus className="h-5 w-5" /> Category
          </div>
        </Button>
      )}

      {errors?.root && (
        <p className="flex justify-center text-center text-xs text-(--text-danger)">
          <FormFieldError error={errors?.root} />
        </p>
      )}
    </section>
  )
}
