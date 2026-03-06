import { useTranslation } from "react-i18next";
import { Earth } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useEffect } from "react"

export const LangSwitcher = () => {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useLocalStorage<"en" | "pl">("language", "en")

  useEffect(() => {
     i18n.changeLanguage(language)
  }, [language, i18n]);

  const toggleLang = () => {
    setLanguage(language === "pl" ? "en" : "pl")
  };

  return (
    <button
      onClick={toggleLang}
       className="
        h-8
        cursor-pointer
        flex items-center justify-center
        gap-1
        px-2 py-0
        rounded
        text-s
        leading-none
        transition-colors duration-300
        bg-(--bg-primary)
        hover:bg-(--accent-primary)
        hover:text-(--text-inverted)
      "
    >
    <Earth className="h-4 w-4"/>
    {language === "pl" ? "PL" : "EN"}
    </button>
  );
};
