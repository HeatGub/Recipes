import { useState } from "react"
import { useTranslation } from "react-i18next"
import { SettingsSection } from "@/components/SettingsSection"
import { ChangeUsernameForm } from "@/forms/settings/ChangeUsernameForm"
import { ChangePasswordForm } from "@/forms/settings/ChangePasswordForm"
import { DeleteAccountForm } from "@/forms/settings/DeleteAccountForm"
import { ProfileHeader } from "@/components/ui/ProfileHeader"

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState("change_password")
  const { t } = useTranslation()

  const tabs = [
    { id: "change_username", label: t("account.settings.change_username") },
    { id: "change_password", label: t("account.settings.change_password") },
    { id: "change_email", label: t("account.settings.change_email") },
    { id: "delete_account", label: t("account.settings.delete_account") },
    { id: "placeholder_1", label: "Placeholder 1" },
    { id: "placeholder_2", label: "Placeholder 2" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "change_username":
        return (
          <SettingsSection
            title={t("account.settings.change_username")}
            description={t("account.settings.description.change_username")}
          >
            <ChangeUsernameForm onSubmit={() => new Promise((r) => setTimeout(r, 1000))}></ChangeUsernameForm>
          </SettingsSection>
        )
      case "change_password":
        return (
          <SettingsSection
            title={t("account.settings.change_password")}
            description={t("account.settings.description.change_password")}
          >
            <ChangePasswordForm></ChangePasswordForm>
          </SettingsSection>
        )
      case "change_email":
        return <div>Form to change email</div>
      case "delete_account":
        return (
          <SettingsSection
            title={t("account.settings.delete_account")}
            description={t("account.settings.description.delete_account")}
          >
            <DeleteAccountForm></DeleteAccountForm>
          </SettingsSection>
        )
      case "placeholder_1":
        return <div>Placeholder 1 settings</div>
      case "placeholder_2":
        return <div>Placeholder 2 settings</div>
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
