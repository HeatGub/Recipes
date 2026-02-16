import { useTranslation } from "react-i18next";
import { Earth } from "lucide-react"

export const LangSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === "pl" ? "en" : "pl";
    i18n.changeLanguage(newLang);
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
        bg-(--bg-secondary)
        text-s
        leading-none
        transition-colors duration-300
        hover:bg-(--accent-primary)
        hover:text-(--text-inverted)
      "
    >
    <Earth className="h-4 w-4"/>
    {i18n.language === "pl" ? "PL" : "EN"}
    </button>
  );
};
