import { useFieldArray } from "react-hook-form"
import type { Control, UseFormRegister  } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"

interface CategoryProps {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  catIndex: number
}

export function IngredientCategoryFields({
  control,
  register,
  catIndex,
}: CategoryProps) {
  const { fields, append } = useFieldArray({
    control,
    name: `ingredients.${catIndex}.items`,
  })

  return (
    <div className="mt-4 space-y-2">
      <input
        {...register(`ingredients.${catIndex}.title`)}
        placeholder="Category title"
        className="font-semibold bg-transparent outline-none"
      />

      {fields.map((item, itemIndex) => (
        <div key={item.id} className="flex gap-2">
          <input
            type="number"
            {...register(
              `ingredients.${catIndex}.items.${itemIndex}.amount`,
              { valueAsNumber: true }
            )}
            placeholder="amount"
            className="w-20"
          />

          <input
            {...register(
              `ingredients.${catIndex}.items.${itemIndex}.unit`
            )}
            placeholder="unit"
            className="w-20"
          />

          <input
            {...register(
              `ingredients.${catIndex}.items.${itemIndex}.name`
            )}
            placeholder="ingredient"
            className="flex-1"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          append({
            name: "",
            amount: undefined,
            unit: "",
            notes: null,
          })
        }
        className="text-sm text-(--accent-primary)"
      >
        + Add item
      </button>
    </div>
  )
}