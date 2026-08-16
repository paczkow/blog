<script lang="ts">
import type { Lang } from "@/models.ts";
import Tooltip from "./Tooltip.svelte";

type Theme = "light" | "dark";

type PreferencesI18n = {
  siteLabel: string;
  langLabel: string;
  switchToDark: string;
  switchToLight: string;
  tooltipEn: string;
  tooltipPl: string;
  ariaEn: string;
  ariaPl: string;
};

const {
  activeLang,
  languageLinks,
  i18n,
}: {
  activeLang?: Lang;
  languageLinks?: Partial<Record<Lang, string>>;
  i18n: PreferencesI18n;
} = $props();

let lang = $state<Lang>("en");
let theme = $state<Theme>("light");

function readLang(): Lang {
  const stored = localStorage.getItem("lang");
  return stored === "pl" ? "pl" : "en";
}

function readTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function setLang(next: Lang) {
  localStorage.setItem("lang", next);
  document.documentElement.lang = next;
}

function setTheme(next: Theme) {
  localStorage.setItem("theme", next);
  document.documentElement.classList.toggle("dark", next === "dark");
}

$effect(() => {
  lang = activeLang ?? readLang();
  theme = readTheme();
});

function toggleTheme() {
  const next = theme === "light" ? "dark" : "light";
  setTheme(next);
  theme = next;
}

function langClass(active: boolean, unavailable = false) {
  if (unavailable) {
    return "px-0.5 py-2 transition-colors duration-200 text-sand-8 cursor-default active:text-sand-10";
  }

  return active
    ? "px-0.5 py-2 transition-colors duration-200 text-sand-12"
    : "px-0.5 py-2 transition-colors duration-200 text-sand-9 hover:text-sand-11 touch:active:text-sand-12";
}

function isUnavailable(targetLang: Lang) {
  return !!languageLinks && !languageLinks[targetLang];
}
</script>

<div
	id="preferences-rail"
	class="group/prefs flex items-center justify-end gap-3 text-xs text-sand-10 opacity-60 transition-opacity duration-200 hover:opacity-100"
	aria-label={i18n.siteLabel}
>
	<div
		class="flex items-center gap-1"
		role="group"
		aria-label={i18n.langLabel}
	>
		{#if languageLinks?.en}
			<a
				href={languageLinks.en}
				onclick={() => {
					setLang("en");
					lang = "en";
				}}
				aria-current={lang === "en" ? "page" : undefined}
				class="cursor-pointer no-underline {langClass(lang === 'en')}"
			>
				EN
			</a>
		{:else if isUnavailable("en")}
			<Tooltip content={i18n.tooltipEn}>
				<span
					aria-disabled="true"
					aria-label={i18n.ariaEn}
					class={langClass(lang === "en", true)}
				>
					EN
				</span>
			</Tooltip>
		{:else}
			<button
				type="button"
				onclick={() => {
					setLang("en");
					lang = "en";
				}}
				aria-pressed={lang === "en"}
				class="cursor-pointer {langClass(lang === 'en')}"
			>
				EN
			</button>
		{/if}
		<span class="text-sand-7 select-none" aria-hidden="true">·</span>
		{#if languageLinks?.pl}
			<a
				href={languageLinks.pl}
				onclick={() => {
					setLang("pl");
					lang = "pl";
				}}
				aria-current={lang === "pl" ? "page" : undefined}
				class="cursor-pointer no-underline {langClass(lang === 'pl')}"
			>
				PL
			</a>
		{:else if isUnavailable("pl")}
			<Tooltip content={i18n.tooltipPl}>
				<span
					aria-disabled="true"
					aria-label={i18n.ariaPl}
					class={langClass(lang === "pl", true)}
				>
					PL
				</span>
			</Tooltip>
		{:else}
			<button
				type="button"
				onclick={() => {
					setLang("pl");
					lang = "pl";
				}}
				aria-pressed={lang === "pl"}
				class="cursor-pointer {langClass(lang === 'pl')}"
			>
				PL
			</button>
		{/if}
	</div>

	<button
		type="button"
		onclick={toggleTheme}
		aria-label={theme === "light" ? i18n.switchToDark : i18n.switchToLight}
		class="cursor-pointer px-1 py-2 text-base leading-none text-sand-10 transition-colors duration-200 hover:text-sand-12 touch:active:text-sand-12"
	>
		{theme === "light" ? "◐" : "◑"}
	</button>
</div>
