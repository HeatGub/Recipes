import { zodResolver } from "@hookform/resolvers/zod"
import { useFormWithApi } from "@/hooks/useFormWithApi"
import { IngredientsSectionForm } from "./IngredientsSectionForm"
import { PreparationSectionForm } from "./PreparationSectionForm"
import { RecipeDetailsCardForm } from "./RecipeDetailsCardForm"
import { RichButton } from "@/components/ui/RichButton"
import { Button } from "@/components/ui/Button"
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
import { showToast } from "@/components/ui/Toasts"
import { useState, useMemo } from "react"

export type AvailableLangs = "en" | "pl"

type SingleLanguageSchemaArgs = {
  required?: boolean
  forbiddenChars: RegExp | null
  min: number
  max: number
}

type MultilangualObjectSchema = {
  langPrimary: SingleLanguageSchemaArgs
  langSecondary: SingleLanguageSchemaArgs
}

function createSingleLanguageSchema({ required = false, forbiddenChars = null, min, max }: SingleLanguageSchemaArgs) {
  let schema = z.string().optional() // optional just to avoid zod custom message

  if (required) {
    // real required validation
    schema = schema.superRefine(stringRequired())
  }

  if (forbiddenChars) {
    schema = schema.superRefine(forbiddenCharacters(forbiddenChars))
  }

  return schema.superRefine(minString(min)).superRefine(maxString(max))
}

function createLocalizedStringSchema(config: MultilangualObjectSchema, primaryLang: AvailableLangs) {
  return z.object({
    en: createSingleLanguageSchema(primaryLang === "en" ? config.langPrimary : config.langSecondary),

    pl: createSingleLanguageSchema(primaryLang === "pl" ? config.langPrimary : config.langSecondary),
  })
}

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

function createIngredientItemSchema(primaryFormLang: AvailableLangs) {
  return z.object({
    name: createLocalizedStringSchema(
      {
        langPrimary: { required: true, forbiddenChars: null, min: 1, max: 10 },
        langSecondary: { required: false, forbiddenChars: null, min: 1, max: 5 },
      },
      primaryFormLang
    ),
    amount: z
      .preprocess(preprocessNumber, z.number().optional())
      .superRefine(numberRequired())
      .superRefine(minNumber(RECIPE.INGREDIENTS.ITEM.AMOUNT.MIN))
      .superRefine(maxNumber(RECIPE.INGREDIENTS.ITEM.AMOUNT.MAX)),
    unit: createLocalizedStringSchema(
      {
        langPrimary: { required: true, forbiddenChars: null, min: 1, max: 10 },
        langSecondary: { required: false, forbiddenChars: null, min: 1, max: 5 },
      },
      primaryFormLang
    ),
    notes: createLocalizedStringSchema(
      {
        langPrimary: { required: false, forbiddenChars: null, min: 1, max: 10 },
        langSecondary: { required: false, forbiddenChars: null, min: 1, max: 5 },
      },
      primaryFormLang
    ),
  })
}

function createIngredientCategorySchema(primaryFormLang: AvailableLangs) {
  return z.object({
    title: createLocalizedStringSchema(
      {
        langPrimary: { required: false, forbiddenChars: null, min: 2, max: 10 },
        langSecondary: { required: false, forbiddenChars: null, min: 2, max: 5 },
      },
      primaryFormLang
    ),
    items: z
      .array(createIngredientItemSchema(primaryFormLang))
      .optional()
      .superRefine(minArrayLength(RECIPE.INGREDIENTS.ITEM.MIN, "VALIDATION.INGREDIENTS_ITEMS_MIN"))
      .superRefine(maxArrayLength(RECIPE.INGREDIENTS.ITEM.MAX, "VALIDATION.INGREDIENTS_ITEMS_MAX")),
  })
}

function createStepSchema(primaryFormLang: AvailableLangs) {
  return z.object({
    title: createLocalizedStringSchema(
      {
        langPrimary: { required: false, forbiddenChars: null, min: 2, max: 10 },
        langSecondary: { required: false, forbiddenChars: null, min: 2, max: 5 },
      },
      primaryFormLang
    ),
    description: createLocalizedStringSchema(
      {
        langPrimary: { required: true, forbiddenChars: null, min: 2, max: 10 },
        langSecondary: { required: false, forbiddenChars: null, min: 2, max: 5 },
      },
      primaryFormLang
    ),
  })
}

