<script lang="ts">
import { activeLangs } from "@/i18n/config.ts";
import type { Lang } from "@/models.ts";

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
  activeLang = "en",
  languageLinks,
  i18n,
}: {
  activeLang?: Lang;
  languageLinks?: Partial<Record<Lang, string>>;
  i18n: PreferencesI18n;
} = $props();

// Only the button's label needs this in JS — the glyph itself is swapped by the
// `dark:` variant below, so it is already right at first paint. Reading the
// class rather than localStorage keeps this in step with the blocking script in
// Head.astro, which is the single place the stored choice and
// `prefers-color-scheme` are reconciled.
let theme = $state<Theme>("light");

$effect(() => {
  theme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
});

function toggleTheme() {
  const next: Theme = document.documentElement.classList.contains("dark")
    ? "light"
    : "dark";
  localStorage.setItem("theme", next);
  document.documentElement.classList.toggle("dark", next === "dark");
  theme = next;
}

const unavailableCopy: Record<Lang, { title: string; aria: string }> = {
  en: { title: i18n.tooltipEn, aria: i18n.ariaEn },
  pl: { title: i18n.tooltipPl, aria: i18n.ariaPl },
};

// `transition-[color]` rather than `transition-colors`: the design animates the
// text colour alone, and Tailwind's list drags `outline-color` in with it, which
// fades the focus ring in instead of painting it on the first frame.
const linkClass =
  "text-mute transition-[color] duration-150 hover:text-ink touch:active:text-ink";
</script>

<div class="flex items-center gap-4" aria-label={i18n.siteLabel}>
	<!--
		Driven by the locale flags rather than a literal list: pausing a locale
		takes it out of the switcher, and a site left with one locale shows no
		switcher at all.
	-->
	{#if activeLangs.length > 1}
	<div class="flex items-center gap-1.5" role="group" aria-label={i18n.langLabel}>
		{#each activeLangs as code, index (code)}
			{@const label = code.toUpperCase()}
			{#if index > 0}
				<span class="text-line2 select-none" aria-hidden="true">/</span>
			{/if}
			{#if code === activeLang}
				<span class="text-ink" aria-current="page">{label}</span>
			{:else if languageLinks?.[code]}
				<a href={languageLinks[code]} hreflang={code} class="no-underline {linkClass}">
					{label}
				</a>
			{:else}
				<span
					class="text-line2 cursor-default"
					aria-disabled="true"
					aria-label={unavailableCopy[code].aria}
					title={unavailableCopy[code].title}
				>
					{label}
				</span>
			{/if}
		{/each}
	</div>
	{/if}

	<button
		type="button"
		onclick={toggleTheme}
		aria-label={theme === "light" ? i18n.switchToDark : i18n.switchToLight}
		class="border-line text-sub hover:border-line2 hover:text-ink touch:active:text-ink grid size-7 cursor-pointer place-items-center rounded-md border text-sm leading-none transition-[border-color,color] duration-150"
	>
		<span class="dark:hidden" aria-hidden="true">◐</span>
		<span class="hidden dark:block" aria-hidden="true">◑</span>
	</button>
</div>
