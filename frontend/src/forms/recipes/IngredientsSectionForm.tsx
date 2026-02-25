import type { Control, UseFormRegister } from "react-hook-form"
import { useFieldArray } from "react-hook-form"
import type { RecipeFormData } from "./RecipeForm"
import { IngredientCategoryFields } from "./IngredientCategoryFields"
import type { FieldErrors } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { CirclePlus } from "lucide-react"

interface Props {
  control: Control<RecipeFormData>
  register: UseFormRegister<RecipeFormData>
  errors?: FieldErrors<RecipeFormData>["ingredients"]
}

export function IngredientsSectionForm({ control, register, errors }: Props) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "ingredients",
  })

  return (
    <section className="rounded-2xl bg-(--bg-secondary) p-3">
      <h2 className="border-b pb-1 text-center text-xl font-semibold text-(--text-secondary)">Ingredients</h2>

      {fields.map((category, catIndex) => (
        <IngredientCategoryFields
          key={category.id}
          control={control}
          register={register}
          catIndex={catIndex}
          errors={errors?.[catIndex]}
          onRemoveCategory={() => remove(catIndex)}
          onMoveUp={() => move(catIndex, catIndex - 1)}
          onMoveDown={() => move(catIndex, catIndex + 1)}
          isFirst={catIndex === 0}
          isLast={catIndex === fields.length - 1}
        />
      ))}

      <Button
        type="button"
        variant="ghost"
        onClick={() =>
          append({
            title: "",
            items: [],
          })
        }
        className="items-left mt-2 w-full border border-dashed! border-(--border-muted)! bg-transparent p-0! text-(--text-muted)! hover:text-(--accent-secondary)!"
      >
        <div className="flex items-center gap-2 pl-2">
          <CirclePlus className="h-5 w-5" /> Category
        </div>
      </Button>
    </section>
  )
}
