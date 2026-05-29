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
import { FormProvider, useWatch } from "react-hook-form"
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
import { useState, useMemo, useEffect } from "react"
import recipe2lang from "@/pages/recipe2lang.json"

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
  primaryLang: z.string(),
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
        langPrimary: {
          required: true,
          forbiddenChars: RECIPE.INGREDIENTS.ITEM.NAME.FORBIDDEN_CHARS,
          min: RECIPE.INGREDIENTS.ITEM.NAME.MIN,
          max: RECIPE.INGREDIENTS.ITEM.NAME.MAX,
        },
        langSecondary: {
          required: false,
          forbiddenChars: RECIPE.INGREDIENTS.ITEM.NAME.FORBIDDEN_CHARS,
          min: RECIPE.INGREDIENTS.ITEM.NAME.MIN,
          max: RECIPE.INGREDIENTS.ITEM.NAME.MAX,
        },
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
        langPrimary: {
          required: true,
          forbiddenChars: RECIPE.INGREDIENTS.ITEM.UNIT.FORBIDDEN_CHARS,
          min: RECIPE.INGREDIENTS.ITEM.UNIT.MIN,
          max: RECIPE.INGREDIENTS.ITEM.UNIT.MAX,
        },
        langSecondary: {
          required: false,
          forbiddenChars: RECIPE.INGREDIENTS.ITEM.UNIT.FORBIDDEN_CHARS,
          min: RECIPE.INGREDIENTS.ITEM.UNIT.MIN,
          max: RECIPE.INGREDIENTS.ITEM.UNIT.MAX,
        },
      },
      primaryFormLang
    ),
    notes: createLocalizedStringSchema(
      {
        langPrimary: {
          required: false,
          forbiddenChars: RECIPE.INGREDIENTS.ITEM.NOTES.FORBIDDEN_CHARS,
          min: RECIPE.INGREDIENTS.ITEM.NOTES.MIN,
          max: RECIPE.INGREDIENTS.ITEM.NOTES.MAX,
        },
        langSecondary: {
          required: false,
          forbiddenChars: RECIPE.INGREDIENTS.ITEM.NOTES.FORBIDDEN_CHARS,
          min: RECIPE.INGREDIENTS.ITEM.NOTES.MIN,
          max: RECIPE.INGREDIENTS.ITEM.NOTES.MAX,
        },
      },
      primaryFormLang
    ),
  })
}

