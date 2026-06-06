import type { Lang } from "./config";

const en = {
  "common.locale": "en-US",
  "common.home": "Home",
  "common.writing": "Writing",
  "common.allWriting": "All Writing",
  "common.readTime": "min read",
  "common.breadcrumb": "Breadcrumb",
  "common.links": "Links",

  // Full sentence with inline markup; rendered via `set:html`. Each locale
  // controls its own punctuation and word order. The <span> emphasizes terms.
  "home.hero":
    'Connecting the dots across <span class="font-medium text-sand-12">creating</span>, <span class="font-medium text-sand-12">productivity</span>, and <span class="font-medium text-sand-12">learning</span> in the AI era.',
  "home.nav.sections": "Sections",
  "home.nav.writing": "Writing",
  "home.nav.about": "About",
  "home.about.heading": "About",
  "home.about.lede":
    "Ten years in product engineering — from a small software house to FAANG.",
  "home.about.body":
    "I'm deeply engaged in tools and methods for cognitive enhancement — Personal Knowledge Management, Zettelkasten, Obsidian, Anki, and AI — to learn faster, stay focused, and make sense of an increasingly noisy world.",
  // `{linkedin}` and `{bluesky}` tokens are replaced with anchors in frontmatter
  // so the URLs stay in config; rendered via `set:html`.
  "home.about.contact":
    "If something here resonates, find me on {linkedin} or {bluesky}.",
  "home.heatmap.title": "Last posts",
  "home.heatmap.noWriting": "No posts",

  "writingArchive.pageTitle": "Writing - paczkow.me",
  "writingArchive.current": "Writing",
  "writingArchive.section": "Writing",
  "writingArchive.title": "Find my writing here",
  "writingArchive.searchPlaceholder": "Search",
  "writingArchive.searchLanguage": "Search language",
  "writingArchive.empty.broken": "The thread is broken.",
  "writingArchive.empty.quiet": "The archive is quiet.",
  "writingArchive.empty.noResults": "No articles connect to",
  "writingArchive.empty.tryAnother": "Try another word.",
  "writingArchive.empty.empty": "Nothing here yet — check back soon.",
  "writingArchive.empty.imageTitle": "A broken connection between two clusters",

  "article.titleAria": "Article title",
  "article.breadcrumbWriting": "All Writing",

  "preferences.site": "Site preferences",
  "preferences.language": "Language",
  "preferences.switchToDark": "Switch to dark mode",
  "preferences.switchToLight": "Switch to light mode",
  "preferences.unavailableTooltip.en": "English",
  "preferences.unavailableTooltip.pl": "This article isn't available in Polish",
  "preferences.unavailableAria.en": "English",
  "preferences.unavailableAria.pl": "Polish — not available for this article",
} as const;

type UiKey = keyof typeof en;

const pl = {
  "common.locale": "pl-PL",
  "common.home": "Strona główna",
  "common.writing": "Wpisy",
  "common.allWriting": "Wszystkie wpisy",
  "common.readTime": "min czytania",
  "common.breadcrumb": "Ścieżka nawigacji",
  "common.links": "Linki",

  "home.hero":
    'Łączę kropki między <span class="font-medium text-sand-12">tworzeniem</span>, <span class="font-medium text-sand-12">produktywnością</span> i <span class="font-medium text-sand-12">nauką</span> w erze AI.',
  "home.nav.sections": "Sekcje",
  "home.nav.writing": "Wpisy",
  "home.nav.about": "O mnie",
  "home.about.heading": "O mnie",
  "home.about.lede":
    "Dziesięć lat w inżynierii produktu — od małego software house’u po FAANG.",
  "home.about.body":
    "Interesują mnie narzędzia i metody wzmacniania myślenia — Personal Knowledge Management, Zettelkasten, Obsidian, Anki i AI — żeby uczyć się szybciej, zachować skupienie i lepiej rozumieć złożony świat.",
  "home.about.contact":
    "Jeśli coś tutaj z Tobą rezonuje, znajdziesz mnie na {linkedin} albo {bluesky}.",
  "home.heatmap.title": "Ostatnie wpisy",
  "home.heatmap.noWriting": "Brak wpisów",

  "writingArchive.pageTitle": "Wpisy - paczkow.me",
  "writingArchive.current": "Wpisy",
  "writingArchive.section": "Wpisy",
  "writingArchive.title": "Tu znajdziesz moje wpisy",
  "writingArchive.searchPlaceholder": "Wyszukaj",
  "writingArchive.searchLanguage": "Język wyszukiwania",
  "writingArchive.empty.broken": "Wątek się urwał.",
  "writingArchive.empty.quiet": "Archiwum jest ciche.",
  "writingArchive.empty.noResults": "Żadne wpisy nie pasują do",
  "writingArchive.empty.tryAnother": "Spróbuj innego słowa.",
  "writingArchive.empty.empty": "Na razie nic tu nie ma — zajrzyj później.",
  "writingArchive.empty.imageTitle":
    "Przerwane połączenie między dwoma klastrami",

  "article.titleAria": "Tytuł wpisu",
  "article.breadcrumbWriting": "Wpisy",

  "preferences.site": "Preferencje strony",
  "preferences.language": "Język",
  "preferences.switchToDark": "Przełącz na tryb ciemny",
  "preferences.switchToLight": "Przełącz na tryb jasny",
  "preferences.unavailableTooltip.en":
    "Ten artykuł nie jest dostępny po angielsku",
  "preferences.unavailableTooltip.pl": "Polski",
  "preferences.unavailableAria.en": "Angielski — niedostępny dla tego artykułu",
  "preferences.unavailableAria.pl": "Polski",
} as const satisfies Record<UiKey, string>;

export const ui = {
  en,
  pl,
} as const satisfies Record<Lang, Record<UiKey, string>>;

export type PluralCategory = Intl.LDMLPluralRule;

// `other` is required as the CLDR fallback; the remaining categories are
// declared only for the languages that grammatically use them.
export type PluralForms = Partial<Record<PluralCategory, string>> & {
  other: string;
};

const enPlurals = {
  "writingArchive.articles": { one: "article", other: "articles" },
} as const satisfies Record<string, PluralForms>;

export type PluralKey = keyof typeof enPlurals;

const plPlurals = {
  "writingArchive.articles": {
    one: "wpis",
    few: "wpisy",
    many: "wpisów",
    other: "wpisów",
  },
} as const satisfies Record<PluralKey, PluralForms>;

export const plurals = {
  en: enPlurals,
  pl: plPlurals,
} as const satisfies Record<Lang, Record<PluralKey, PluralForms>>;

export type { UiKey };
