<script lang="ts">
import { createSearch } from "@/helpers/search.ts";
import { localizeUrl } from "@/i18n/config.ts";
import { createTranslator, type Messages } from "@/i18n/translator.ts";
import type { PluralForms } from "@/i18n/ui.ts";
import type { Lang, Post } from "@/models.ts";
import PostCard from "../PostCard.svelte";
import EmptyResults from "./EmptyResults.svelte";

const {
  posts,
  lang,
  messages,
  articleForms,
}: {
  posts: Post[];
  lang: Lang;
  messages: Messages;
  articleForms: PluralForms;
} = $props();

const t = createTranslator(messages);
const homeHref = localizeUrl(lang);

const filters: { label: string; value: Lang }[] = [
  { label: "EN", value: "en" },
  { label: "PL", value: "pl" },
];

const getSortedByDate = <T extends { date: Date }>(items: T[]) => {
  return items.toSorted((a, b) => b.date.getTime() - a.date.getTime());
};

let selectedLanguages = $state<Lang[]>([]);
let query = $state("");
let localQuery = $state("");
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

$effect(() => {
  selectedLanguages = [lang];
});

function toggleLanguage(lang: Lang) {
  if (selectedLanguages.includes(lang)) {
    const next = selectedLanguages.filter(
      (selectedLang) => selectedLang !== lang,
    );
    if (next.length > 0) selectedLanguages = next;
    return;
  }

  selectedLanguages = [...selectedLanguages, lang];
}

function onQueryInput(value: string) {
  localQuery = value;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    query = value;
  }, 100);
}

const count = $derived(
  posts.filter((post) => selectedLanguages.includes(post.lang)).length,
);

const articleLabel = $derived.by(() => {
  const pluralRules = new Intl.PluralRules(t("common.locale"));
  return articleForms[pluralRules.select(count)] ?? articleForms.other;
});

const languagePosts = $derived(
  posts.filter((post) => selectedLanguages.includes(post.lang)),
);

const filteredPosts = $derived.by(() => {
  const search = createSearch(languagePosts);
  return getSortedByDate(search(query));
});

const showLang = $derived(selectedLanguages.length > 1);
</script>

<div
	class="grid grid-cols-1 grid-rows-[1fr] gap-y-8 px-4 md:justify-between lg:grid-cols-[340px_600px] lg:gap-8"
>
	<aside
		class="lg:sticky z-10 lg:top-(--nav-height) col-start-1 col-end-2 px-4 lg:h-[calc(100vh-var(--nav-height)-var(--page-bottom))]"
	>
		<div class="flex flex-col gap-10 h-full">
			<nav
				aria-label={t("common.breadcrumb")}
				class="flex items-center gap-2 text-sm text-sand-11"
			>
				<a href={homeHref} class="transition-colors hover:text-sand-12">
					{t("common.home")}
				</a>
				<span class="text-sand-9">/</span>
				<span class="text-sand-12">{t("writingArchive.current")}</span>
			</nav>

			<div class="flex flex-col gap-6">
				<span
					class="text-sand-11 text-xs uppercase tracking-[0.2em] font-medium"
				>
					{t("writingArchive.section")}
				</span>
				<h1
					class="font-display font-normal text-sand-12 text-4xl md:text-5xl leading-[1.05] tracking-tight"
				>
					{t("writingArchive.title")}<span class="text-sand-9 italic">.</span>
				</h1>

				<div class="flex flex-col gap-3">
					<input
						class="w-full appearance-none border-0 border-b border-sand-6 bg-transparent px-0 py-2 text-sand-12 placeholder:text-sand-9 focus:border-sand-12 focus:outline-none transition-colors"
						placeholder={t("writingArchive.searchPlaceholder")}
						value={localQuery}
						oninput={(e) => onQueryInput(e.currentTarget.value)}
					/>
					<div class="flex items-center justify-between gap-4 text-xs text-sand-10">
						<div
							class="flex items-center gap-2"
							aria-label={t("writingArchive.searchLanguage")}
						>
							{#each filters as filter (filter.value)}
								<button
									type="button"
									onclick={() => toggleLanguage(filter.value)}
									aria-pressed={selectedLanguages.includes(filter.value)}
									class={selectedLanguages.includes(filter.value)
										? "cursor-pointer text-sand-12"
										: "cursor-pointer text-sand-9 transition-colors hover:text-sand-11"}
								>
									{filter.label}
								</button>
							{/each}
						</div>
						<span class="tabular-nums">
							{count}
							{articleLabel}
						</span>
					</div>
				</div>
			</div>
		</div>
	</aside>

	<main>
		<div class="lg:pt-9">
			{#if filteredPosts.length === 0}
				<section id="articles" class="flex flex-1 flex-col">
					<EmptyResults {query} {messages} />
				</section>
			{:else}
				<section id="articles" class="flex flex-1 flex-col gap-12">
					<div
						class="group flex flex-col"
					>
						{#each filteredPosts as post (post.id)}
							<PostCard
								id={post.id}
								url={post.url}
								title={post.title}
								description={post.description}
								date={post.date}
								readTime={post.readTime}
								lang={post.lang}
								{showLang}
								{messages}
							/>
						{/each}
					</div>
				</section>
			{/if}
		</div>
	</main>
</div>
