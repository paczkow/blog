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

<div class="border-line flex flex-col gap-2.5 border-b py-16">
	<span class="text-mute text-xs">
		{t("writingArchive.empty.count")}
	</span>
	<p class="text-[17px] font-medium tracking-[-0.01em]">
		{trimmed
			? t("writingArchive.empty.broken")
			: t("writingArchive.empty.quiet")}
	</p>
	<p class="text-sub text-sm leading-[1.6]">
		{#if trimmed}
			{t("writingArchive.empty.noResults")}
			<span class="text-ink text-[13px]">"{trimmed}"</span>.
			{t("writingArchive.empty.tryAnother")}
		{:else}
			{t("writingArchive.empty.empty")}
		{/if}
	</p>
</div>
