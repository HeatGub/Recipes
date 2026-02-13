import { useState } from "react"
import { useTranslation } from "react-i18next"

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState("change_username")
  const { t } = useTranslation()

  const tabs = [
    { id: "change_username", label: t("account.change_username") },
    { id: "change_password", label: t("account.change_password") },
    { id: "change_email", label: t("account.change_email") },
    { id: "delete_account", label: t("account.delete_account") },
    { id: "placeholder_1", label: "Placeholder 1" },
    { id: "placeholder_2", label: "Placeholder 2" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "change_username":
        return <div>Form to change username</div>
      case "change_password":
        return <div>Form to change password</div>
      case "change_email":
        return <div>Form to change email</div>
      case "delete_account":
        return <div>Delete account</div>
      case "placeholder_1":
        return <div>Placeholder 1 settings</div>
      case "placeholder_2":
        return <div>Placeholder 2 settings</div>
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-3 flex w-full flex-col gap-2 border-b pb-3 md:flex-row md:flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`w-full min-w-0 rounded-md px-4 py-2 text-center font-medium wrap-break-word transition-colors md:flex-1 ${
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
      <div className="rounded-md bg-(--bg-secondary) p-4 shadow-md">{renderTabContent()}</div>
    </div>
  )
}
