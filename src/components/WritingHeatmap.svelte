<script lang="ts">
import { localizeUrl } from "@/i18n/config.ts";
import type { Lang } from "@/models.ts";

type HeatmapPost = {
  id: string;
  title: string;
  date: string;
};

type WeekCell = {
  key: string;
  weekStart: Date;
  weekEnd: Date;
  posts: HeatmapPost[];
};

const WEEKS = 23;
const DAY_MS = 86_400_000;
const CELL_STEP = 14;

const getLangAndSlug = (id: string): { lang: Lang; slug: string } => {
  const [lang, ...slugParts] = id.split("/");
  return {
    lang: lang === "pl" ? "pl" : "en",
    slug: slugParts.join("/").replace(/\/index$/, ""),
  };
};

const {
  posts,
  i18n,
}: {
  posts: HeatmapPost[];
  i18n: { locale: string; heatmapTitle: string; noWriting: string };
} = $props();

const { locale, heatmapTitle, noWriting } = i18n;

// biome-ignore lint/style/useConst: Svelte template event handlers reassign this state.
let hoveredKey = $state<string | null>(null);

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
};

const weekKey = (date: Date) => startOfWeek(date).toISOString().slice(0, 10);

const formatWeekRange = (start: Date, end: Date) => {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString(locale, opts)} – ${end.toLocaleDateString(locale, { ...opts, year: "numeric" })}`;
};

const formatMonth = (date: Date) => {
  const label = date.toLocaleDateString(locale, { month: "short" });
  return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1);
};

const weekCells = $derived.by(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentWeek = startOfWeek(today);
  const firstWeek = new Date(currentWeek);
  firstWeek.setDate(firstWeek.getDate() - (WEEKS - 1) * 7);

  const postsByWeek = new Map<string, HeatmapPost[]>();
  for (const post of posts) {
    const date = new Date(post.date);
    date.setHours(0, 0, 0, 0);
    if (date < firstWeek || date > today) continue;

    const key = weekKey(date);
    const list = postsByWeek.get(key);
    if (list) list.push(post);
    else postsByWeek.set(key, [post]);
  }

  const cells: WeekCell[] = [];
  for (let i = 0; i < WEEKS; i++) {
    const weekStart = new Date(firstWeek.getTime() + i * 7 * DAY_MS);
    const weekEnd = new Date(weekStart.getTime() + 6 * DAY_MS);
    cells.push({
      key: weekKey(weekStart),
      weekStart,
      weekEnd,
      posts: postsByWeek.get(weekKey(weekStart)) ?? [],
    });
  }

  return cells;
});

const monthMarkers = $derived.by(() => {
  const markers: Array<{ col: number; label: string }> = [];
  const seen = new Set<string>();

  for (let i = 0; i < weekCells.length; i++) {
    const { weekStart } = weekCells[i];
    let marked = false;

    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart.getTime() + d * DAY_MS);
      if (date.getDate() !== 1) continue;

      const monthId = `${date.getFullYear()}-${date.getMonth()}`;
      if (seen.has(monthId)) break;

      markers.push({ col: i, label: formatMonth(date) });
      seen.add(monthId);
      marked = true;
      break;
    }

    if (marked) continue;

    const monthId = `${weekStart.getFullYear()}-${weekStart.getMonth()}`;
    if (seen.has(monthId)) continue;

    if (
      i === 0 ||
      weekStart.getMonth() !== weekCells[i - 1].weekStart.getMonth()
    ) {
      markers.push({ col: i, label: formatMonth(weekStart) });
      seen.add(monthId);
    }
  }

  return markers;
});

const hoveredCell = $derived(
  weekCells.find((cell) => cell.key === hoveredKey) ?? null,
);

const hoveredIndex = $derived(
  hoveredKey ? weekCells.findIndex((cell) => cell.key === hoveredKey) : -1,
);
</script>

<div class="flex flex-col gap-2">
	<h2 class="text-sand-11 text-xs uppercase font-medium">
		{heatmapTitle}
	</h2>

	<div
		class="relative w-fit py-1"
		onmouseleave={() => (hoveredKey = null)}
		role="presentation"
	>
		{#if hoveredCell}
			<div
				class="absolute bottom-full z-20 mb-2 min-w-[200px] max-w-[280px] rounded-md border border-sand-4 bg-sand-1 p-3 shadow-lg dark:border-sand-6 dark:bg-sand-3"
				style:left="{Math.max(0, hoveredIndex * CELL_STEP - 8)}px"
			>
				<div class="text-sand-12 mb-1 text-sm font-medium">
					{formatWeekRange(hoveredCell.weekStart, hoveredCell.weekEnd)}
				</div>
				{#if hoveredCell.posts.length === 0}
					<div class="text-sand-10 text-xs">
						{noWriting}
					</div>
				{:else}
					<ul class="flex flex-col gap-1">
						{#each hoveredCell.posts as post (post.id)}
							{@const { lang: postLang, slug } = getLangAndSlug(post.id)}
							<li>
								<a
									href={localizeUrl(postLang, `/writing/${slug}`)}
									class="text-sand-12 text-sm leading-snug underline underline-offset-2 decoration-sand-7 hover:decoration-sand-12"
								>
									{post.title}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}

		<div class="flex gap-[3px]">
			{#each weekCells as cell (cell.key)}
				<button
					type="button"
					aria-label={formatWeekRange(cell.weekStart, cell.weekEnd)}
					onmouseenter={() => (hoveredKey = cell.key)}
					class="h-[11px] w-[11px] shrink-0 rounded-[2px] transition-colors {cell.posts.length ===
					0
						? 'bg-sand-3 hover:bg-sand-5 dark:bg-sand-4 dark:hover:bg-sand-6'
						: cell.posts.length === 1
							? 'bg-sand-9 hover:bg-sand-11'
							: 'bg-sand-11 hover:bg-sand-12'} {hoveredKey === cell.key
						? 'ring-1 ring-inset ring-sand-12 dark:ring-sand-11'
						: ''}"
				></button>
			{/each}
		</div>

		<div
			class="relative mt-2 h-3.5 text-[10px] leading-none text-sand-10"
			style:width="{WEEKS * 11 + (WEEKS - 1) * 3}px"
		>
			{#each monthMarkers as marker (marker.col)}
				<span
					class="absolute whitespace-nowrap"
					style:left="{marker.col * CELL_STEP}px"
				>
					{marker.label}
				</span>
			{/each}
		</div>
	</div>
</div>
