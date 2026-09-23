import type { Lang } from "./config";

const en = {
  "common.locale": "en-US",
  "common.home": "Home",
  "common.writing": "Writing",
  "common.allWriting": "All writing",
  "common.readTime": "min read",
  // The ruled post rows meter the read time into a 96px mono column, where the
  // sentence form the article header can afford does not fit.
  "common.readTimeShort": "min",
  "common.breadcrumb": "Breadcrumb",
  "common.links": "Links",

  // The hero is a typed terminal line plus a static subline, both handed to
  // `HeroTerminal`. The `<span>` fragments mark what is emphasized and carry no
  // classes: the component splits the string into characters to type and
  // supplies the colour itself, which keeps the palette out of the copy. Each
  // locale picks its own emphasis, punctuation and word order.
  "home.hero.terminal":
    "I'm figuring out how to <span>build and learn with AI</span>, in public.",
  "home.hero.subline":
    "Ten years in product engineering. I write about what I build, what goes wrong, and what I learn along the way.",
  "home.nav.sections": "Sections",
  "home.nav.writing": "Writing",
  "home.nav.experience": "Experience",
  // The section's label only. Its content — roles, blurbs, achievements,
  // education — is structured rather than flat, so it lives in `experience.ts`.
  "home.experience.heading": "Experience",
  "home.heatmap.title": "Last posts",
  "home.heatmap.noWriting": "No posts",

  "writingArchive.pageTitle": "Writing - paczkow.me",
  "writingArchive.current": "Writing",
  "writingArchive.section": "Writing",
  "writingArchive.title": "Find my writing here",
  "writingArchive.description":
    "Everything published so far, in English and Polish.",
  // Shown instead of the line above while every locale but one is paused, so
  // the sidebar does not promise a language the archive no longer lists.
  "writingArchive.descriptionSingle": "Everything published so far.",
  // Mono breadcrumb crumbs: lowercase and short, because the sentence-case
  // `common.*` labels break the 12px mono rhythm of the sidebar.
  "writingArchive.crumbHome": "home",
  "writingArchive.crumbCurrent": "writing",
  "writingArchive.searchPlaceholder": "Search",
  "writingArchive.searchLanguage": "Search language",
  "writingArchive.clearSearch": "Clear search",
  "writingArchive.columnTitle": "Title",
  "writingArchive.columnMeta": "Date · read",
  // The archive's meta column is 96px wide, so the read time is a unit rather
  // than the sentence `common.readTime` spells out.
  "writingArchive.readTimeShort": "min",
  "writingArchive.empty.count": "0 results",
  "writingArchive.empty.broken": "The thread is broken.",
  "writingArchive.empty.quiet": "The archive is quiet.",
  "writingArchive.empty.noResults": "No articles connect to",
  "writingArchive.empty.tryAnother": "Try another word.",
  "writingArchive.empty.empty": "Nothing here yet — check back soon.",
  "writingArchive.empty.imageTitle": "A broken connection between two clusters",

  "notFound.pageTitle": "404 - paczkow.me",
  "notFound.eyebrow": "Error 404",
  "notFound.title": "The thread breaks here",
  "notFound.body":
    "The page you followed doesn't exist, or it moved. The link points to a node that isn't in the graph — but nothing stays lost here for long.",
  "notFound.home": "Back home",
  "notFound.writing": "Browse writing",
  "notFound.imageTitle": "A broken connection between two clusters",
  "notFound.meta.statusLabel": "status",
  "notFound.meta.nodeLabel": "node",
  "notFound.meta.nodeValue": "not in graph",
  "notFound.meta.linksLabel": "links",
  "notFound.meta.linksValue": "0",

  "article.titleAria": "Article title",
  "article.breadcrumbWriting": "All Writing",
  // Mono breadcrumb crumbs, kept short and lowercase — the full-length
  // `common.*` labels do not fit the 12px mono rhythm of the top bar.
  "article.crumbHome": "home",
  "article.crumbWriting": "writing",
  "article.onThisPage": "On this page",
  // Follows the percentage under the contents rail: "42% read".
  "article.read": "read",
  "article.end": "End of article",
  "article.figureLabel": "fig.",
  "article.backToList": "Back to the list",
  "article.older": "older",

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
  "common.readTimeShort": "min",
  "common.breadcrumb": "Ścieżka nawigacji",
  "common.links": "Linki",

  "home.hero.terminal":
    "Sprawdzam, jak <span>budować i uczyć się z AI</span> — publicznie.",
  "home.hero.subline":
    "Dziesięć lat w inżynierii produktu. Piszę o tym, co buduję, co idzie nie tak i czego się przy tym uczę.",
  "home.nav.sections": "Sekcje",
  "home.nav.writing": "Wpisy",
  "home.nav.experience": "Doświadczenie",
  "home.experience.heading": "Doświadczenie",
  "home.heatmap.title": "Ostatnie wpisy",
  "home.heatmap.noWriting": "Brak wpisów",

  "writingArchive.pageTitle": "Wpisy - paczkow.me",
  "writingArchive.current": "Wpisy",
  "writingArchive.section": "Wpisy",
  "writingArchive.title": "Tu znajdziesz moje wpisy",
  "writingArchive.description":
    "Wszystko, co dotąd opublikowałem, po angielsku i po polsku.",
  "writingArchive.descriptionSingle": "Wszystko, co dotąd opublikowałem.",
  "writingArchive.crumbHome": "start",
  "writingArchive.crumbCurrent": "wpisy",
  "writingArchive.searchPlaceholder": "Wyszukaj",
  "writingArchive.searchLanguage": "Język wyszukiwania",
  "writingArchive.clearSearch": "Wyczyść wyszukiwanie",
  "writingArchive.columnTitle": "Tytuł",
  "writingArchive.columnMeta": "Data · czas",
  "writingArchive.readTimeShort": "min",
  "writingArchive.empty.count": "0 wyników",
  "writingArchive.empty.broken": "Wątek się urwał.",
  "writingArchive.empty.quiet": "Archiwum jest ciche.",
  "writingArchive.empty.noResults": "Żaden wpis nie pasuje do",
  "writingArchive.empty.tryAnother": "Spróbuj innego słowa.",
  "writingArchive.empty.empty": "Na razie nic tu nie ma — zajrzyj później.",
  "writingArchive.empty.imageTitle":
    "Przerwane połączenie między dwoma klastrami",

  "notFound.pageTitle": "404 - paczkow.me",
  "notFound.eyebrow": "Błąd 404",
  "notFound.title": "Tu urywa się wątek",
  "notFound.body":
    "Strona, którą otworzyłeś, nie istnieje albo została przeniesiona. Odnośnik prowadzi do węzła, którego nie ma w grafie — ale tutaj nic nie ginie na długo.",
  "notFound.home": "Wróć na stronę główną",
  "notFound.writing": "Przeglądaj wpisy",
  "notFound.imageTitle": "Przerwane połączenie między dwoma klastrami",
  "notFound.meta.statusLabel": "status",
  "notFound.meta.nodeLabel": "węzeł",
  "notFound.meta.nodeValue": "brak w grafie",
  "notFound.meta.linksLabel": "odnośniki",
  "notFound.meta.linksValue": "0",

  "article.titleAria": "Tytuł wpisu",
  "article.breadcrumbWriting": "Wpisy",
  "article.crumbHome": "start",
  "article.crumbWriting": "wpisy",
  "article.onThisPage": "Na tej stronie",
  "article.read": "przeczytano",
  "article.end": "Koniec wpisu",
  "article.figureLabel": "rys.",
  "article.backToList": "Wróć do listy",
  "article.older": "starszy",

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
