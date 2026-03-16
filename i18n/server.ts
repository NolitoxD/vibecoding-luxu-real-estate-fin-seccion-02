import { cookies } from 'next/headers';
import enDict from './dictionaries/en.json';
import esDict from './dictionaries/es.json';
import frDict from './dictionaries/fr.json';

const dictionaries = {
  en: enDict,
  es: esDict,
  fr: frDict,
};

export async function getDictionary() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as keyof typeof dictionaries;
  return dictionaries[locale] || dictionaries.en;
}

export async function getTranslation() {
  const dict = await getDictionary();
  
  const t = (key: string, variables?: Record<string, string | number>) => {
    const keys = key.split(".");
    let value: unknown = dict;

    for (const k of keys) {
      if (value === undefined || typeof value !== 'object' || value === null) break;
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

  return { t };
}
