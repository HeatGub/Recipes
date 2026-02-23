import { useFieldArray } from "react-hook-form"
import type { Control, UseFormRegister  } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"

interface Props {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
}

export function PreparationSectionForm({ control, register }: Props) {
  const { fields, append } = useFieldArray({
    control,
    name: "steps",
  })

  return (
    <section>
      <h2 className="text-xl font-semibold">Preparation</h2>

      <div className="space-y-4 mt-4">
        {fields.map((field, index) => (
          <div key={field.id} className="border-b pb-4">
            <input
              {...register(`steps.${index}.title`)}
              placeholder="Step title"
              className="text-lg font-medium w-full bg-transparent outline-none"
            />

            <textarea
              {...register(`steps.${index}.description`)}
              placeholder="Step description"
              className="w-full mt-2 bg-transparent outline-none resize-none"
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