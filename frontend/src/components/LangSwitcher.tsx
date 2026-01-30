import { useTranslation } from "react-i18next";

export const LangSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === "pl" ? "en" : "pl";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLang}
      className="px-2 py-1 border rounded bg-(--bg-secondary)"
    >
      {i18n.language === "pl" ? "EN" : "PL"}
    </button>
  );
};
