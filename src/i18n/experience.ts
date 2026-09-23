import type { Lang } from "@/i18n/config.ts";

/**
 * The work timeline the home page's Experience section renders — one entry per
 * role, newest first, plus the education row that closes it.
 *
 * Kept out of `ui.ts` because that dictionary is flat `key: string` pairs, and a
 * role is a record with a list of projects inside it. The translation story is
 * unchanged: one object per locale, checked against `Lang`.
 *
 * The reader is a stranger. They have never heard of Commerce Manager, they do
 * not know what revenue-at-risk means, and a bare percentage tells them nothing,
 * so:
 * - a closed row is only the company and the title. `story` opens the expanded
 *   row by saying, in one sentence, what the work is in general.
 * - each project is `title` (what it was for), `work` (what he did) and
 *   `result` (what changed). The reader can stop after any of the three.
 * - scale is spelled out and attached to the thing it measures; a percentage
 *   names what it is a percentage of. Every number is exact and none is
 *   inflated.
 * - `result` carries `<strong>` around the number itself, so it is rendered
 *   with `set:html`; the component supplies the colour, the copy has no classes.
 * - First person, past tense except the current role. At most one em dash per
 *   sentence.
 */
export type ExperienceProject = {
  /** What the work was for, in the reader's terms — not the internal project name. */
  title: string;
  /** What he actually did. */
  work: string;
  /** What changed because of it. Optional: not every piece of work has a number. */
  result?: string;
};

export type ExperienceRole = {
  company: string;
  /**
   * Job title, left in English in every locale: it is what the industry and the
   * resume both call the role, and half-translating it ("Senior Software
   * Engineer — moderacja") reads worse than either language on its own.
   */
  role: string;
  /** Preformatted for the locale — the component does no date maths. */
  from: string;
  to: string;
  /**
   * The work in general, above the projects: one sentence where projects follow,
   * or the whole account where a role has none. Carries `<strong>` around the
   * numbers, so it is rendered with `set:html` — the copy marks what matters,
   * the component colours it.
   */
  story: string;
  projects: ExperienceProject[];
};

export type ExperienceEducation = {
  /** Stands in for the dates cell, which education does not have. */
  label: string;
  institution: string;
  /** Degree and grade. The grade is given in the locale's own terms: a letter in English, the Polish 5 in Polish. */
  degree: string;
  /**
   * The registered thesis title, quoted verbatim including its wording. It is
   * the official title, not a sentence to tidy up.
   */
  thesis: string;
};

export type ExperienceContent = {
  /** Right-aligned range in the section header. */
  range: string;
  /** One sentence above the first row, at the same size as the Writing section's rows. */
  intro: string;
  /** Label before a project's outcome. */
  resultLabel: string;
  roles: ExperienceRole[];
  education: ExperienceEducation;
};

