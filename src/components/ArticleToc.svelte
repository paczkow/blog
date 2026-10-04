<script lang="ts">
type TocHeading = { id: string; text: string };

type ArticleTocI18n = { label: string };

const {
  headings,
  title,
  i18n,
}: { headings: TocHeading[]; title: string; i18n: ArticleTocI18n } = $props();

// -1 until the first heading crosses the threshold: the intro above it belongs
// to no section, so nothing is marked while the reader is still in it.
let activeIndex = $state(-1);

// How far through the current section the reader is, 0 to 1. Together with
// the active index it decides where the filled part of the track ends.
let fraction = $state(0);

let progress = $state(0);
const percent = $derived(Math.round(progress * 100));

// The two lists that carry a track. Headings wrap to different heights in each,
// so the fill is measured against each list's own rows rather than counted in a
// fixed pitch.
let railList: HTMLElement | undefined = $state();
let inlineList: HTMLElement | undefined = $state();
let railFill = $state(0);
let inlineFill = $state(0);

let inline: HTMLDetailsElement | undefined = $state();
let barShown = $state(false);
let barOpen = $state(false);

// Set while a click-to-scroll is in flight: the smooth scroll would otherwise
// walk the active row through every heading it passes on the way.
let locked = false;

function fillFor(list: HTMLElement | undefined) {
  if (!list || activeIndex < 0) return 0;
  const row = list.querySelectorAll("li")[activeIndex];
  return row ? row.offsetTop + fraction * row.offsetHeight : 0;
}

function measureFills() {
  railFill = fillFor(railList);
  inlineFill = fillFor(inlineList);
}

