// Zero-dependency language config + routing helpers.
// Kept free of `zod` (and any value imports) so it can be safely bundled into
// client islands without dragging the content schema into the browser.

export const languages = {
  en: "English",
  pl: "Polski",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang = "en" satisfies Lang;

// Per-locale kill switch. Flip a flag to `false` to pause that version of the
// site: its routes stop being generated, its posts drop out of the archive,
// feeds and heatmap, and the language switcher hides it — while the content,
// translations and page code all stay in place, so flipping it back is the
// whole re-launch. The default locale is the site itself and cannot be paused.
export const enabledLangs: Record<Lang, boolean> = {
  en: true,
  pl: false,
};

export const isLangEnabled = (lang: Lang) =>
  lang === defaultLang || enabledLangs[lang];

// The one list every caller reads: routing, alternates, the switcher, the
// archive chips and the sitemap all derive from it, so a flipped flag reaches
// all of them at once.
export const activeLangs = (Object.keys(languages) as Lang[]).filter(
  isLangEnabled,
);

export const localizeUrl = (lang: Lang, path = "/") => {
  const suffix = path.replace(/^\/+|\/+$/g, "");
  const prefix = lang === defaultLang ? "" : `/${lang}`;
  return (suffix ? `${prefix}/${suffix}` : prefix) || "/";
};
