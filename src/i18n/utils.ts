import { defaultLang } from "@/models.ts";
import type { Lang } from "@/models.ts";
import { plurals, ui } from "./ui";
import type { PluralForms, PluralKey, UiKey } from "./ui";

export const isLang = (value: string): value is Lang => {
  return value in ui;
};

export function useTranslations(lang: Lang) {
  return function t(key: UiKey) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function getPluralForms(lang: Lang, key: PluralKey): PluralForms {
  return plurals[lang]?.[key] ?? plurals[defaultLang][key];
}

// Replaces `{token}` placeholders in a translation string with provided
// values. Pair with `set:html` when the values contain trusted markup
// (e.g. anchors built from config), keeping URLs out of the dictionary.
export function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}
