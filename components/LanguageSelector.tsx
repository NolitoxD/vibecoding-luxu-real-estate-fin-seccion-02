"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/context";
import { setLocale } from "@/app/actions/i18n";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export default function LanguageSelector() {
  const { locale } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === locale) {
      setIsOpen(false);
      return;
    }

    setIsPending(true);
    await setLocale(langCode);
    setIsOpen(false);
    setIsPending(false);

    // router.refresh() re-fetches all Server Components with the new locale cookie
    // without triggering a full page reload, avoiding the stream error flash.
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors text-nordic"
        aria-label="Select Language"
      >
        <span className="text-xl">{currentLang.flag}</span>
        <span className="text-sm font-medium hidden sm:block">
          {currentLang.code.toUpperCase()}
        </span>
        <span
          className={`material-icons text-sm transition-transform duration-200 font-material-icons ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-nordic/5 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-mosque/5 ${
                locale === lang.code
                  ? "text-mosque font-medium bg-mosque/5"
                  : "text-nordic-muted hover:text-nordic"
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              {lang.name}
              {locale === lang.code && (
                <span className="material-icons text-mosque ml-auto text-[18px] font-material-icons">
                  check
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
