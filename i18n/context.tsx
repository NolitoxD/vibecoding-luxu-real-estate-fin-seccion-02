"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Dictionary } from "./config";

type I18nContextType = {
  dictionary: Dictionary;
  locale: string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({
  children,
  dictionary,
  locale,
}: {
  children: ReactNode;
  dictionary: Dictionary;
  locale: string;
}) => {
  return (
    <I18nContext.Provider value={{ dictionary, locale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }

  const { dictionary, locale } = context;

  // Function to get nested keys and replace variables
  const t = (key: string, variables?: Record<string, string | number>) => {
    const keys = key.split(".");
    let value: unknown = dictionary;

    for (const k of keys) {
      if (value === undefined || typeof value !== "object" || value === null) break;
      value = (value as Record<string, unknown>)[k];
    }

    if (value === undefined || typeof value !== "string") {
      console.warn(`Translation missing for key: ${key}`);
      return key; // Fallback to key
    }

    let text = value;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), String(v));
      });
    }

    return text;
  };

  return { t, locale };
};