function createIngredientCategorySchema(primaryFormLang: AvailableLangs) {
  return z.object({
    title: createLocalizedStringSchema(
      {
        langPrimary: {
          required: false,
          forbiddenChars: RECIPE.INGREDIENTS.CATEGORY.TITLE.FORBIDDEN_CHARS,
          min: RECIPE.INGREDIENTS.CATEGORY.TITLE.MIN,
          max: RECIPE.INGREDIENTS.CATEGORY.TITLE.MAX,
        },
        langSecondary: {
          required: false,
          forbiddenChars: RECIPE.INGREDIENTS.CATEGORY.TITLE.FORBIDDEN_CHARS,
          min: RECIPE.INGREDIENTS.CATEGORY.TITLE.MIN,
          max: RECIPE.INGREDIENTS.CATEGORY.TITLE.MAX,
        },
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
        langPrimary: {
          required: false,
          forbiddenChars: RECIPE.PREPARATION_STEPS.TITLE.FORBIDDEN_CHARS,
          min: RECIPE.PREPARATION_STEPS.TITLE.MIN,
          max: RECIPE.PREPARATION_STEPS.TITLE.MAX,
        },
        langSecondary: {
          required: false,
          forbiddenChars: RECIPE.PREPARATION_STEPS.TITLE.FORBIDDEN_CHARS,
          min: RECIPE.PREPARATION_STEPS.TITLE.MIN,
          max: RECIPE.PREPARATION_STEPS.TITLE.MAX,
        },
      },
      primaryFormLang
    ),
    description: createLocalizedStringSchema(
      {
        langPrimary: {
          required: true,
          forbiddenChars: RECIPE.PREPARATION_STEPS.DESCRIPTION.FORBIDDEN_CHARS,
          min: RECIPE.PREPARATION_STEPS.DESCRIPTION.MIN,
          max: RECIPE.PREPARATION_STEPS.DESCRIPTION.MAX,
        },
        langSecondary: {
          required: false,
          forbiddenChars: RECIPE.PREPARATION_STEPS.DESCRIPTION.FORBIDDEN_CHARS,
          min: RECIPE.PREPARATION_STEPS.DESCRIPTION.MIN,
          max: RECIPE.PREPARATION_STEPS.DESCRIPTION.MAX,
        },
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
        langPrimary: {
          required: true,
          forbiddenChars: RECIPE.TITLE.FORBIDDEN_CHARS,
          min: RECIPE.TITLE.MIN,
          max: RECIPE.TITLE.MAX,
        },
        langSecondary: {
          required: false,
          forbiddenChars: RECIPE.TITLE.FORBIDDEN_CHARS,
          min: RECIPE.TITLE.MIN,
          max: RECIPE.TITLE.MAX,
        },
      },
      primaryFormLang
    ),
    description: createLocalizedStringSchema(
      {
        langPrimary: {
          required: false,
          forbiddenChars: RECIPE.DESCRIPTION.FORBIDDEN_CHARS,
          min: RECIPE.DESCRIPTION.MIN,
          max: RECIPE.DESCRIPTION.MAX,
        },
        langSecondary: {
          required: false,
          forbiddenChars: RECIPE.DESCRIPTION.FORBIDDEN_CHARS,
          min: RECIPE.DESCRIPTION.MIN,
          max: RECIPE.DESCRIPTION.MAX,
        },
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

function mapRecipeToForm(data: any): RecipeFormData {
  return {
    title: {
      en: data.title?.en ?? "",
      pl: data.title?.pl ?? "",
    },

    description: {
      en: data.description?.en ?? "",
      pl: data.description?.pl ?? "",
    },

    details: {
      author: data.details?.author ?? "",
      primaryLang: data.details?.primaryLang ?? "en",
      lastUpdated: data.details?.lastUpdated ?? new Date().toISOString(),
      servings: data.details?.servings ?? undefined,
    },

    ingredients: (data.ingredients ?? [])
      .map((cat: any) => ({
        title: {
          en: cat.title?.en ?? "",
          pl: cat.title?.pl ?? "",
        },
        position: cat.position ?? 0,

        items: (cat.items ?? [])
          .map((item: any) => ({
            name: {
              en: item.name?.en ?? "",
              pl: item.name?.pl ?? "",
            },
            amount: item.amount ?? undefined,
            unit: {
              en: item.unit?.en ?? "",
              pl: item.unit?.pl ?? "",
            },
            notes: {
              en: item.notes?.en ?? "",
              pl: item.notes?.pl ?? "",
            },
            position: item.position ?? 0,
          }))
          .sort((a: any, b: any) => a.position - b.position), // Sort items
      }))
      .sort((a: any, b: any) => a.position - b.position), // Sort categories

    steps: (data.steps ?? [])
      .map((step: any) => ({
        title: {
          en: step.title?.en ?? "",
          pl: step.title?.pl ?? "",
        },
        description: {
          en: step.description?.en ?? "",
          pl: step.description?.pl ?? "",
        },
        position: step.position ?? 0,
      }))
      .sort((a: any, b: any) => a.position - b.position), // Sort steps
  }
}

export function RecipeForm() {
  const { t } = useTranslation()
  const [formLang, setFormLang] = useState<AvailableLangs>("en")
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
        primaryLang: "en",
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
    reset,
  } = methods

  const watchedPrimaryLang = useWatch({
    control,
    name: "details.primaryLang",
  })

  useEffect(() => {
    if (watchedPrimaryLang === "en" || watchedPrimaryLang === "pl") {
      setPrimaryFormLang(watchedPrimaryLang)
    }
  }, [watchedPrimaryLang])

  // 
  useEffect(() => {
    if (!recipe2lang) return
    const mappedData = mapRecipeToForm(recipe2lang)
    reset(mappedData)
    // console.log(JSON.stringify(recipe2lang, null, 2))
    console.log(JSON.stringify(mappedData, null, 2))

    if (mappedData.details?.primaryLang) {
      setPrimaryFormLang(mappedData.details.primaryLang as AvailableLangs)
    }
  }, [reset])

  useEffect(() => {
    if (!recipe2lang) return
    // console.log(JSON.stringify(recipe2lang, null, 2))
    reset(mapRecipeToForm(recipe2lang))
  }, [reset])

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
    console.log(JSON.stringify(formattedData, null, 2))
    console.log(JSON.stringify(formattedData.details.primaryLang, null, 2))
    // console.log(...formattedData.ingredients[0].items)
    // console.log(formattedData.details.servings)
    // console.log(formattedData.ingredients[0].items[0].amount)
    showToast("success", t("success.recipe_created"))
  }

  return (
    <>
      <FormProvider {...methods}>
        <form noValidate onSubmit={handleSubmit(handleApiSubmit(onSubmit))} className="mx-auto max-w-5xl">
          <RecipeLayout
            header={
              <div className="space-y-4 text-center">
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-center">
                    <div className="inline-flex gap-3">
                      <Button
                        type="button"
                        onClick={() => setFormLang("en")}
                        variant={formLang === "en" ? "primary" : "secondary"}
                        className="text-sm"
                      >
                        {t("recipe.locales.english_version")}
                        {primaryFormLang === "en" && ` (${t("recipe.locales.required")})`}
                      </Button>

                      <Button
                        type="button"
                        onClick={() => setFormLang("pl")}
                        variant={formLang === "pl" ? "primary" : "secondary"}
                        className="text-sm"
                      >
                        {t("recipe.locales.polish_version")}
                        {primaryFormLang === "pl" && ` (${t("recipe.locales.required")})`}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6 pt-2">
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
