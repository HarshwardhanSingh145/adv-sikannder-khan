import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations, Language, TranslationDict } from "../translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
  isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Retrieve saved language preference from localStorage if available
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("advocate_sikandar_lang") as Language;
      if (savedLang === "en" || savedLang === "hi") {
        setLanguageState(savedLang);
      }
    } catch (e) {
      // Storage unavailable or quota exceeded
    }
  }, []);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    setIsTransitioning(true);
    // Smooth transition: 200ms fade out, translate, 200ms fade in
    setTimeout(() => {
      setLanguageState(lang);
      try {
        localStorage.setItem("advocate_sikandar_lang", lang);
      } catch (e) {
        // Storage unavailable or quota exceeded
      }
      // Wait for re-render before fading back in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isTransitioning }}>
      <div
        className={`transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        style={{
          fontFamily: language === "hi" ? "var(--font-hi-sans)" : "var(--font-sans)",
        }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
