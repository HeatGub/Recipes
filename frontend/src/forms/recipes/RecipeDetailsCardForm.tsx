import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { FormInput } from "@/components/ui/FormInput"
import { FormNumberInput } from "@/components/ui/FormNumberInput"
import { Select } from "@/components/ui/Select"
import { Controller, useFormContext } from "react-hook-form"
import { RECIPE } from "@/forms/core/constants"
import { useTranslation } from "react-i18next"

interface Props {
  register: UseFormRegister<RecipeFormData>
  errors: FieldErrors<RecipeFormData>["details"]
}

export function RecipeDetailsCardForm({ register, errors }: Props) {
  const { watch, setValue, trigger, control } = useFormContext<RecipeFormData>()
  const servings = watch("details.servings") ?? 0

  const { t } = useTranslation()

  const handleChange = (val: number) => {
    setValue("details.servings", val, { shouldValidate: true, shouldDirty: true })
    trigger("details.servings") // make sure RHF re-runs validation immediately
  }

  return (
    <div className="flex w-full flex-wrap justify-between gap-2 md:gap-4 rounded-xl bg-(--bg-secondary) p-4 md:flex-nowrap">

      <div className="flex flex-1 flex-col items-center space-y-1 text-center">
        <p className="text-sm text-(--text-muted)">{t("recipe.locales.primary_language")}</p>
        <Controller
          name="details.primaryLang"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              options={[
                { label: t("recipe.locales.english"), value: "en" },
                { label: t("recipe.locales.polish"), value: "pl" },
              ]}
            />
          )}
        />
      </div>

      <div className="flex flex-1 flex-col items-center space-y-1">
        <p className="text-sm text-(--text-muted)">{t("recipe.author")}</p>
        <FormInput
          {...register("details.author")}
          error={errors?.author}
          className="text-center"
        />
      </div>

      <div className="flex flex-1 flex-col items-center space-y-1">
        <p className="text-sm text-(--text-muted) text-center">{t("recipe.servings")}</p>
        <FormNumberInput
          required
          value={servings}
          onChange={handleChange}
          min={RECIPE.SERVINGS.MIN}
          max={RECIPE.SERVINGS.MAX}
          step={1}
          error={errors?.servings}
          className="text-center max-w-20 md:max-w-30"
        />
      </div>
    </div>
  )
}