function createRecipeFormSchema(primaryFormLang: AvailableLangs) {
  return z.object({
    id: z.string().optional(),
    title: createLocalizedStringSchema(
      {
        langPrimary: { required: true, forbiddenChars: null, min: 2, max: 10 },
        langSecondary: { required: false, forbiddenChars: null, min: 2, max: 5 },
      },
      primaryFormLang
    ),
    description: createLocalizedStringSchema(
      {
        langPrimary: { required: false, forbiddenChars: null, min: 2, max: 10 },
        langSecondary: { required: false, forbiddenChars: null, min: 2, max: 5 },
      },
      primaryFormLang
    ),
    details: detailsSchema,
    ingredients: z
      .array(createIngredientCategorySchema(primaryFormLang))
      .optional()
      .superRefine(minArrayLength(RECIPE.INGREDIENTS.CATEGORY.MIN, "VALIDATION.INGREDIENTS_CATEGORIES_MIN"))
      .superRefine(maxArrayLength(RECIPE.INGREDIENTS.CATEGORY.MAX, "VALIDATION.INGREDIENTS_CATEGORIES_MAX")),
    steps: z
      .array(createStepSchema(primaryFormLang))
      .optional()
      .superRefine(minArrayLength(RECIPE.PREPARATION_STEPS.MIN, "VALIDATION.PREPARATION_STEPS_MIN"))
      .superRefine(maxArrayLength(RECIPE.PREPARATION_STEPS.MAX, "VALIDATION.PREPARATION_STEPS_MAX")),
  })
}

export type RecipeFormData = z.infer<ReturnType<typeof createRecipeFormSchema>>

export function RecipeForm() {
  const { t } = useTranslation()
  const [formLang, setformLang] = useState<AvailableLangs>("en")
  const [primaryFormLang, setPrimaryFormLang] = useState<AvailableLangs>("en")

  const recipeFormSchema = useMemo(() => createRecipeFormSchema(primaryFormLang), [primaryFormLang])

  const methods = useFormWithApi<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema) as any, // as any to stop TS complaining about number().optional()
    mode: "onChange",
    defaultValues: {
      title: {
        en: "",
        pl: "",
      },
      description: {
        en: "",
        pl: "",
      },
      details: {
        author: "",
        servings: undefined,
        lastUpdated: new Date().toISOString(),
      },
      ingredients: [
        {
          title: {
            en: "",
            pl: "",
          },
          items: [
            {
              name: {
                en: "",
                pl: "",
              },
              amount: undefined,
              unit: {
                en: "",
                pl: "",
              },
              notes: {
                en: "",
                pl: "",
              },
            },
          ],
        },
      ],
      steps: [
        {
          title: {
            en: "",
            pl: "",
          },
          description: {
            en: "",
            pl: "",
          },
        },
      ],
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
    showToast("success", t("success.recipe_created"))
  }

  return (
    <>
      {/* <RecipeTest/> */}
      <div className="flex flex-col justify-center gap-4 p-2 text-center">
        PRIMARY LANG
        <Button
          onClick={() => {
            setPrimaryFormLang("en")
          }}
          variant={primaryFormLang === "en" ? "primary" : "secondary"}
        >
          EN
        </Button>
        <Button
          onClick={() => {
            setPrimaryFormLang("pl")
          }}
          variant={primaryFormLang === "pl" ? "primary" : "secondary"}
        >
          PL
        </Button>
      </div>

      <div className="flex justify-center gap-4 p-2 text-center">
        <Button
          onClick={() => {
            setformLang("en")
          }}
          variant={formLang === "en" ? "primary" : "secondary"}
        >
          EN
        </Button>
        <Button
          onClick={() => {
            setformLang("pl")
          }}
          variant={formLang === "pl" ? "primary" : "secondary"}
        >
          PL
        </Button>
      </div>

      <FormProvider {...methods}>
        <form noValidate onSubmit={handleSubmit(handleApiSubmit(onSubmit))} className="mx-auto max-w-5xl">
          <RecipeLayout
            header={
              <div className="space-y-4 text-center">
                <div className="flex flex-col gap-6">
                  <div className="space-y-3 text-center">
                    {formLang === "en" && (
                      <FormTextArea
                        {...register("title.en")}
                        required
                        placeholder={t("recipe.title")}
                        error={errors?.title?.en}
                        className="text-center text-3xl font-bold"
                      />
                    )}
                    {formLang === "pl" && (
                      <FormTextArea
                        {...register("title.pl")}
                        required
                        placeholder={t("recipe.title")}
                        error={errors?.title?.pl}
                        className="text-center text-3xl font-bold"
                      />
                    )}

                    {formLang === "en" && (
                      <FormTextArea
                        {...register("description.en")}
                        placeholder={t("recipe.description")}
                        error={errors.description?.en}
                        className="text-center text-(--text-secondary)"
                      />
                    )}
                    {formLang === "pl" && (
                      <FormTextArea
                        {...register("description.pl")}
                        placeholder={t("recipe.description")}
                        error={errors.description?.pl}
                        className="text-center text-(--text-secondary)"
                      />
                    )}
                  </div>
                </div>
              </div>
            }
            details={<RecipeDetailsCardForm register={register} errors={errors.details} />}
            ingredients={
              <IngredientsSectionForm
                control={control}
                register={register}
                errors={errors.ingredients}
                formLang={formLang}
              />
            }
            preparation={
              <PreparationSectionForm control={control} register={register} errors={errors.steps} formLang={formLang} />
            }
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
    </>
  )
}
