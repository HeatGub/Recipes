import { useFieldArray } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { FormTextArea } from "@/components/ui/FormTextArea"

interface Props {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  errors: FieldErrors<RecipeFormData>["steps"]
}

export function PreparationSectionForm({ control, register, errors }: Props) {
  const { fields, append } = useFieldArray({
    control,
    name: "steps",
  })

  return (
    <section>
      <h2 className="text-xl font-semibold">Preparation</h2>

      <div className="mt-4 space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="border-b pb-4">
            <FormTextArea
              {...register(`steps.${index}.title`)}
              error={errors?.[index]?.title}
              placeholder="Step title"
              className="w-full bg-transparent text-lg text-(--accent-primary) font-medium outline-none"
            />
            <FormTextArea
              {...register(`steps.${index}.description`)}
              placeholder="Step description"
              error={errors?.[index]?.description}
              rows={2}
              className="mt-2 w-full resize-none bg-transparent outline-none"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          append({
            position: fields.length + 1,
            title: "",
            description: "",
          })
        }
        className="mt-4 text-sm text-(--accent-primary)"
      >
        + Add step
      </button>
    </section>
  )
}
