import React from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  className?: string;
  variant?: "buttons" | "dropdown";
}

const languages = [
  { code: "ar" as Language, name: "العربية", flag: "🇲🇦" },
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
];

export function LanguageSelector({ className, variant = "buttons" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "dropdown") {
    return (
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className={cn(
          "bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          className
        )}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={cn("flex space-x-4", className)}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "text-sm transition-colors",
            language === lang.code
              ? "text-white font-medium"
              : "text-white/70 hover:text-white"
          )}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
