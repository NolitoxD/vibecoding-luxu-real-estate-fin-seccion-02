export const defaultLocale = "en";
export const locales = ["en", "es", "fr"] as const;
export type Locale = (typeof locales)[number];

// Type of the dictionary based on the en.json file
import enDict from "./dictionaries/en.json";
export type Dictionary = typeof enDict;

// Helper to get nested values safely
export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return (
    path
      .split(".")
      .reduce<unknown>((acc, part) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[part] : undefined), obj) || path
  ) as string;
}
