<script lang="ts">
import { createTranslator, type Messages } from "@/i18n/translator.ts";

const {
  id,
  url = `/writing/${id}`,
  date,
  title,
  description,
  readTime,
  lang,
  showLang = false,
  messages,
}: {
  id: string;
  url?: string;
  date: Date;
  title: string;
  description: string;
  readTime?: number;
  lang?: string;
  showLang?: boolean;
  messages: Messages;
} = $props();

const t = createTranslator(messages);

const formattedDate = $derived(
  new Date(date).toLocaleDateString(t("common.locale"), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
);
</script>

<a href={url} class="block no-underline">
	<article
		class="relative block cursor-pointer px-4 py-6 rounded-md will-change-transform transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-60 hover:!opacity-100 hover:translate-x-1 active:bg-sand-3 dark:active:bg-sand-5"
	>
		<div class="flex items-baseline justify-between gap-4 mb-3 text-sand-10 text-sm">
			<time class="tabular-nums" datetime={new Date(date).toISOString()}>
				{formattedDate}
			</time>
			{#if readTime}
				<span class="flex items-center gap-2 tabular-nums">
					{#if showLang && lang}
						<span class="text-sand-9 uppercase">{lang}</span>
					{/if}
					{readTime} {t("common.readTime")}
				</span>
			{/if}
		</div>
		<h3 class="font-display text-sand-12 text-xl leading-tight mb-2">
			{title}
		</h3>
		<p class="text-sand-11 leading-relaxed">{description}</p>
	</article>
</a>
