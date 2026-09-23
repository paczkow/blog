<script lang="ts">
type HeatmapPost = {
  id: string;
  title: string;
  date: string;
};

type WeekCell = {
  key: string;
  label: string;
  count: number;
};

const WEEKS = 23;
const DAY_MS = 86_400_000;
const CELL_PX = 11;
const GAP_PX = 3;
// One column of the marker strip: a cell plus its gap.
const STEP_PX = CELL_PX + GAP_PX;
const NOMINAL_WIDTH = WEEKS * CELL_PX + (WEEKS - 1) * GAP_PX;
// Columns a month label needs to itself: a three-letter mono label at 10px is
// ~18px, and two columns are 28px even before the strip shrinks to fit.
const MIN_MARKER_GAP = 2;

const {
  posts,
  i18n,
}: {
  posts: HeatmapPost[];
  i18n: { locale: string; heatmapTitle: string; noWriting: string };
} = $props();

const { locale, heatmapTitle, noWriting } = i18n;

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

const weeks = $derived.by(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstWeek = startOfWeek(today);
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

  const cells: Array<WeekCell & { weekStart: Date }> = [];
  for (let i = 0; i < WEEKS; i++) {
    const weekStart = new Date(firstWeek.getTime() + i * 7 * DAY_MS);
    const weekEnd = new Date(weekStart.getTime() + 6 * DAY_MS);
    const written = postsByWeek.get(weekKey(weekStart)) ?? [];
    const range = formatWeekRange(weekStart, weekEnd);

    cells.push({
      key: weekKey(weekStart),
      weekStart,
      count: written.length,
      label: `${range} — ${written.length === 0 ? noWriting : written.map((post) => post.title).join(", ")}`,
    });
  }

  return cells;
});

const monthMarkers = $derived.by(() => {
  const markers: Array<{ col: number; label: string }> = [];
  const seen = new Set<string>();

  for (let i = 0; i < weeks.length; i++) {
    const { weekStart } = weeks[i];
    let marked = false;

    // A week that contains the 1st is labelled with that month, so the marker
    // lands on the column where the month actually starts.
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

    if (i === 0 || weekStart.getMonth() !== weeks[i - 1].weekStart.getMonth()) {
      markers.push({ col: i, label: formatMonth(weekStart) });
      seen.add(monthId);
    }
  }

  // A month that only reaches into the first column has no room for its label
  // before the next month's starts, and the two print over each other. The
  // earlier one gives way: the later marks a month that actually begins there.
  return markers.filter((marker, i) => {
    const next = markers[i + 1];
    return !next || next.col - marker.col >= MIN_MARKER_GAP;
  });
});

const cellClass = (count: number) =>
  count === 0 ? "bg-bg3" : count === 1 ? "bg-sub" : "bg-ink";
</script>

<!-- Desktop only: below 1024px the sidebar is too short (tablet) or too narrow
	(phone) to carry it, so it is dropped rather than scaled down. -->
<div class="hidden flex-col gap-2.5 lg:flex">
	<h2 class="text-sub text-[11px] tracking-[0.08em] uppercase">
		{heatmapTitle}
	</h2>

	<!-- The 23 cells are 20px wider than the 340px sidebar allows, so they shrink
		to fit. The marker strip is the same width and positions its labels in
		percent of it, which keeps them on their column at any width. -->
	<div class="flex gap-[3px]">
		{#each weeks as week (week.key)}
			{#if week.count > 0}
				<span
					role="img"
					aria-label={week.label}
					title={week.label}
					class="h-[11px] w-[11px] rounded-[1px] {cellClass(week.count)}"
				></span>
			{:else}
				<!-- Empty weeks are noise to a screen reader: the same "nothing
					happened" 20 times over. They keep the hover title only. -->
				<span
					aria-hidden="true"
					title={week.label}
					class="h-[11px] w-[11px] rounded-[1px] {cellClass(week.count)}"
				></span>
			{/if}
		{/each}
	</div>

	<div
		class="text-mute relative h-3 w-full text-[10px] leading-none"
		style:max-width="{NOMINAL_WIDTH}px"
		aria-hidden="true"
	>
		{#each monthMarkers as marker (marker.col)}
			<span
				class="absolute whitespace-nowrap"
				style:left="{(((marker.col * STEP_PX) / NOMINAL_WIDTH) * 100).toFixed(
					3,
				)}%"
			>
				{marker.label}
			</span>
		{/each}
	</div>
</div>