$effect(() => {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress = ratio;

    if (locked) return;

    // How far each heading has travelled past the threshold line: positive
    // once it has scrolled above it.
    const threshold = window.innerHeight * 0.4;
    const passed = headings.map((heading) => {
      const element = document.getElementById(heading.id);
      return element
        ? threshold - element.getBoundingClientRect().top
        : Number.NEGATIVE_INFINITY;
    });

    // The last heading can be too short to ever cross the threshold, so the
    // bottom of the page claims it outright.
    if (ratio >= 0.999) {
      activeIndex = headings.length - 1;
      fraction = 1;
      measureFills();
      return;
    }

    let index = -1;
    passed.forEach((distance, i) => {
      if (distance >= 0) index = i;
    });
    activeIndex = index;

    // The last section runs to the end of the scroll, measured the same way:
    // it crosses the moment the page can scroll no further. A page too short
    // to scroll has nothing to measure against, so the span is guarded.
    const end = window.scrollY - max;
    const span = index >= 0 ? passed[index] - (passed[index + 1] ?? end) : 0;
    fraction =
      span > 0 && Number.isFinite(span) ? Math.min(1, passed[index] / span) : 0;
    measureFills();
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  // Images settling change the document height without any scrolling, which
  // would otherwise leave the percentage stale.
  window.addEventListener("resize", onScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
});

// The bar stands in for the inline list once that list has scrolled off the
// top. Only off the top: below the viewport, on a page loaded mid-way and
// scrolled back up, it is still ahead of the reader. Above 1180px the list is
// `display: none`, reports a zero rect at the origin and never counts as past.
$effect(() => {
  if (!inline) return;
  const observer = new IntersectionObserver(([entry]) => {
    barShown = !entry.isIntersecting && entry.boundingClientRect.top < 0;
  });
  observer.observe(inline);
  return () => observer.disconnect();
});

$effect(() => {
  if (!barShown) barOpen = false;
});

// The jump itself is the browser's: these are real anchors, and the offset is
// the headings' own `scroll-margin-top`. All that is left for JS is to hold the
// row the reader just picked until the scroll settles.
function hold(index: number) {
  locked = true;
  activeIndex = index;
  fraction = 0;
  measureFills();
  barOpen = false;
  setTimeout(() => {
    locked = false;
  }, 1000);
}

function onKeydown(event: KeyboardEvent) {
  if (barOpen && event.key === "Escape") barOpen = false;
}
</script>

<svelte:window onkeydown={onKeydown} />

{#snippet sections(fill: number | null)}
	<div class="track">
		{#if fill !== null}
			<span class="fill" style:height="{fill}px" aria-hidden="true"></span>
		{/if}
		<ul>
			{#each headings as heading, index (heading.id)}
				<li class:is-active={index === activeIndex}>
					<a
						href="#{heading.id}"
						aria-current={index === activeIndex ? "location" : undefined}
						onclick={() => hold(index)}
					>
						{heading.text}
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/snippet}

<aside class="rail">
	<nav class="rail-nav" aria-label={i18n.label} bind:this={railList}>
		<div class="rail-head">
			<span class="eyebrow">{i18n.label}</span>
			<span class="percent" aria-hidden="true">{percent}%</span>
		</div>
		{@render sections(railFill)}
	</nav>
</aside>

<details class="inline-toc" open bind:this={inline}>
	<summary>
		<svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
		{i18n.label}
	</summary>
	<nav aria-label={i18n.label} bind:this={inlineList}>
		{@render sections(inlineFill)}
	</nav>
</details>

<!-- Out of the tab order while it is parked above the viewport. -->
<div class="bar" class:is-shown={barShown} inert={!barShown}>
	<button
		type="button"
		class="bar-button"
		aria-expanded={barOpen}
		aria-controls="toc-bar-panel"
		onclick={() => (barOpen = !barOpen)}
	>
		<!-- In the intro, before any section starts, the bar names the article
		     itself: the title has scrolled off with the header by now, and a bare
		     "In this post" would tell the reader nothing about where they are. -->
		<span class="bar-current">
			{activeIndex >= 0 ? headings[activeIndex].text : title}
		</span>
		<span class="percent" aria-hidden="true">{percent}%</span>
		<svg class="chevron" class:is-open={barOpen} viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
	</button>
	{#if barOpen}
		<div id="toc-bar-panel" class="bar-panel">
			{@render sections(null)}
		</div>
	{/if}
	<span class="bar-progress" style:width="{percent}%" aria-hidden="true"></span>
</div>

<style>
	/* Absolute, so the rail hangs in the gutter left of the 617px column without
	   taking a single pixel of reading width from it. 208px plus the 48px gap
	   fits the 283px either side of the column inside the 1184px layout. */
	.rail {
		position: absolute;
		top: 6px;
		right: calc(100% + 48px);
		bottom: 0;
		display: none;
		width: 208px;
	}

	/* A reading aid rather than navigation furniture: faint until the pointer or
	   the keyboard reaches it. The current row still reads darkest at rest.

	   Pinned well above where it starts: the top bar it clears on the first
	   screen is absolute and scrolls away, so once the reader is into the text
	   there is nothing up there to keep clear of. */
	.rail-nav {
		position: sticky;
		top: 48px;
		opacity: 0.6;
		transition: opacity 250ms ease;
	}

	.rail-nav:hover,
	.rail-nav:focus-within {
		opacity: 1;
	}

	.rail-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.eyebrow {
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-mute);
	}

	.percent {
		font-size: 11px;
		font-variant-numeric: tabular-nums;
		color: var(--color-mute);
	}

	/* The 1px track runs the full height of the list; the fill over it ends
	   part-way through the current row, as far as the reader has got. */
	.track {
		position: relative;
	}

	.track::before,
	.fill {
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		content: "";
	}

	.track::before {
		bottom: 0;
		background: var(--color-line);
	}

	/* Short and linear, as the fill follows the scroll position continuously
	   and anything longer would trail behind it. */
	.fill {
		background: var(--color-line2);
		transition: height 100ms linear;
	}

	.track ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* The marker sits on the track: 1px and mute for the row under the pointer,
	   2px and ink for the current one. */
	.track li {
		position: relative;
	}

	.track li::before {
		position: absolute;
		top: 8px;
		bottom: 8px;
		left: 0;
		width: 1px;
		content: "";
		transition: background-color 150ms ease;
	}

	.track a {
		display: block;
		padding: 5px 0 5px 16px;
		font-size: 13px;
		font-weight: 450;
		line-height: 20px;
		color: var(--color-mute);
		text-decoration: none;
		text-wrap: pretty;
		transition: color 150ms ease;
	}

	.track li:hover::before {
		background: var(--color-mute);
	}

	.track a:hover,
	.track a:focus-visible {
		color: var(--color-ink);
	}

	/* After the hover rules so that pointing at the current row keeps its
	   heavier marker. */
	.track li.is-active::before {
		left: -0.5px;
		width: 2px;
		background: var(--color-ink);
	}

	/* Bolder without a heavier weight: a heavier face is wider, which rewraps the
	   row and shoves everything under it. A stroke thickens the glyphs and leaves
	   every advance width alone, so the lines break the same active or not. */
	.track li.is-active a {
		color: var(--color-ink);
		-webkit-text-stroke: 0.25px currentColor;
	}

	.inline-toc {
		border-bottom: 1px solid var(--color-line);
	}

	.inline-toc summary {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		list-style: none;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
	}

	.inline-toc summary::-webkit-details-marker {
		display: none;
	}

	.chevron {
		flex: none;
		width: 14px;
		height: 14px;
		fill: none;
		stroke: var(--color-mute);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: transform 200ms ease;
	}

	.inline-toc[open] summary .chevron {
		transform: rotate(90deg);
	}

	.inline-toc .track {
		margin: 0 0 12px 3px;
	}

	/* Shorter than 44px on purpose: five headings at full tap height would push
	   the first paragraph off a phone screen. 34px still clears the 24px WCAG
	   2.2 minimum by a wide margin. */
	.inline-toc .track a,
	.bar-panel .track a {
		padding-block: 7px;
		font-size: 14px;
	}

	.inline-toc .track li::before,
	.bar-panel .track li::before {
		top: 7px;
		bottom: 7px;
	}

	/* Parked just above the viewport until the inline list scrolls away. */
	.bar {
		position: fixed;
		inset-inline: 0;
		top: 0;
		z-index: 30;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-bg);
		transform: translateY(-101%);
		transition: transform 220ms ease;
	}

	.bar.is-shown {
		transform: translateY(0);
	}

	.bar-button {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		min-height: 44px;
		padding: 0 20px;
		border: 0;
		background: none;
		font: inherit;
		text-align: left;
		color: var(--color-ink);
		cursor: pointer;
	}

	.bar-current {
		flex: 1 1 auto;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 13px;
		font-weight: 500;
	}

	.bar-button .percent {
		font-size: 12px;
	}

	.bar-button .chevron.is-open {
		transform: rotate(180deg);
	}

	.bar-panel {
		padding: 4px 20px 8px 23px;
		border-top: 1px solid var(--color-line);
	}

	.bar-progress {
		position: absolute;
		bottom: -1px;
		left: 0;
		height: 1px;
		background: var(--color-ink);
		transition: width 100ms linear;
	}

	/* The labels need the full gutter to sit beside the column. Narrower than
	   this the inline list and the bar take over. */
	@media (width >= 1180px) {
		.rail {
			display: block;
		}

		.inline-toc,
		.bar {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rail-nav,
		.fill,
		.track li::before,
		.track a,
		.chevron,
		.bar,
		.bar-progress {
			transition: none;
		}
	}
</style>
