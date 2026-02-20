import { useState } from "react"
import { useTranslation } from "react-i18next"
import { SettingsSection } from "@/components/settings/SettingsSection"
import { ChangeUsernameForm } from "@/forms/settings/ChangeUsernameForm"
import { ChangePasswordForm } from "@/forms/settings/ChangePasswordForm"
import { ChangeEmailForm } from "@/forms/settings/ChangeEmailForm"
import { DeleteAccountForm } from "@/forms/settings/DeleteAccountForm"
import { ProfileHeader } from "@/components/common/ProfileHeader"

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState("change_email")
  const { t } = useTranslation()

  const tabs = [
    { id: "change_username", label: t("account.settings.change_username") },
    { id: "change_password", label: t("account.settings.change_password") },
    { id: "change_email", label: t("account.settings.change_email") },
    { id: "delete_account", label: t("account.settings.delete_account") },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "change_username":
        return (
          <SettingsSection
            title={t("account.settings.change_username")}
            description={t("account.settings.description.change_username")}
          >
            <ChangeUsernameForm />
          </SettingsSection>
        )
      case "change_password":
        return (
          <SettingsSection
            title={t("account.settings.change_password")}
            description={t("account.settings.description.change_password")}
          >
            <ChangePasswordForm />
          </SettingsSection>
        )
      case "change_email":
        return (
          <SettingsSection
            title={t("account.settings.change_email")}
            description={t("account.settings.description.change_email")}
          >
            <ChangeEmailForm />
          </SettingsSection>
        )

      case "delete_account":
        return (
          <SettingsSection
            title={t("account.settings.delete_account")}
            description={t("account.settings.description.delete_account")}
          >
            <DeleteAccountForm />
          </SettingsSection>
        )
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ProfileHeader />
      <div className="mb-3 flex w-full flex-col gap-2 border-b pb-3 md:flex-row md:flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`w-full min-w-0 rounded-md px-4 py-2 text-center font-medium wrap-break-word transition-colors select-none md:flex-1 ${
              activeTab === tab.id
                ? "bg-(--accent-primary) text-(--text-inverted)"
                : "bg-(--bg-secondary) text-(--text-primary) hover:bg-(--bg-tertiary)"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-md bg-(--bg-secondary) p-2 shadow-md">{renderTabContent()}</div>
    </div>
  )
}
