import type { Lang } from "@/models.ts";

/**
 * The archive's controls live in the layout's sidebar and its list in the main
 * column, so they are two islands in two different grid cells and cannot share
 * component state. Both import this module instead — one instance per page,
 * which is what the bundler gives an entry graph that pulls it in twice.
 */
class ArchiveState {
  /** Locales the list is filtered to. Never empty: one chip always stays on. */
  languages = $state<Lang[]>([]);
  /** Debounced by the search field, so it lags the input by one tick. */
  query = $state("");
  /**
   * Written by the list once it has rendered. `null` while prerendering, where
   * the sidebar renders first and has to fall back to its own count prop.
   */
  resultCount = $state<number | null>(null);

  #seededFor: Lang | null = null;

  /**
   * Seeded from the page's `lang` rather than set in an `$effect`: effects do
   * not run during SSR, so an empty initial value made the prerendered archive
   * render zero posts and flash the empty state until hydration. Both islands
   * call it, and it is keyed by locale so a prerender of the other locale
   * re-seeds rather than inheriting the previous page's selection.
   */
  seed(lang: Lang) {
    if (this.#seededFor === lang) return;

    this.#seededFor = lang;
    this.languages = [lang];
    this.query = "";
    this.resultCount = null;
  }

  toggleLanguage(lang: Lang) {
    if (!this.languages.includes(lang)) {
      this.languages = [...this.languages, lang];
      return;
    }

    const next = this.languages.filter((selected) => selected !== lang);
    if (next.length > 0) this.languages = next;
  }
}

export const archive = new ArchiveState();
