import { zodResolver } from "@hookform/resolvers/zod"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
import { IngredientsSectionForm } from "./IngredientsSectionForm"
import { PreparationSectionForm } from "./PreparationSectionForm"
import { RecipeDetailsCardForm } from "./RecipeDetailsCardForm"
import { RichButton } from "@/components/ui/RichButton"
import { RecipeLayout } from "@/components/layout/RecipeLayout"
import { FormTextArea } from "@/components/ui/FormTextArea"
import { z } from "zod"

export const ingredientItemSchema = z.object({
  name: z.string().min(0),
  amount: z.number().positive().optional(),
  unit: z.string().min(0),
  notes: z.string().nullable().optional(),
})

export const ingredientCategorySchema = z.object({
  position: z.number(),
  title: z.string().nullable().optional(),
  items: z.array(ingredientItemSchema).min(0),
})

export const stepSchema = z.object({
  title: z.string().optional(),
  description: z.string().min(0),
})

export const recipeFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(0),
  description: z.string().min(0),
  details: z.object({
    author: z.string().min(0),
    portions: z.number().int().positive(),
    lastUpdated: z.string(),
  }),
  ingredients: z.array(ingredientCategorySchema).min(0),
  steps: z.array(stepSchema).min(0),
})

export type RecipeFormData = z.infer<typeof recipeFormSchema>

interface Props {
  onSubmit: (data: RecipeFormData) => Promise<void>
}

export function RecipeForm({ onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    handleApiSubmit,
    formState: { errors },
  } = useFormWithApi<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      details: {
        author: "",
        portions: undefined,
        lastUpdated: new Date().toISOString(),
      },
      ingredients: [
        {
          position: 1,
          title: "",
          items: [{ name: "", amount: undefined, unit: "", notes: null }],
        },
      ],
      steps: [{ title: "", description: "" }],
    },
  })

  return (
    <form onSubmit={handleSubmit(handleApiSubmit(onSubmit))} className="mx-auto max-w-5xl">
      <RecipeLayout
        header={
          <div className="space-y-4 text-center">
            <div className="flex flex-col gap-6">
              <div className="space-y-3 text-center">
                <FormTextArea
                  {...register("title")}
                  placeholder="Recipe Title"
                  error={errors.title}
                  className="text-center text-3xl font-bold outline-none"
                />
                <FormTextArea
                  {...register("description")}
                  placeholder="Recipe description"
                  error={errors.title}
                  className="w-full resize-none bg-transparent text-center text-(--text-secondary) outline-none"
                />
              </div>
            </div>
          </div>
        }
        details={<RecipeDetailsCardForm register={register} errors={errors.details} />}
        ingredients={<IngredientsSectionForm control={control} register={register} errors={errors.ingredients}/>}
        preparation={<PreparationSectionForm control={control} register={register} errors={errors.steps} />}
        footer={
          <div className="p-8">
            <RichButton type="submit" variant="primary" className="w-full">
              Save recipe
            </RichButton>
          </div>
        }
        variant="edit"
      />
    </form>
  )
}
