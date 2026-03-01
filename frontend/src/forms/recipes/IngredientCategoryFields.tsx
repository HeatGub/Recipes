import { useFieldArray } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { FormInput } from "@/components/ui/FormInput"
import { Button } from "@/components/ui/Button"
import { DoubleClickButton } from "@/components/ui/DoubleClickButton"
import { CirclePlus, ArrowDown, ArrowUp } from "lucide-react"
import { FormFieldError } from "@/forms/core/FormErrors"
import { RECIPE } from "@/forms/core/constants"

interface CategoryProps {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  catIndex: number
  errors?: FieldErrors<NonNullable<RecipeFormData["ingredients"]>[number]>
  onRemoveCategory: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

export function IngredientCategoryFields({
  control,
  register,
  catIndex,
  errors,
  onRemoveCategory,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: CategoryProps) {
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: `ingredients.${catIndex}.items`,
  })

  return (
    <div className="mt-4 space-y-2">
      {/* Category title */}
      <div className="items-cente flex w-full gap-2">
        <FormInput
          {...register(`ingredients.${catIndex}.title`)}
          placeholder="Category title"
          wrapperClassName="flex-1"
          error={errors?.title}
        />
        {!(isFirst && isLast) && (
          <>
        <Button
          type="button"
          variant="ghost"
          onClick={onMoveDown}
          disabled={isLast}
          className="bg-transparent! px-1! py-0! text-xs text-(--text-muted) disabled:opacity-40"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onMoveUp}
          disabled={isFirst}
          className="bg-transparent! px-1! py-0! text-xs text-(--text-muted) disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>

        <DoubleClickButton onClick={onRemoveCategory} /></>)}
      </div>

      {/* Ingredient items */}
      {fields.map((item, itemIndex) => {
        const itemErrors = errors?.items?.[itemIndex]

        return (
          <div key={item.id} className="flex w-full border-spacing-y-1 gap-2 rounded bg-(--bg-primary) p-1 text-sm">
            <FormInput
              {...register(`ingredients.${catIndex}.items.${itemIndex}.amount`, {
                valueAsNumber: true,
              })}
              required
              type="number"
              step="any"
              placeholder="amount"
              className="text-center"
              wrapperClassName="max-w-15"
              error={itemErrors?.amount}
            />

            <FormInput
              {...register(`ingredients.${catIndex}.items.${itemIndex}.unit`)}
              required
              placeholder="unit"
              wrapperClassName="max-w-20"
              className="text-center italic"
              error={itemErrors?.unit}
            />

            <FormInput
              {...register(`ingredients.${catIndex}.items.${itemIndex}.name`)}
              required
              placeholder="ingredient"
              className="text-center font-medium"
              wrapperClassName="flex-1"
              error={itemErrors?.name}
            />

            <FormInput
              {...register(`ingredients.${catIndex}.items.${itemIndex}.notes`)}
              placeholder="notes"
              className="p-0.5 text-xs font-semibold text-(--text-secondary) italic"
              wrapperClassName="flex-1"
              error={itemErrors?.notes}
            />

            {/* action column */}
            <div className="flex justify-center gap-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => move(itemIndex, itemIndex - 1)}
                disabled={itemIndex === 0}
                className="text-xs text-(--text-muted) disabled:opacity-40"
              >
                ↑
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => move(itemIndex, itemIndex + 1)}
                disabled={itemIndex === fields.length - 1}
                className="text-xs text-(--text-muted) disabled:opacity-40"
              >
                ↓
              </Button>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(itemIndex)}
                  className="text-xs hover:text-(--text-danger)!"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>
        )
      })}

      {/* Add item button */}
      {fields.length < RECIPE.INGREDIENTS.ITEM.MAX && (
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            append({
              name: "",
              amount: undefined,
              unit: "",
              notes: undefined,
            })
          }
          className="flex w-full items-center justify-center gap-2 bg-(--bg-primary) text-sm font-light! text-(--text-muted)! hover:text-(--accent-secondary)!"
        >
          <CirclePlus className="h-4 w-4" />
          Ingredient
        </Button>
      )}

      {errors?.items?.root && (
        <p className="flex justify-center text-center text-xs text-(--text-danger)">
          <FormFieldError error={errors.items.root} />
        </p>
      )}
    </div>
  )
}