// Infor (Sep 2019 – Oct 2021) and Brainly (Nov 2019 – Aug 2023) overlap. The
// overlap comes from the source resume rather than from anything here, and the
// dates are shipped as they were given; correct them in one place when the real
// ranges are confirmed.
const en = {
  range: "2015 — now",
  intro:
    "From a small software house to FAANG — and a lot of rewrites in between.",
  resultLabel: "Result:",
  roles: [
    {
      company: "Meta",
      role: "Software Engineer — Catalog Interfaces (Monetization)",
      from: "Sep 2024",
      to: "Present",
      story:
        "I ship full-stack features in a large, interconnected codebase, taking work from system design through launch and experimentation.",
      projects: [
        {
          title: "Helping advertisers find and fix problems",
          work: "I designed the data model, built the GraphQL API and the React interface, and coordinated implementation across three teams.",
          result:
            "<strong>5% more ads fixed</strong> in a product area serving 107M+ daily active users.",
        },
        {
          title: "Making shared pages faster",
          work: "I led the migration of core React components from REST to GraphQL.",
          result:
            "Daily network queries fell from about <strong>500,000 to 100</strong>, and average latency improved by 5% across a surface with 535M+ daily active users.",
        },
      ],
    },
    {
      company: "Amazon",
      role: "Software Engineer — Ring",
      from: "May 2024",
      to: "Aug 2024",
      story:
        "I worked on Ring.com, where more than a million people a day explore Ring's cameras and doorbells.",
      projects: [
        {
          title: "Making the storefront faster",
          work: "I rebuilt how the site produces and delivers its assets, integrating custom delivery pipelines into its Next.js build.",
          result:
            "<strong>4% lower page load time</strong> on a storefront with 1M+ daily active users.",
        },
      ],
    },
    {
      company: "Brainly",
      role: "Senior Software Engineer — Moderation",
      from: "Nov 2019",
      to: "Aug 2023",
      story:
        "I worked on the internal app that moderators used to manage their daily review queue.",
      projects: [
        {
          title: "Keeping the queue current",
          work: "I replaced manual refreshes with a live Server-Sent Events feed.",
          result: "<strong>Moderation became 20% faster</strong>.",
        },
        {
          title: "Making workflows visible",
          work: "I built a telemetry module connected to the app's Redux state, giving the data team a clearer picture of how moderation work moved through the app.",
        },
        {
          title: "Growing the team",
          work: "I mentored two engineers who were both promoted from Mid-level to Senior within a year.",
        },
      ],
    },
    {
      company: "Infor",
      role: "Senior Software Engineer",
      from: "Sep 2019",
      to: "Oct 2021",
      story:
        "I worked on the performance-sensitive frontend of a real-time analytics platform that retail chains used to visualize store and sales data. I led a three-person, screen-by-screen migration of a five-year-old Angular app to React, <strong>reducing page latency by 10–20%</strong>. I also built a release automation tool that <strong>shortened deployments by 20%</strong>.",
      projects: [],
    },
    {
      company: "MLabs",
      role: "Software Engineer",
      from: "Sep 2015",
      to: "Jul 2019",
      story:
        "I worked on separate projects in very different areas: a reporting tool, an established web application, and an embedded fire-safety system. My work ranged from hands-on feature development to architecture and team leadership.",
      projects: [
        {
          title: "Reporting automation",
          work: "I built a web tool on AWS that generated the LaTeX documents through Lambda, replacing reports people had been putting together by hand.",
          result: "Users finished reports <strong>almost 30% faster</strong>.",
        },
        {
          title: "Frontend modernization",
          work: "I led a three-developer team rewriting an Angular application in React and shaping its new architecture.",
        },
        {
          title: "Embedded fire-safety system",
          work: "I designed and implemented a microservices architecture that made physical components easier to add or remove. I worked with hardware engineers to reduce system latency.",
        },
        {
          title: "Team development",
          work: "I conducted technical interviews and mentored junior developers.",
        },
      ],
    },
  ],
  education: {
    label: "Education",
    institution: "Poznań University of Technology",
    degree: "MSc in Computer Science, Grade A",
    thesis:
      "Thesis “Using Computer Vision in the process generating Responsive Websites Layouts”",
  },
} as const satisfies ExperienceContent;

