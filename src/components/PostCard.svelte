<script lang="ts">
import { createTranslator, type Messages } from "@/i18n/translator.ts";
import {
  postRowBodyClass,
  postRowClass,
  postRowDescriptionClass,
  postRowLangClass,
  postRowMetaClass,
  postRowReadClass,
  postRowTitleClass,
} from "./post-row.ts";

const {
  url,
  date,
  title,
  description,
  readTime,
  lang,
  showLang = false,
  messages,
}: {
  url: string;
  date: Date;
  title: string;
  description: string;
  readTime?: number;
  lang?: string;
  /** "EN" / "PL" before the read time, only when a list mixes locales. */
  showLang?: boolean;
  messages: Messages;
} = $props();

const t = createTranslator(messages);

const formattedDate = $derived(
  new Date(date).toLocaleDateString(t("common.locale"), {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }),
);
</script>

<!-- The Astro `PostRow` renders the same structure from the same class
     constants; the two are one definition, split only by what needs client
     state. Keep them in step. -->
<a href={url} class={postRowClass}>
	<span class={postRowBodyClass}>
		<span class={postRowTitleClass}>{title}</span>
		<span class={postRowDescriptionClass}>{description}</span>
	</span>
	<span class={postRowMetaClass}>
		<span>{formattedDate}</span>
		{#if readTime || (showLang && lang)}
			<span class={postRowReadClass}>
				{#if showLang && lang}
					<span class={postRowLangClass}>{lang.toUpperCase()}</span>
				{/if}
				{#if readTime}
					<span>{readTime} {t("writingArchive.readTimeShort")}</span>
				{/if}
			</span>
		{/if}
	</span>
</a>
