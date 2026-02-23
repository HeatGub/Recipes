import type { Control, UseFormRegister } from "react-hook-form"
import { useFieldArray } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { IngredientCategoryFields } from "./IngredientCategoryFields"
import type { FieldErrors } from "react-hook-form"

interface Props {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  errors?: FieldErrors<RecipeFormData>["ingredients"]
}

export function IngredientsSectionForm({ control, register, errors }: Props) {
  const { fields, append } = useFieldArray({
    control,
    name: "ingredients",
  })

  return (
    <section className="p-3 bg-(--bg-secondary) rounded-2xl">
      <h2 className="text-xl text-center font-semibold pb-1 border-b">
        Ingredients
      </h2>

      {fields.map((category, catIndex) => (
        <IngredientCategoryFields
          key={category.id}
          control={control}
          register={register}
          catIndex={catIndex}
          errors={errors?.[catIndex]}
        />
      ))}

      <button
        type="button"
        onClick={() =>
          append({
            position: fields.length + 1,
            title: "",
            items: [],
          })
        }
        className="mt-4 text-sm text-(--accent-primary)"
      >
        + Add category
      </button>
    </section>
  )
}