const pl = {
  range: "2015 — teraz",
  intro:
    "Od małego software house’u po FAANG — i sporo przepisywania po drodze.",
  resultLabel: "Efekt:",
  roles: [
    {
      company: "Meta",
      role: "Software Engineer — Catalog Interfaces (Monetization)",
      from: "wrz 2024",
      to: "obecnie",
      story:
        "Dowożę funkcje full-stack w dużej, mocno powiązanej bazie kodu — od projektu systemu po wdrożenie i eksperyment.",
      projects: [
        {
          title: "Pomagam reklamodawcom znaleźć i naprawić błędy",
          work: "Zaprojektowałem model danych, zbudowałem API w GraphQL i interfejs w React, a wdrożenie koordynowałem w trzech zespołach.",
          result:
            "<strong>5% więcej naprawionych reklam</strong> w obszarze produktu, z którego korzysta ponad 107 mln osób dziennie.",
        },
        {
          title: "Przyspieszam współdzielone ekrany",
          work: "Poprowadziłem migrację głównych komponentów React z REST na GraphQL.",
          result:
            "Liczba zapytań sieciowych spadła z około <strong>500 000 do 100</strong> dziennie, a średnie opóźnienie poprawiło się o 5% na powierzchni z ponad 535 mln użytkowników dziennie.",
        },
      ],
    },
    {
      company: "Amazon",
      role: "Software Engineer — Ring",
      from: "maj 2024",
      to: "sie 2024",
      story:
        "Pracowałem nad Ring.com, gdzie ponad milion osób dziennie ogląda kamery i wideodzwonki Ring.",
      projects: [
        {
          title: "Przyspieszenie sklepu",
          work: "Przebudowałem sposób, w jaki strona tworzy i dostarcza zasoby, podpinając własne pipeline’y do builda w Next.js.",
          result:
            "<strong>4% krótszy czas ładowania stron</strong> przy ponad 1 mln użytkowników dziennie.",
        },
      ],
    },
    {
      company: "Brainly",
      role: "Senior Software Engineer — Moderation",
      from: "lis 2019",
      to: "sie 2023",
      story:
        "Pracowałem nad wewnętrzną aplikacją, w której moderatorzy prowadzili swoją codzienną kolejkę zgłoszeń.",
      projects: [
        {
          title: "Kolejka zawsze aktualna",
          work: "Zastąpiłem ręczne odświeżanie kolejki strumieniem Server-Sent Events na żywo.",
          result: "<strong>Moderacja przyspieszyła o 20%</strong>.",
        },
        {
          title: "Widoczność procesu moderacji",
          work: "Zbudowałem moduł telemetrii wpięty w stan Reduxa, dzięki czemu zespół danych zobaczył, jak zgłoszenia przechodzą przez aplikację.",
        },
        {
          title: "Rozwijanie zespołu",
          work: "Mentorowałem dwóch inżynierów, którzy w ciągu roku awansowali z Mid-level na Seniora.",
        },
      ],
    },
    {
      company: "Infor",
      role: "Senior Software Engineer",
      from: "wrz 2019",
      to: "paź 2021",
      story:
        "Pracowałem nad wrażliwym na wydajność frontendem platformy analitycznej czasu rzeczywistego, na której sieci handlowe oglądały dane o sklepach i sprzedaży. Poprowadziłem trzyosobową migrację pięcioletniej aplikacji z Angulara na Reacta, ekran po ekranie, <strong>zmniejszając opóźnienie stron o 10–20%</strong>. Zbudowałem też narzędzie do automatyzacji wydań, które <strong>skróciło wdrożenia o 20%</strong>.",
      projects: [],
    },
    {
      company: "MLabs",
      role: "Software Engineer",
      from: "wrz 2015",
      to: "lip 2019",
      story:
        "Pracowałem nad osobnymi projektami w bardzo różnych obszarach: narzędziem do raportowania, dojrzałą aplikacją webową i wbudowanym systemem przeciwpożarowym. Robiłem przy nich wszystko, od pisania funkcji, przez architekturę, po prowadzenie zespołu.",
      projects: [
        {
          title: "Automatyzacja raportowania",
          work: "Zbudowałem narzędzie webowe na AWS, które generowało dokumenty LaTeX przez Lambdę, zamiast ręcznego składania raportów.",
          result:
            "Użytkownicy kończyli raporty <strong>prawie 30% szybciej</strong>.",
        },
        {
          title: "Modernizacja frontendu",
          work: "Poprowadziłem trzyosobowy zespół, który przepisał aplikację z Angulara na Reacta i ułożył jej nową architekturę.",
        },
        {
          title: "Wbudowany system przeciwpożarowy",
          work: "Zaprojektowałem i wdrożyłem architekturę mikroserwisów, dzięki której fizyczne komponenty łatwiej było dodawać i usuwać. Pracowałem z inżynierami sprzętu nad zmniejszeniem opóźnień systemu.",
        },
        {
          title: "Rozwój zespołu",
          work: "Prowadziłem rozmowy techniczne i mentorowałem juniorów.",
        },
      ],
    },
  ],
  education: {
    label: "Wykształcenie",
    institution: "Politechnika Poznańska",
    degree: "Magister inżynier informatyki, ocena 5",
    thesis:
      "Praca magisterska „Using Computer Vision in the process generating Responsive Websites Layouts”",
  },
} as const satisfies ExperienceContent;

export const experience = {
  en,
  pl,
} as const satisfies Record<Lang, ExperienceContent>;
