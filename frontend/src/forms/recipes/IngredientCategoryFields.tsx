import { useFieldArray } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData, AvailableLangs } from "./RecipeForm"
import { FormInput } from "@/components/ui/FormInput"
import { Button } from "@/components/ui/Button"
import { DoubleClickButton } from "@/components/ui/DoubleClickButton"
import { CirclePlus, ArrowDown, ArrowUp } from "lucide-react"
import { RECIPE } from "@/forms/core/constants"
import { InputError } from "@/components/ui/InputError"
import { useTranslation } from "react-i18next"

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
  formLang: AvailableLangs
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
  formLang,
}: CategoryProps) {
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: `ingredients.${catIndex}.items`,
  })

  const { t } = useTranslation()

  return (
    <div className="mt-4 space-y-2">
      {/* Category title */}
      <div className="flex w-full gap-2">
        <FormInput
          {...register(`ingredients.${catIndex}.title.en`)}
          error={errors?.title?.en}
          placeholder={`${t("recipe.ingredients.category")} ${catIndex + 1}`}
          wrapperClassName={`flex-1 ${formLang === "en" ? "block" : "hidden"}`}
        />
        <FormInput
          {...register(`ingredients.${catIndex}.title.pl`)}
          error={errors?.title?.pl}
          placeholder={`${t("recipe.ingredients.category")} ${catIndex + 1}`}
          wrapperClassName={`flex-1 ${formLang === "pl" ? "block" : "hidden"}`}
        />

        {!(isFirst && isLast) && (
          <>
            <Button
              type="button"
              title={t("recipe.button.title.category.down")}
              variant="ghost"
              onClick={onMoveDown}
              disabled={isLast}
              className="bg-transparent! px-1! py-0! text-xs text-(--text-muted) disabled:opacity-40"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              title={t("recipe.button.title.category.up")}
              variant="ghost"
              onClick={onMoveUp}
              disabled={isFirst}
              className="bg-transparent! px-1! py-0! text-xs text-(--text-muted) disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>

            <DoubleClickButton title={t("recipe.button.title.category.delete")} onClick={onRemoveCategory} />
          </>
        )}
      </div>

      {/* Ingredient items */}
      <div className="grid w-full grid-cols-[minmax(2.5rem,0.8fr)_minmax(2.5rem,1fr)_minmax(4.5rem,1.8fr)_2fr_min-content] gap-y-0.75 text-sm">
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
                placeholder={t("recipe.ingredients.items.amount")}
                className="text-center"
                wrapperClassName="bg-(--bg-primary) rounded-l px-0.5 py-0.75"
                error={itemErrors?.amount}
                attachError={false}
              />

              <FormInput
                {...register(`ingredients.${catIndex}.items.${itemIndex}.unit.en`)}
                required
                placeholder={t("recipe.ingredients.items.unit")}
                className="text-center italic"
                wrapperClassName={`bg-(--bg-primary) px-0.5 py-0.75 ${formLang === "en" ? "block" : "hidden"}`}
                attachError={false}
              />
              <FormInput
                {...register(`ingredients.${catIndex}.items.${itemIndex}.unit.pl`)}
                required
                placeholder={t("recipe.ingredients.items.unit")}
                className="text-center italic"
                wrapperClassName={`bg-(--bg-primary) px-0.5 py-0.75 ${formLang === "pl" ? "block" : "hidden"}`}
                attachError={false}
              />

              <FormInput
                {...register(`ingredients.${catIndex}.items.${itemIndex}.name.en`)}
                required
                placeholder={t("recipe.ingredients.items.name")}
                className="text-center font-medium"
                wrapperClassName={`bg-(--bg-primary) px-0.5 py-0.75 ${formLang === "en" ? "block" : "hidden"}`}
                attachError={false}
              />
              <FormInput
                {...register(`ingredients.${catIndex}.items.${itemIndex}.name.pl`)}
                required
                placeholder={t("recipe.ingredients.items.name")}
                className="text-center font-medium"
                wrapperClassName={`bg-(--bg-primary) px-0.5 py-0.75 ${formLang === "pl" ? "block" : "hidden"}`}
                attachError={false}
              />

              <FormInput
                {...register(`ingredients.${catIndex}.items.${itemIndex}.notes.en`)}
                placeholder={t("recipe.ingredients.items.notes")}
                className="min-w-6 p-0.5 text-xs font-semibold text-(--text-secondary) italic"
                wrapperClassName={`bg-(--bg-primary) px-0.5 py-0.75 ${formLang === "en" ? "block" : "hidden"}`}
                attachError={false}
              />
              <FormInput
                {...register(`ingredients.${catIndex}.items.${itemIndex}.notes.pl`)}
                placeholder={t("recipe.ingredients.items.notes")}
                className="min-w-6 p-0.5 text-xs font-semibold text-(--text-secondary) italic"
                wrapperClassName={`bg-(--bg-primary) px-0.5 py-0.75 ${formLang === "pl" ? "block" : "hidden"}`}
                attachError={false}
              />

              {/* action column */}
              <div className="flex items-center justify-center rounded-r bg-(--bg-primary) px-0.5 sm:gap-x-1">
                <Button
                  type="button"
                  title={t("recipe.button.title.ingredient.down")}
                  variant="ghost"
                  onClick={() => move(itemIndex, itemIndex + 1)}
                  disabled={itemIndex === fields.length - 1}
                  className="px-2! text-xs text-(--text-muted) disabled:opacity-40 min-[360px]:px-3!"
                >
                  ↓
                </Button>

                <Button
                  type="button"
                  title={t("recipe.button.title.ingredient.up")}
                  variant="ghost"
                  onClick={() => move(itemIndex, itemIndex - 1)}
                  disabled={itemIndex === 0}
                  className="px-2! text-xs text-(--text-muted) disabled:opacity-40 min-[360px]:px-3!"
                >
                  ↑
                </Button>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    title={t("recipe.button.title.ingredient.delete")}
                    variant="ghost"
                    onClick={() => remove(itemIndex)}
                    className="px-2! text-xs hover:text-(--text-danger)! min-[360px]:px-3!"
                  >
                    ✕
                  </Button>
                )}
              </div>

              {/* Errors row*/}
              <div className="contents text-center break-all sm:break-normal">
                <div>
                  <InputError className="-mt-0.5" error={itemErrors?.amount} />
                </div>
                <div>
                  <InputError
                    className={`-mt-0.5 ${formLang === "en" ? "block" : "hidden"}`}
                    error={itemErrors?.unit?.en}
                  />
                  <InputError
                    className={`-mt-0.5 ${formLang === "pl" ? "block" : "hidden"}`}
                    error={itemErrors?.unit?.pl}
                  />
                </div>
                <div>
                  <InputError
                    className={`-mt-0.5 ${formLang === "en" ? "block" : "hidden"}`}
                    error={itemErrors?.name?.en}
                  />
                  <InputError
                    className={`-mt-0.5 ${formLang === "pl" ? "block" : "hidden"}`}
                    error={itemErrors?.name?.pl}
                  />
                </div>
                <div>
                  <InputError
                    className={`-mt-0.5 ${formLang === "en" ? "block" : "hidden"}`}
                    error={itemErrors?.notes?.en}
                  />
                  <InputError
                    className={`-mt-0.5 ${formLang === "pl" ? "block" : "hidden"}`}
                    error={itemErrors?.notes?.pl}
                  />
                </div>
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
          title={t("recipe.button.title.ingredient.add")}
          variant="ghost"
          onClick={() =>
            append({
              name: {
                en: "",
                pl: "",
              },
              amount: undefined,
              unit: {
                en: "",
                pl: "",
              },
              notes: {
                en: "",
                pl: "",
              },
            })
          }
          className="-mt-1.25 flex w-full items-center justify-center gap-2 bg-(--bg-primary) text-sm font-light! text-(--text-muted)! hover:text-(--accent-secondary)!"
        >
          <CirclePlus className="h-4 w-4" />
          {t("recipe.ingredients.ingredient")}
        </Button>
      )}

      {errors?.items?.root && <InputError error={errors.items.root} />}
    </div>
  )
}
