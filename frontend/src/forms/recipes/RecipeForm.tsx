import { zodResolver } from "@hookform/resolvers/zod"
import { useFormWithApi } from "@/hooks/useFormWithApi"
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
  minArrayLength,
  maxArrayLength,
} from "@/forms/core/zodValidators"
import { RECIPE } from "@/forms/core/constants"
import { useTranslation } from "react-i18next"

export const ingredientItemSchema = z.object({
  name: z
    .string()
    .optional() // just to avoid zod custom message
    .superRefine(stringRequired()) // real required validation
    .superRefine(minString(RECIPE.INGREDIENTS.ITEM.NAME.MIN))
    .superRefine(maxString(RECIPE.INGREDIENTS.ITEM.NAME.MAX))
    .superRefine(forbiddenCharacters(RECIPE.INGREDIENTS.ITEM.NAME.FORBIDDEN_CHARS)),
  amount: z
    .preprocess(preprocessNumber, z.number().optional())
    .superRefine(numberRequired())
    .superRefine(minNumber(RECIPE.INGREDIENTS.ITEM.AMOUNT.MIN))
    .superRefine(maxNumber(RECIPE.INGREDIENTS.ITEM.AMOUNT.MAX)),
  unit: z
    .string()
    .optional()
    .superRefine(stringRequired())
    .superRefine(minString(RECIPE.INGREDIENTS.ITEM.UNIT.MIN))
    .superRefine(maxString(RECIPE.INGREDIENTS.ITEM.UNIT.MAX))
    .superRefine(forbiddenCharacters(RECIPE.INGREDIENTS.ITEM.UNIT.FORBIDDEN_CHARS)),
  notes: z
    .string()
    .optional()
    .superRefine(minString(RECIPE.INGREDIENTS.ITEM.NOTES.MIN))
    .superRefine(maxString(RECIPE.INGREDIENTS.ITEM.NOTES.MAX))
    .superRefine(forbiddenCharacters(RECIPE.INGREDIENTS.ITEM.NOTES.FORBIDDEN_CHARS)),
})

export const ingredientCategorySchema = z.object({
  title: z
    .string()
    .optional()
    .superRefine(minString(RECIPE.INGREDIENTS.CATEGORY.TITLE.MIN))
    .superRefine(maxString(RECIPE.INGREDIENTS.CATEGORY.TITLE.MAX))
    .superRefine(forbiddenCharacters(RECIPE.INGREDIENTS.CATEGORY.TITLE.FORBIDDEN_CHARS)),
  items: z
    .array(ingredientItemSchema)
    .optional()
    .superRefine(minArrayLength(RECIPE.INGREDIENTS.ITEM.MIN, "VALIDATION.INGREDIENTS_ITEMS_MIN"))
    .superRefine(maxArrayLength(RECIPE.INGREDIENTS.ITEM.MAX, "VALIDATION.INGREDIENTS_ITEMS_MAX")),
})

export const stepSchema = z.object({
  title: z
    .string()
    .optional()
    .superRefine(minString(RECIPE.PREPARATION_STEPS.TITLE.MIN))
    .superRefine(maxString(RECIPE.PREPARATION_STEPS.TITLE.MAX))
    .superRefine(forbiddenCharacters(RECIPE.PREPARATION_STEPS.TITLE.FORBIDDEN_CHARS)),
  description: z
    .string()
    .optional()
    .superRefine(stringRequired())
    .superRefine(minString(RECIPE.PREPARATION_STEPS.DESCRIPTION.MIN))
    .superRefine(maxString(RECIPE.PREPARATION_STEPS.DESCRIPTION.MAX))
    .superRefine(forbiddenCharacters(RECIPE.PREPARATION_STEPS.DESCRIPTION.FORBIDDEN_CHARS)),
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
    .optional()
    .superRefine(stringRequired())
    .superRefine(minString(RECIPE.TITLE.MIN))
    .superRefine(maxString(RECIPE.TITLE.MAX))
    .superRefine(forbiddenCharacters(RECIPE.TITLE.FORBIDDEN_CHARS)),
  description: z
    .string()
    .optional()
    .superRefine(minString(RECIPE.DESCRIPTION.MIN))
    .superRefine(maxString(RECIPE.DESCRIPTION.MAX))
    .superRefine(forbiddenCharacters(RECIPE.DESCRIPTION.FORBIDDEN_CHARS)),
  details: detailsSchema,
  ingredients: z
    .array(ingredientCategorySchema)
    .optional()
    .superRefine(minArrayLength(RECIPE.INGREDIENTS.CATEGORY.MIN, "VALIDATION.INGREDIENTS_CATEGORIES_MIN"))
    .superRefine(maxArrayLength(RECIPE.INGREDIENTS.CATEGORY.MAX, "VALIDATION.INGREDIENTS_CATEGORIES_MAX")),
  steps: z
    .array(stepSchema)
    .optional()
    .superRefine(minArrayLength(RECIPE.PREPARATION_STEPS.MIN, "VALIDATION.PREPARATION_STEPS_MIN"))
    .superRefine(maxArrayLength(RECIPE.PREPARATION_STEPS.MAX, "VALIDATION.PREPARATION_STEPS_MAX")),
})

export type RecipeFormData = z.infer<typeof recipeFormSchema>

export function RecipeForm() {
  const { t } = useTranslation()

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
          items: [{ name: "", amount: undefined, unit: "", notes: undefined }],
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
    // console.log(data)
    const formattedData = {
      ...data,

      steps: data.steps?.map((step, stepIndex) => ({
        ...step,
        position: stepIndex + 1,
      })),

      ingredients: data.ingredients?.map((category, catIndex) => ({
        ...category,
        position: catIndex + 1,

        items: category?.items?.map((item, itemIndex) => ({
          ...item,
          position: itemIndex + 1,
        })),
      })),
    }
    // console.log(formattedData)
    console.log(JSON.stringify(formattedData, null, 2))
    // console.log(...formattedData.ingredients[0].items)
    // console.log(formattedData.details.servings)
    // console.log(formattedData.ingredients[0].items[0].amount)
  }

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(handleApiSubmit(onSubmit))} className="mx-auto max-w-5xl">
        <RecipeLayout
          header={
            <div className="space-y-4 text-center">
              <div className="flex flex-col gap-6">
                <div className="space-y-3 text-center">
                  <FormTextArea
                    {...register("title")}
                    required
                    placeholder={t("recipe.title")}
                    error={errors.title}
                    className="text-center text-3xl font-bold"
                  />
                  <FormTextArea
                    {...register("description")}
                    placeholder={t("recipe.description")}
                    error={errors.description}
                    className="text-center text-(--text-secondary)"
                  />
                </div>
              </div>
            </div>
          }
          details={<RecipeDetailsCardForm register={register} errors={errors.details} />}
          ingredients={<IngredientsSectionForm control={control} register={register} errors={errors.ingredients} />}
          preparation={<PreparationSectionForm control={control} register={register} errors={errors.steps} />}
          footer={
            <div className="-mt-2 flex justify-center px-8 pb-4 sm:pb-8">
              <RichButton type="submit" variant="gradientPrimary" className="w-40">
                {t("recipe.publish_recipe")}
              </RichButton>
            </div>
          }
          variant="edit"
        />
      </form>
    </FormProvider>
  )
}
