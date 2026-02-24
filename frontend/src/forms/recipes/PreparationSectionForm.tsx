import { useFieldArray } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { FormTextArea } from "@/components/ui/FormTextArea"
import { DoubleClickButton } from "@/components/ui/DoubleClickButton"
import { StepIndicator } from "@/components/common/StepIndicator"
import { FormInput } from "@/components/ui/FormInput"
import { Button } from "@/components/ui/Button" 

interface Props {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  errors: FieldErrors<RecipeFormData>["steps"]
}

export function PreparationSectionForm({ control, register, errors }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  })

  return (
    <section>
      <h2 className="text-xl font-semibold">Preparation</h2>

      <div className="mt-4 space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="relative border-b pb-4">
            {/* Title Row */}
            <div className="flex items-center gap-2">
              <StepIndicator>{index + 1}</StepIndicator>

              <FormInput
                {...register(`steps.${index}.title`)}
                error={errors?.[index]?.title}
                placeholder="Step title"
                className="w-full text-lg font-medium text-(--accent-primary)"
                wrapperClassName="flex-1 min-w-0"
              />
              <DoubleClickButton type="button" onClick={() => remove(index)} className="absolute top-0 right-0" />
            </div>

            {/* Description */}
            <FormTextArea
              {...register(`steps.${index}.description`)}
              placeholder="Step description"
              error={errors?.[index]?.description}
              rows={1}
              className="mt-3 p-2 w-full resize-none border border-dashed border-(--border-muted)! bg-transparent outline-none"
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={() => {
          console.log(fields.length)
          console.log(fields)
          append({
            title: "",
            description: "",
          })}
        }
        className="mt-4 text-sm text-(--accent-primary) hover:bg-(--accent-secondary)"
      >
        + Add step
      </Button>
    </section>
  )
}
