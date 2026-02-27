import { useFieldArray } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { FormTextArea } from "@/components/ui/FormTextArea"
import { DoubleClickButton } from "@/components/ui/DoubleClickButton"
import { StepIndicator } from "@/components/common/StepIndicator"
import { FormInput } from "@/components/ui/FormInput"
import { Button } from "@/components/ui/Button"
import { Trash2, Plus, ArrowDown, ArrowUp, CirclePlus } from "lucide-react"
import { FormFieldError } from "@/forms/core/FormErrors"
import { useFormContext } from "react-hook-form"

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

  const { trigger } = useFormContext<RecipeFormData>()

  return (
    <section>
      <h2 className="text-xl font-semibold text-(--text-secondary)">Preparation</h2>
      <div className="my-2 space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="relative border-b border-(--border-muted)! pt-4 pb-4">
            <div className="absolute top-2 right-4">
              {/* Right: buttons */}
              <div className="flex">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => move(index, index + 1)}
                  disabled={index === fields.length - 1}
                  className="rounded-full border border-(--border-muted)! px-2! py-0! text-(--text-muted)! hover:bg-(--bg-secondary) hover:text-(--accent-secondary)! disabled:text-(--text-faded)!"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  className="rounded-full border border-(--border-muted)! px-2! py-0! text-(--text-muted)! hover:bg-(--bg-secondary) hover:text-(--accent-secondary)! disabled:text-(--text-faded)!"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>

                <DoubleClickButton
                  title="Remove step"
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
                  onClick={() => {
                    remove(index)
                    trigger("steps")
                  }}
                  className="absolute top-0 right-0"
                />
              </div>
            </div>

            {/* Title Row */}
            <div className="flex items-center gap-2">
              <StepIndicator>{index + 1}</StepIndicator>

              <FormInput
                {...register(`steps.${index}.title`)}
                error={errors?.[index]?.title}
                placeholder="Step title"
                className="w-full p-2 text-lg font-medium text-(--accent-primary)"
                wrapperClassName="flex-1 min-w-0"
              />
            </div>

            {/* Description */}
            <FormTextArea
              {...register(`steps.${index}.description`)}
              placeholder="Step description"
              error={errors?.[index]?.description}
              rows={1}
              className="mt-3 w-full resize-none border border-dashed border-(--border-muted)! bg-transparent p-2 outline-none"
            />

            <Button
              type="button"
              title="Add step below"
              variant="ghost"
              onClick={() => insert(index + 1, { title: "", description: "" })}
              className="absolute right-0 -bottom-2.5 rounded-full border border-(--border-muted)! px-2! py-0! text-(--text-muted)! hover:scale-110 hover:bg-(--bg-secondary) hover:text-(--accent-secondary)! active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {fields.length > 0 ? null : (
        <Button
          type="button"
          onClick={() => {
            append({
              title: "",
              description: "",
            })
            trigger("steps")
          }}
          className="flex items-center justify-center gap-2 rounded-full text-sm text-(--accent-primary) hover:bg-(--accent-secondary)"
        >
          <CirclePlus />
          Step
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
