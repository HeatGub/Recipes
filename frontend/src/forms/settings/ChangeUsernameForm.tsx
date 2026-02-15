import { useTranslation } from "react-i18next"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SyncLoader from "react-spinners/SyncLoader"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
// import { FormGlobalError } from "@/forms/core/FormErrors"
import { rhfMessage } from "@/forms/core/apiErrors"
import { MIN_IDENTIFIER_LEN, MAX_IDENTIFIER_LEN, MIN_PASSWORD_LEN, MAX_PASSWORD_LEN } from "@/forms/core/constants"
import { SettingsFormInput } from "@/components/ui/SettingsFormInput"
import { useAuth } from "@/auth/useAuth"

export const changeUsernameSchema = z.object({
  username_current: z.string(),
  username_new: z.string().superRefine((val, ctx) => {
    if (val.length < MIN_IDENTIFIER_LEN) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({
          code: "VALIDATION.USERNAME_TOO_SHORT",
          params: { min: MIN_IDENTIFIER_LEN },
        }),
      })
    }

    if (val.length > MAX_IDENTIFIER_LEN) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({
          code: "VALIDATION.USERNAME_TOO_LONG",
          params: { max: MAX_IDENTIFIER_LEN },
        }),
      })
    }
  }),

  password: z.string().superRefine((val, ctx) => {
    if (val.length < MIN_PASSWORD_LEN) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({
          code: "VALIDATION.PASSWORD_TOO_SHORT",
          params: { min: MIN_PASSWORD_LEN },
        }),
      })
    }

    if (val.length > MAX_PASSWORD_LEN) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({
          code: "VALIDATION.PASSWORD_TOO_LONG",
          params: { max: MAX_PASSWORD_LEN },
        }),
      })
    }
  }),
})

export type ChangeUsernameFormData = z.infer<typeof changeUsernameSchema>

interface ChangeUsernameFormProps {
  onSubmit: (data: ChangeUsernameFormData) => Promise<void> | void
}

export function ChangeUsernameForm({ onSubmit }: ChangeUsernameFormProps) {
  const { t } = useTranslation()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    handleApiSubmit,
    formState: { errors, isSubmitting },
  } = useFormWithApi<ChangeUsernameFormData>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: {
      username_current: String(user?.username),
      username_new: "",
      password: "",
    },
  })

  return (
    <form
      id="change-username-form"
      onSubmit={handleSubmit(handleApiSubmit(onSubmit))}
      className={`relative space-y-1 text-sm transition ${
        isSubmitting ? "pointer-events-none opacity-70 blur-[1px]" : ""
      }`}
    >
      {isSubmitting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <SyncLoader size={8} color="var(--accent-primary)" />
        </div>
      )}

      {/* CURRENT USERNAME */}
      <SettingsFormInput
        label={t("account.username")}
        initialMessage="Your current Username"
        inputProps={{
          ...register("username_current"),
          readOnly: true,
        }}
      />

      {/* NEW USERNAME */}
      <SettingsFormInput
        label={t("account.username")}
        error={errors.username_new}
        initialMessage="Enter Your new Username"
        inputProps={{
          ...register("username_new"),
        }}
      />

      {/* PASSWORD */}
      <SettingsFormInput
        label={t("account.password")}
        type="password"
        error={errors.password}
        initialMessage="Enter your password to confirm"
        border={false}
        inputProps={register("password")}
      />

      {/* <p className="text-s mt-1 text-center text-(--text-warning)">
        <FormGlobalError error={errors.root?.message} />
      </p> */}
    </form>
  )
}
