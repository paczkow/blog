// Zero-dependency language config + routing helpers.
// Kept free of `zod` (and any value imports) so it can be safely bundled into
// client islands without dragging the content schema into the browser.

export const languages = {
  en: "English",
  pl: "Polski",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang = "en" satisfies Lang;

export const localizeUrl = (lang: Lang, path = "/") => {
  const suffix = path.replace(/^\/+|\/+$/g, "");
  const prefix = lang === defaultLang ? "" : `/${lang}`;
  return (suffix ? `${prefix}/${suffix}` : prefix) || "/";
};
