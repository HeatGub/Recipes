import type { Control, UseFormRegister } from "react-hook-form"
import { useFieldArray } from "react-hook-form"
import type { RecipeFormData, AvailableLangs } from "./RecipeForm"
import { IngredientCategoryFields } from "./IngredientCategoryFields"
import type { FieldErrors } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { CirclePlus } from "lucide-react"
import { RECIPE } from "@/forms/core/constants"
import { useTranslation } from "react-i18next"
import { InputError } from "@/components/ui/InputError"

interface Props {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  errors?: FieldErrors<RecipeFormData>["ingredients"]
  formLang: AvailableLangs
}

export function IngredientsSectionForm({ control, register, errors, formLang }: Props) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "ingredients",
  })

  const { t } = useTranslation()

  return (
    <section className="mb-2 rounded-2xl bg-(--bg-secondary) px-1 py-2 sm:mx-2 sm:my-4 sm:mb-0 sm:py-4 md:mx-8 md:px-4 lg:mx-16">
      <h2 className="border-b pb-1 text-center text-xl font-semibold text-(--text-secondary)">
        {t("recipe.ingredients.title")}
      </h2>

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
          formLang={formLang}
        />
      ))}

      {fields.length < RECIPE.INGREDIENTS.CATEGORY.MAX && (
        <Button
          type="button"
          title={t("recipe.button.title.category.add")}
          variant="ghost"
          onClick={() => {
            append({
              title: {
                en: "",
                pl: "",
              },
              items: [
                {
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
                },
              ],
            })
          }}
          className="items-left mt-2 w-full bg-transparent p-0! text-(--text-muted)! hover:text-(--accent-secondary)!"
        >
          <div className="flex items-center gap-2 pl-2">
            <CirclePlus className="h-5 w-5" /> {t("recipe.ingredients.category")}
          </div>
        </Button>
      )}

      {errors?.root && <InputError error={errors?.root} />}
    </section>
  )
}
