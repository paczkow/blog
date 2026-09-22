<script lang="ts">
import { activeLangs } from "@/i18n/config.ts";
import { type Messages, createTranslator } from "@/i18n/translator.ts";
import type { PluralForms } from "@/i18n/ui.ts";
import type { Lang } from "@/models.ts";
import { archive } from "./archive-state.svelte.ts";

const {
  lang,
  messages,
  articleForms,
  initialCount,
}: {
  lang: Lang;
  messages: Messages;
  articleForms: PluralForms;
  /** Result count for the unfiltered page, so the prerender is not 0. */
  initialCount: number;
} = $props();

archive.seed(lang);

const t = createTranslator(messages);

// The input owns its own value so typing stays instant; `archive.query`, which
// the list reads, trails it by the debounce.
let draft = $state("");
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

function onInput(value: string) {
  draft = value;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    archive.query = value;
  }, 100);
}

function clear() {
  clearTimeout(debounceTimer);
  draft = "";
  archive.query = "";
}

const count = $derived(archive.resultCount ?? initialCount);

const articleLabel = $derived.by(() => {
  const pluralRules = new Intl.PluralRules(t("common.locale"));
  return articleForms[pluralRules.select(count)] ?? articleForms.other;
});

// One class list for both states, keyed off the `aria-pressed` the chip already
// carries. Splitting it across a ternary put `border-transparent` and
// `border-line2` on the same element, and the generated stylesheet emits
// transparent last, so the active chip lost its border. The two border colours
// now sit on mutually exclusive selectors and emission order cannot decide it.
const chipClass =
  "text-mute hover:text-ink touch:active:text-ink not-aria-pressed:border-transparent aria-pressed:border-line2 aria-pressed:bg-bg3 aria-pressed:text-ink rounded-[4px] border px-2 py-[3px] transition-colors duration-150";
</script>

<div class="flex flex-col gap-3">
	<label
		class="border-line bg-bg2 focus-within:border-line2 flex h-10 items-center gap-2.5 rounded-md border px-3 transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
	>
		<span aria-hidden="true" class="text-mute font-mono text-xs">&gt;</span>
		<input
			class="text-ink placeholder:text-mute min-w-0 flex-1 border-0 bg-transparent p-0 text-sm outline-none"
			aria-label={t("writingArchive.searchPlaceholder")}
			placeholder={t("writingArchive.searchPlaceholder")}
			autocomplete="off"
			value={draft}
			oninput={(event) => onInput(event.currentTarget.value)}
			onkeydown={(event) => {
				if (event.key === "Escape") clear();
			}}
		/>
		{#if draft}
			<button
				type="button"
				onclick={clear}
				aria-label={t("writingArchive.clearSearch")}
				class="text-mute hover:text-ink font-mono text-xs transition-colors duration-150"
			>
				esc
			</button>
		{/if}
	</label>

	<div
		class="text-mute flex items-center justify-between font-mono text-xs"
	>
		<!--
			Paused locales (see `enabledLangs`) have no posts in the archive, so their
			chip would only ever filter to nothing; with one locale left there is
			nothing to filter and the row carries the count alone.
		-->
		{#if activeLangs.length > 1}
			<div
				class="flex items-center gap-1"
				aria-label={t("writingArchive.searchLanguage")}
			>
				{#each activeLangs as code (code)}
					<button
						type="button"
						onclick={() => archive.toggleLanguage(code)}
						aria-pressed={archive.languages.includes(code)}
						class={chipClass}
					>
						{code.toUpperCase()}
					</button>
				{/each}
			</div>
		{/if}
		<span class="ms-auto">{count} {articleLabel}</span>
	</div>
</div>
