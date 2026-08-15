<script lang="ts">
import { createTranslator, type Messages } from "@/i18n/translator.ts";

const {
  query,
  messages,
}: {
  query: string;
  messages: Messages;
} = $props();

const t = createTranslator(messages);
const trimmed = $derived(query.trim());
</script>

<div class="flex flex-col items-center gap-8 px-4 py-16 text-center">
	<svg
		viewBox="0 0 270 130"
		width="270"
		height="130"
		aria-hidden="true"
		class="text-sand-9 dark:text-sand-8"
	>
		<title>{t("writingArchive.empty.imageTitle")}</title>
		<line x1="30" y1="40" x2="65" y2="25" stroke="currentColor" stroke-width="0.8" opacity="0.55"></line>
		<line x1="30" y1="40" x2="55" y2="75" stroke="currentColor" stroke-width="0.8" opacity="0.55"></line>
		<line x1="65" y1="25" x2="95" y2="55" stroke="currentColor" stroke-width="0.8" opacity="0.55"></line>
		<line x1="55" y1="75" x2="95" y2="55" stroke="currentColor" stroke-width="0.8" opacity="0.55"></line>
		<line x1="175" y1="35" x2="215" y2="55" stroke="currentColor" stroke-width="0.8" opacity="0.55"></line>
		<line x1="215" y1="55" x2="195" y2="95" stroke="currentColor" stroke-width="0.8" opacity="0.55"></line>
		<line x1="215" y1="55" x2="240" y2="90" stroke="currentColor" stroke-width="0.8" opacity="0.55"></line>
		<line x1="195" y1="95" x2="240" y2="90" stroke="currentColor" stroke-width="0.8" opacity="0.55"></line>
		<line x1="95" y1="55" x2="122" y2="60" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.7"></line>
		<line x1="148" y1="65" x2="175" y2="35" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.7"></line>
		<g transform="translate(135 62.5) rotate(15)">
			<line x1="-5" y1="-5" x2="5" y2="5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"></line>
			<line x1="-5" y1="5" x2="5" y2="-5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"></line>
		</g>
		<circle cx="30" cy="40" r="2.8" fill="currentColor"></circle>
		<circle cx="65" cy="25" r="2.8" fill="currentColor"></circle>
		<circle cx="55" cy="75" r="2.8" fill="currentColor"></circle>
		<circle cx="95" cy="55" r="2.8" fill="currentColor"></circle>
		<circle cx="175" cy="35" r="2.8" fill="currentColor"></circle>
		<circle cx="215" cy="55" r="2.8" fill="currentColor"></circle>
		<circle cx="195" cy="95" r="2.8" fill="currentColor"></circle>
		<circle cx="240" cy="90" r="2.8" fill="currentColor"></circle>
		<circle cx="122" cy="60" r="1.8" fill="currentColor" opacity="0.4">
			<animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.4s" repeatCount="indefinite"></animate>
		</circle>
		<circle cx="148" cy="65" r="1.8" fill="currentColor" opacity="0.4">
			<animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.4s" repeatCount="indefinite"></animate>
		</circle>
	</svg>

	<div class="flex flex-col gap-2 max-w-[32ch]">
		<p class="font-serif italic text-sand-12 text-2xl leading-snug">
			{trimmed
				? t("writingArchive.empty.broken")
				: t("writingArchive.empty.quiet")}
		</p>
		<p class="text-sand-12 text-sm leading-relaxed">
			{#if trimmed}
				{t("writingArchive.empty.noResults")}
				<span class="text-sand-12 font-medium">"{trimmed}"</span>.
				{t("writingArchive.empty.tryAnother")}
			{:else}
				{t("writingArchive.empty.empty")}
			{/if}
		</p>
	</div>
</div>
