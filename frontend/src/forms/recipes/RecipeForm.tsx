import { zodResolver } from "@hookform/resolvers/zod"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
import { IngredientsSectionForm } from "./IngredientsSectionForm"
import { PreparationSectionForm } from "./PreparationSectionForm"
import { RecipeDetailsCardForm } from "./RecipeDetailsCardForm"
import { RichButton } from "@/components/ui/RichButton"
import { RecipeLayout } from "@/components/layout/RecipeLayout"
import { FormTextArea } from "@/components/ui/FormTextArea"
import { z } from "zod"
import { FormProvider } from "react-hook-form"
import {
  minString,
  maxString,
  stringRequired,
  forbiddenCharacters,
  numberRequired,
  minNumber,
  maxNumber,
  preprocessNumber,
  integerRequired,
} from "@/forms/core/zodValidators"
import { RECIPE } from "@/forms/core/constants"

export const ingredientItemSchema = z.object({
  name: z.string().min(0),
  amount: z
    .preprocess(preprocessNumber, z.number().optional())
    .superRefine(numberRequired())
    .superRefine(minNumber(RECIPE.INGREDIENTS.ITEM.AMOUNT.MIN))
    .superRefine(maxNumber(RECIPE.INGREDIENTS.ITEM.AMOUNT.MAX)),
  unit: z.string().min(0),
  notes: z.string().nullable().optional(),
})

export const ingredientCategorySchema = z.object({
  title: z.string().nullable().optional(),
  items: z.array(ingredientItemSchema).min(0),
})

export const stepSchema = z.object({
  title: z.string().optional(),
  description: z.string().min(0),
})

export const detailsSchema = z.object({
  author: z.string().optional(),
  lastUpdated: z.string(),
  servings: z
    .preprocess(preprocessNumber, z.number().optional())
    .superRefine(numberRequired())
    .superRefine(integerRequired())
    .superRefine(minNumber(RECIPE.SERVINGS.MIN))
    .superRefine(maxNumber(RECIPE.SERVINGS.MAX)),
})

export const recipeFormSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .optional() // just to avoid zod custom message
    .superRefine(stringRequired())
    .superRefine(minString(RECIPE.TITLE.MIN))
    .superRefine(maxString(RECIPE.TITLE.MAX))
    .superRefine(forbiddenCharacters(RECIPE.TITLE.FORBIDDEN_CHARS)),
  description: z
    .string()
    .optional()
    .superRefine(stringRequired())
    .superRefine(minString(RECIPE.DESCRIPTION.MIN))
    .superRefine(maxString(RECIPE.DESCRIPTION.MAX))
    .superRefine(forbiddenCharacters(RECIPE.DESCRIPTION.FORBIDDEN_CHARS)),
  details: detailsSchema,
  ingredients: z.array(ingredientCategorySchema).min(1),
  steps: z.array(stepSchema).min(0),
})

export type RecipeFormData = z.infer<typeof recipeFormSchema>

export function RecipeForm() {
  const methods = useFormWithApi<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema) as any, // as any to stop TS complaining about number().optional()
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      details: {
        author: "",
        servings: undefined,
        lastUpdated: new Date().toISOString(),
      },
      ingredients: [
        {
          title: "",
          items: [{ name: "", amount: undefined, unit: "", notes: null }],
        },
      ],
      steps: [{ title: "", description: "" }],
    },
  })

  const {
    register,
    control,
    handleSubmit,
    handleApiSubmit,
    formState: { errors },
  } = methods

  const onSubmit = (data: RecipeFormData) => {
    const formattedData = {
      ...data,

      steps: data.steps.map((step, stepIndex) => ({
        ...step,
        position: stepIndex + 1,
      })),

      ingredients: data.ingredients.map((category, catIndex) => ({
        ...category,
        position: catIndex + 1,

        items: category.items.map((item, itemIndex) => ({
          ...item,
          position: itemIndex + 1,
        })),
      })),
    }
    console.log(formattedData)
    // console.log(...formattedData.ingredients[0].items)
    // console.log(formattedData.details.servings)
    // console.log(formattedData.ingredients[0].items[0].amount)
  }

  return (
    <FormProvider {...methods}>
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
                    error={errors.description}
                    className="w-full resize-none bg-transparent text-center text-(--text-secondary) outline-none"
                  />
                </div>
              </div>
            </div>
          }
          details={<RecipeDetailsCardForm register={register} errors={errors.details} />}
          ingredients={<IngredientsSectionForm control={control} register={register} errors={errors.ingredients} />}
          preparation={<PreparationSectionForm control={control} register={register} errors={errors.steps} />}
          footer={
            <div className="flex justify-center px-8 pb-8">
              <RichButton type="submit" variant="primary" className="w-40">
                Save recipe
              </RichButton>
            </div>
          }
          variant="edit"
        />
      </form>
    </FormProvider>
  )
}
