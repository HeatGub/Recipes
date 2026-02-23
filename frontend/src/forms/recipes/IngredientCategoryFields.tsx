import { useFieldArray } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { FormInput } from "@/components/ui/FormInput"

interface CategoryProps {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  catIndex: number
  errors?: FieldErrors<RecipeFormData["ingredients"][number]>
}

export function IngredientCategoryFields({
  control,
  register,
  catIndex,
  errors,
}: CategoryProps) {
  const { fields, append } = useFieldArray({
    control,
    name: `ingredients.${catIndex}.items`,
  })

  return (
    <div className="mt-4 space-y-2">
      {/* Category title */}
      <FormInput
        {...register(`ingredients.${catIndex}.title`)}
        placeholder="Category title"
        className="bg-transparent font-semibold outline-none"
        error={errors?.title}
      />

      {/* Ingredient items */}
      {fields.map((item, itemIndex) => {
        const itemErrors = errors?.items?.[itemIndex]

        return (
          <div key={item.id} className="flex gap-2">
            <FormInput
              {...register(`ingredients.${catIndex}.items.${itemIndex}.amount`, {
                valueAsNumber: true,
              })}
              placeholder="amount"
              className="w-10"
              error={itemErrors?.amount}
            />

            <FormInput
              {...register(`ingredients.${catIndex}.items.${itemIndex}.unit`)}
              placeholder="unit"
              className="w-20"
              error={itemErrors?.unit}
            />

            <FormInput
              {...register(`ingredients.${catIndex}.items.${itemIndex}.name`)}
              placeholder="ingredient"
              className="flex-1"
              error={itemErrors?.name}
            />
          </div>
        )
      })}

      {/* Add item button */}
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