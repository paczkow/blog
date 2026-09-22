<script lang="ts">
type TocHeading = { id: string; text: string };

type ArticleTocI18n = {
  label: string;
  top: string;
};

const { headings, i18n }: { headings: TocHeading[]; i18n: ArticleTocI18n } =
  $props();

// The rail's first tick is a way back to the top of the page, so it points at
// the article title rather than at a heading in the body.
const entries: TocHeading[] = [
  { id: "article-title", text: i18n.top },
  ...headings,
];

let activeId = $state(entries[0].id);
let progress = $state(0);
const percent = $derived(Math.round(progress * 100));

// Hover is state rather than CSS `:hover` because it has to outlive the tick
// the pointer is on: the ticks are 12px tall with 9px of nothing between them,
// so a plain `:hover` would drop the reveal every time the pointer crossed a
// gap. The last tick pointed at stays lit until the pointer leaves the rail.
let hoverId = $state<string | null>(null);

function setHover(id: string | null) {
  hoverId = id;
}

// Set while a click-to-scroll is in flight: the smooth scroll would otherwise
// walk the active tick through every heading it passes on the way.
let locked = false;

$effect(() => {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress = ratio;

    if (locked) return;

    const threshold = window.innerHeight * 0.4;
    let next = entries[0].id;
    for (const entry of entries) {
      const element = document.getElementById(entry.id);
      if (element && element.getBoundingClientRect().top <= threshold) {
        next = entry.id;
      }
    }

    // The last heading can be too short to ever cross the threshold, so the
    // bottom of the page claims it outright.
    activeId = ratio >= 0.999 ? entries[entries.length - 1].id : next;
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

// The jump itself is the browser's: these are real anchors, and the 120px
// offset is the targets' own `scroll-margin-top`. All that is left for JS is to
// hold the tick the reader just picked until the scroll settles.
function hold(id: string) {
  locked = true;
  activeId = id;
  setTimeout(() => {
    locked = false;
  }, 1000);
}
</script>

<aside class="rail">
	<nav class="rail-nav" aria-label={i18n.label} onmouseleave={() => setHover(null)}>
		<ul>
			{#each entries as entry (entry.id)}
				<li>
					<a
						href="#{entry.id}"
						class="tick-link"
						class:is-active={activeId === entry.id}
						class:is-hovered={hoverId === entry.id}
						aria-label={entry.text}
						aria-current={activeId === entry.id ? "location" : undefined}
						onclick={() => hold(entry.id)}
						onmouseenter={() => setHover(entry.id)}
					>
						<span class="tick" aria-hidden="true"></span>
						<span class="tick-label" aria-hidden="true">{entry.text}</span>
					</a>
				</li>
			{/each}
		</ul>

		<div class="progress">
			<span class="progress-track" aria-hidden="true">
				<span class="progress-fill" style="width:{percent}%"></span>
			</span>
			<span class="progress-label" aria-hidden="true">{percent}%</span>
		</div>
	</nav>
</aside>

<nav class="inline-toc" aria-label={i18n.label}>
	<div class="inline-label">{i18n.label}</div>
	<ol>
		{#each headings as heading (heading.id)}
			<li>
				<a href="#{heading.id}" onclick={() => hold(heading.id)}>
					<span>{heading.text}</span>
				</a>
			</li>
		{/each}
	</ol>
</nav>

<style>
	/* Absolute, and 20px wide, so the rail hangs beside the 617px column without
	   taking a single pixel of reading width from it. */
	.rail {
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(100% + 40px);
		display: flex;
		justify-content: flex-start;
		width: 20px;
	}

	/* A reading aid rather than navigation furniture: faint until the pointer or
	   the keyboard reaches it. */
	.rail-nav {
		position: sticky;
		top: 116px;
		display: flex;
		flex-direction: column;
		gap: 9px;
		height: fit-content;
		opacity: 0.55;
		transition: opacity 250ms ease-out;
	}

	/* Below 1180 the labels would have nowhere to unfold into, so the whole-rail
	   reveal — brightening the nav, the inactive ticks and every label at once —
	   is gated there. An individually hovered tick still reveals its own label at
	   any width the rail exists at; that rule lives with `.tick-link` below. */
	@media (width >= 1180px) {
		.rail-nav:hover,
		.rail-nav:focus-within {
			opacity: 1;
		}
	}

	.rail-nav ul {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 9px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rail-nav li {
		position: relative;
		display: flex;
	}

	.tick-link {
		position: relative;
		display: flex;
		align-items: center;
		width: 20px;
		height: 12px;
	}

	.tick {
		display: block;
		flex: none;
		width: 10px;
		height: 1px;
		background: var(--color-line2);
		opacity: 0.5;
		transition:
			width 250ms ease-out,
			opacity 250ms ease-out,
			background-color 250ms ease-out;
	}

	/* Stays ahead of the per-tick rules below: media queries add no specificity,
	   so moving this after them would let it beat the hovered and active ticks. */
	@media (width >= 1180px) {
		.rail-nav:hover .tick,
		.rail-nav:focus-within .tick {
			opacity: 0.75;
		}
	}

	.tick-link.is-hovered .tick,
	.tick-link:focus-visible .tick {
		width: 16px;
		background: var(--color-sub);
		opacity: 0.9;
	}

	/* After the hover rule so that pointing at the active tick does not shrink
	   it back to the hover width. */
	.tick-link.is-active .tick {
		width: 20px;
		background: var(--color-sub);
		opacity: 1;
	}

	.tick-label,
	.progress-label {
		position: absolute;
		top: 50%;
		left: 26px;
		pointer-events: none;
		font-family: var(--font-mono);
		color: var(--color-mute);
		opacity: 0;
	}

	.tick-label {
		max-width: 190px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 10.5px;
		line-height: 1.4;
		letter-spacing: 0.01em;
		transform: translateY(-50%) translateX(-3px);
		transition:
			opacity 250ms ease-out,
			transform 250ms ease-out,
			color 250ms ease-out;
	}

	.progress-label {
		font-size: 10px;
		transform: translateY(-50%);
		transition: opacity 250ms ease-out;
	}

	.tick-link.is-hovered .tick-label,
	.tick-link:focus-visible .tick-label,
	.tick-link.is-active .tick-label {
		color: var(--color-sub);
	}

	/* One tick at a time answers for itself at any width the rail exists at: a
	   single label has room to unfold even where the full set would not. */
	.tick-link.is-hovered .tick-label,
	.tick-link:focus-visible .tick-label {
		opacity: 1;
		transform: translateY(-50%) translateX(0);
	}

	/* Revealing every label at once needs clear space to the right of the rail.
	   Narrower than this and they would run into the edge of the viewport. */
	@media (width >= 1180px) {
		.rail-nav:hover .tick-label,
		.rail-nav:focus-within .tick-label {
			opacity: 1;
			transform: translateY(-50%) translateX(0);
		}

		.rail-nav:hover .progress-label,
		.rail-nav:focus-within .progress-label {
			opacity: 1;
		}
	}

	/* 16px, not the design's `height: 12px`: the design is content-box, so its
	   4px of padding sits outside the 12px and the track centres below it. Under
	   the border-box everything here inherits, the total has to be written out. */
	.progress {
		position: relative;
		display: flex;
		align-items: center;
		width: 20px;
		height: 16px;
		padding-top: 4px;
	}

	.progress-track {
		position: relative;
		display: block;
		flex: none;
		width: 20px;
		height: 1px;
		background: var(--color-line);
	}

	.progress-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 1px;
		background: var(--color-sub);
		transition: width 100ms linear;
	}

	.inline-toc {
		display: none;
		flex-direction: column;
		gap: 10px;
		padding: 18px 0;
		border-bottom: 1px solid var(--color-line);
	}

	.inline-label {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-mute);
	}

	.inline-toc ol {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* `fit-content` so the row — and with it the hit area and the focus ring —
	   stops at the end of the heading instead of spanning the reading column. */
	.inline-toc a {
		display: flex;
		width: fit-content;
		font-size: 14px;
		line-height: 1.45;
		color: var(--color-sub);
		text-decoration: none;
		transition: color 150ms;
	}

	.inline-toc a:hover {
		color: var(--color-ink);
	}

	@media (width < 1000px) {
		.rail {
			display: none;
		}

		.inline-toc {
			display: flex;
		}
	}
</style>
