import { useFieldArray } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { FormInput } from "@/components/ui/FormInput"
import { Button } from "@/components/ui/Button"
import { DoubleClickButton } from "@/components/ui/DoubleClickButton"
import { CirclePlus, ArrowDown, ArrowUp } from "lucide-react"
import { FormFieldError } from "@/forms/core/FormErrors"
import { RECIPE } from "@/forms/core/constants"
import { InputError } from "@/components/ui/InputError"

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
      <div className="flex w-full gap-2">
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

            <DoubleClickButton onClick={onRemoveCategory} />
          </>
        )}
      </div>

      {/* Ingredient items */}
      <div className="grid w-full grid-cols-[min-content_min-content_1fr_1fr_min-content] text-sm gap-y-0.75">
        {fields.map((item, itemIndex) => {
          const itemErrors = errors?.items?.[itemIndex]

          return (
            <div key={item.id} className="contents">
              <FormInput
                {...register(`ingredients.${catIndex}.items.${itemIndex}.amount`, {
                  valueAsNumber: true,
                })}
                required
                type="number"
                step="any"
                placeholder="amount"
                className="text-center"
                wrapperClassName="min-w-15 bg-(--bg-primary) rounded-l px-0.5 py-0.75"
                error={itemErrors?.amount}
                attachError={false}
              />

              <FormInput
                {...register(`ingredients.${catIndex}.items.${itemIndex}.unit`)}
                required
                placeholder="unit"
                wrapperClassName="min-w-20 bg-(--bg-primary) px-0.5 py-0.75"
                className="text-center italic"
                error={itemErrors?.unit}
                attachError={false}
              />

              <FormInput
                {...register(`ingredients.${catIndex}.items.${itemIndex}.name`)}
                required
                placeholder="ingredient"
                className="text-center font-medium"
                wrapperClassName="bg-(--bg-primary) px-0.5 py-0.75"
                error={itemErrors?.name}
                attachError={false}
              />

              <FormInput
                {...register(`ingredients.${catIndex}.items.${itemIndex}.notes`)}
                placeholder="notes"
                className="p-0.5 text-xs font-semibold text-(--text-secondary) italic"
                wrapperClassName="bg-(--bg-primary) px-0.5 py-0.75"
                error={itemErrors?.notes}
                attachError={false}
              />

              {/* action column */}
              <div className="flex items-center justify-center px-0.5 gap-x-1 bg-(--bg-primary) rounded-r">
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

              {/* Errors row*/}
              <div className="contents text-center">
                <div><InputError className="-mt-0.5" error={itemErrors?.amount}/></div>
                <div><InputError className="-mt-0.5" error={itemErrors?.unit}/></div>
                <div><InputError className="-mt-0.5" error={itemErrors?.name}/></div>
                <div><InputError className="-mt-0.5" error={itemErrors?.notes}/></div>
                <div aria-hidden></div> {/*5th column placeholder*/}
              </div>
            </div>
          )
        })}
      </div>

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
          className="flex w-full items-center justify-center -mt-1.25 gap-2 bg-(--bg-primary) text-sm font-light! text-(--text-muted)! hover:text-(--accent-secondary)!"
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
