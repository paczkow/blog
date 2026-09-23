<script lang="ts">
import { createSearch } from "@/helpers/search.ts";
import { type Messages, createTranslator } from "@/i18n/translator.ts";
import type { Lang, Post } from "@/models.ts";
import PostCard from "../PostCard.svelte";
import { postListClass } from "../post-row.ts";
import EmptyResults from "./EmptyResults.svelte";
import { archive } from "./archive-state.svelte.ts";

const {
  posts,
  lang,
  messages,
}: {
  posts: Post[];
  lang: Lang;
  messages: Messages;
} = $props();

archive.seed(lang);

const t = createTranslator(messages);

const languagePosts = $derived(
  posts.filter((post) => archive.languages.includes(post.lang)),
);

const filteredPosts = $derived.by(() => {
  const search = createSearch(languagePosts);
  // Trimmed, so a stray space does not read as a term that matches nothing.
  return search(archive.query.trim()).toSorted(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
});

// The sidebar renders the count but does not run the search, so the list hands
// it back. `$effect` never runs while prerendering, where the sidebar falls
// back to the count the page passed it.
$effect(() => {
  archive.resultCount = filteredPosts.length;
});

const showLang = $derived(archive.languages.length > 1);
</script>

<div
	class="border-line text-mute hidden grid-cols-[minmax(0,1fr)_96px] gap-4 border-b pr-3 pb-3 text-[11px] tracking-[0.08em] uppercase min-[700px]:grid"
>
	<span>{t("writingArchive.columnTitle")}</span>
	<span class="text-right">{t("writingArchive.columnMeta")}</span>
</div>

{#if filteredPosts.length === 0}
	<EmptyResults query={archive.query} {messages} />
{:else}
	<div class={postListClass}>
		{#each filteredPosts as post (post.id)}
			<PostCard
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
{/if}
