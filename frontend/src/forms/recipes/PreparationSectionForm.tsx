import { useFieldArray } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { FormTextArea } from "@/components/ui/FormTextArea"
import { DoubleClickButton } from "@/components/ui/DoubleClickButton"
import { StepIndicator } from "@/components/common/StepIndicator"
import { FormInput } from "@/components/ui/FormInput"
import { Button } from "@/components/ui/Button"
import { Trash2, Plus, ArrowDown, ArrowUp, CirclePlus } from "lucide-react"
import { RECIPE } from "@/forms/core/constants"
import { InputError } from "@/components/ui/InputError"
import { useTranslation } from "react-i18next"

interface Props {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  errors: FieldErrors<RecipeFormData>["steps"]
}

export function PreparationSectionForm({ control, register, errors }: Props) {
  const { fields, remove, append, insert, move } = useFieldArray({
    control,
    name: "steps",
  })

  const { t } = useTranslation()

  return (
    <section>
      <h2 className="text-xl font-semibold text-(--text-secondary)">{t("recipe.preparation.title")}</h2>
      <div className="mb-2 space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="group relative border-b border-(--border-muted)! pt-2 pb-6">
            {fields.length > 1 && (
              <div className="pointer-events-none absolute -bottom-2.5 flex opacity-0 transition-opacity duration-150 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
                <Button
                  type="button"
                  title={t("recipe.button.title.preparation_step.down")}
                  variant="ghost"
                  onClick={() => move(index, index + 1)}
                  disabled={index === fields.length - 1}
                  className="rounded-full border border-(--border-muted)! px-2! py-0! text-(--text-muted)! hover:bg-(--bg-secondary) hover:text-(--accent-secondary)! disabled:text-(--text-faded)!"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  title={t("recipe.button.title.preparation_step.up")}
                  variant="ghost"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  className="rounded-full border border-(--border-muted)! px-2! py-0! text-(--text-muted)! hover:bg-(--bg-secondary) hover:text-(--accent-secondary)! disabled:text-(--text-faded)!"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>

                <DoubleClickButton
                  title={t("recipe.button.title.preparation_step.delete")}
                  firstClickContent={
                    <div className="rounded-full border border-(--border-muted)! bg-(--bg-primary) px-2! py-0!">
                      <Trash2 className="h-4 w-4 text-(--text-muted) hover:text-(--text-warning) hover:drop-shadow-[0_0_4px_var(--text-warning)]" />
                    </div>
                  }
                  secondClickContent={
                    <div className="rounded-full border border-(--border-muted)! bg-(--bg-primary) px-2! py-0!">
                      <Trash2 className="h-4 w-4 text-(--text-danger) drop-shadow-[0_0_4px_var(--text-danger)]" />
                    </div>
                  }
                  onClick={() => remove(index)}
                />
              </div>
            )}

            {/* Title Row */}
            <div className="items-top flex gap-2">
              <StepIndicator className="mt-1.5">{index + 1}</StepIndicator>

              <FormInput
                {...register(`steps.${index}.title`)}
                error={errors?.[index]?.title}
                placeholder={t("recipe.preparation.step.title")}
                className="w-full p-1 text-lg font-medium text-(--accent-primary)"
                wrapperClassName="flex-1 min-w-0"
              />
            </div>

            {/* Description */}
            <FormTextArea
              {...register(`steps.${index}.description`)}
              required
              placeholder={t("recipe.preparation.step.description")}
              error={errors?.[index]?.description}
              rows={1}
              className="mt-1 px-2 py-1"
              attachError={false}
            />

            <div>
              <InputError className="mt-1 -mb-4" error={errors?.[index]?.description} />
            </div>

            {fields.length < RECIPE.PREPARATION_STEPS.MAX && (
              <Button
                type="button"
                title={t("recipe.button.title.preparation_step.add")}
                variant="ghost"
                onClick={() => insert(index + 1, { title: "", description: "" })}
                className="absolute right-0 -bottom-2.5 rounded-full border border-(--border-muted)! px-2! py-0! text-(--text-muted)! hover:scale-110 hover:bg-(--bg-secondary) hover:text-(--accent-secondary)! active:scale-95"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {fields.length == 0 && (
        <Button
          type="button"
          onClick={() => {
            append({
              title: "",
              description: "",
            })
          }}
          className="flex items-center justify-center gap-2 rounded-full text-sm text-(--accent-primary) hover:bg-(--accent-secondary)"
        >
          <CirclePlus />
          {t("recipe.button.title.preparation_step.add")}
        </Button>
      )}

      {errors?.root && (
        <InputError error={errors?.root} />
      )}
    </section>
  )
}
