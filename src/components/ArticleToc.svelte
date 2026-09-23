<script lang="ts">
type TocHeading = { id: string; text: string };

type ArticleTocI18n = {
  label: string;
  read: string;
  end: string;
};

const {
  headings,
  title,
  i18n,
}: { headings: TocHeading[]; title: string; i18n: ArticleTocI18n } = $props();

// The rail's first dot is a way back to the top of the page, so it points at
// the article title rather than at a heading in the body. The title names it for
// screen readers only: the reader has just seen it in full above the fold, and
// repeated beside the dot it would only crowd out the headings that follow. It
// and the end dot are left unlabelled, bracketing the headings between them.
const entries: TocHeading[] = [
  { id: "article-title", text: title },
  ...headings,
];

// The footer under the article: the last thing on the page, so jumping to it
// scrolls as far as the page goes and lands the reader at 100%.
const endId = "article-end";

let activeId = $state(entries[0].id);
const activeIndex = $derived(
  entries.findIndex((entry) => entry.id === activeId),
);

// How far down the filled thread reaches, in rows: every section behind the
// reader in full, plus the part of the current one read so far. It meets each
// dot exactly as that dot becomes the active one, and the end-of-text dot one
// row past the last heading exactly as the page runs out of scroll.
let reach = $state(0);

let progress = $state(0);
const percent = $derived(Math.round(progress * 100));

// Set while a click-to-scroll is in flight: the smooth scroll would otherwise
// walk the active dot through every heading it passes on the way.
let locked = false;

$effect(() => {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress = ratio;

    if (locked) return;

    // How far each heading has travelled past the threshold line: positive
    // once it has scrolled above it.
    const threshold = window.innerHeight * 0.4;
    const passed = entries.map((entry) => {
      const element = document.getElementById(entry.id);
      return element
        ? threshold - element.getBoundingClientRect().top
        : Number.NEGATIVE_INFINITY;
    });
    // The end of the text, measured the same way: it crosses the moment the
    // page can scroll no further.
    const end = window.scrollY - max;

    // The last heading can be too short to ever cross the threshold, so the
    // bottom of the page claims it outright.
    if (ratio >= 0.999) {
      activeId = entries[entries.length - 1].id;
      reach = entries.length;
      return;
    }

    let index = 0;
    passed.forEach((distance, i) => {
      if (distance >= 0) index = i;
    });
    activeId = entries[index].id;

    // Before the title itself reaches the threshold even the first row is
    // unread, which would otherwise come out as a negative reach. A page too
    // short to scroll has nothing to measure against, so the span is guarded.
    const span = passed[index] - (passed[index + 1] ?? end);
    const fraction =
      span > 0 && Number.isFinite(span) ? Math.min(1, passed[index] / span) : 0;
    reach = Math.max(0, index + fraction);
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
// hold the dot the reader just picked until the scroll settles. The end dot is
// one row past the last heading, which stays the active one.
function hold(id: string) {
  const index =
    id === endId
      ? entries.length
      : entries.findIndex((entry) => entry.id === id);
  locked = true;
  activeId = entries[Math.min(index, entries.length - 1)].id;
  reach = index;
  setTimeout(() => {
    locked = false;
  }, 1000);
}
</script>

<aside class="rail">
	<nav class="rail-nav" aria-label={i18n.label} style:--reach={reach}>
		<ul>
			{#each entries as entry, index (entry.id)}
				<li>
					<a
						href="#{entry.id}"
						class="stop"
						class:is-done={index < activeIndex}
						class:is-active={index === activeIndex}
						aria-label={entry.text}
						aria-current={index === activeIndex ? "location" : undefined}
						onclick={() => hold(entry.id)}
					>
						<span class="dot" aria-hidden="true"></span>
						{#if index > 0}
							<span class="stop-label" aria-hidden="true">{entry.text}</span>
						{/if}
					</a>
				</li>
			{/each}

			<!-- The end of the text, one row past the last heading. It fills once
			     the reader gets to it. -->
			<li>
				<a
					href="#{endId}"
					class="stop"
					class:is-done={reach >= entries.length}
					aria-label={i18n.end}
					onclick={() => hold(endId)}
				>
					<span class="dot" aria-hidden="true"></span>
				</a>
			</li>
		</ul>

		<div class="progress" aria-hidden="true">
			<span class="progress-label">{percent}% {i18n.read}</span>
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
	   taking a single pixel of reading width from it. The 4px drop puts the
	   first dot 116px down the page, level with the start of the header. */
	.rail {
		position: absolute;
		top: 4px;
		bottom: 0;
		left: calc(100% + 40px);
		display: flex;
		justify-content: flex-start;
		width: 20px;
	}

	/* A reading aid rather than navigation furniture: faint until the pointer or
	   the keyboard reaches it. Every row is one pitch tall with nothing between
	   them, so the pointer is always over some link while it is on the rail and
	   plain `:hover` can carry the reveal.

	   Pinned well above where it starts: the top bar it clears on the first
	   screen is absolute and scrolls away, so once the reader is into the text
	   there is nothing up there to keep clear of. */
	.rail-nav {
		--pitch: 28px;
		position: sticky;
		top: 48px;
		height: fit-content;
		opacity: 0.55;
		transition: opacity 250ms ease-out;
	}

	/* Below 1180 the labels would have nowhere to unfold into, so the whole-rail
	   reveal — brightening the nav and every label at once — is gated there. An
	   individually hovered dot still reveals its own label at any width the rail
	   exists at; that rule lives with `.stop-label` below. */
	@media (width >= 1180px) {
		.rail-nav:hover,
		.rail-nav:focus-within {
			opacity: 1;
		}
	}

	.rail-nav ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* The thread runs from the centre of the first row to the centre of the
	   end-of-text row — one row above the percentage, which sits off the end of
	   it — and its filled part is `--reach` rows long. Drawn on the nav, not the
	   list, so it spans the end row too; the sticky nav is already the
	   containing block for it. 3px from the left puts the 1px line through the
	   centre of the 7px dots. */
	.rail-nav::before,
	.rail-nav::after {
		position: absolute;
		top: calc(var(--pitch) / 2);
		left: 3px;
		width: 1px;
		content: "";
	}

	.rail-nav::before {
		bottom: calc(var(--pitch) * 1.5);
		background: var(--color-line2);
	}

	/* Short and linear, as the fill follows the scroll position continuously
	   and anything longer would trail behind it. */
	.rail-nav::after {
		height: calc(var(--reach) * var(--pitch));
		background: var(--color-ink);
		transition: height 100ms linear;
	}

	/* Lifted above the thread: the nav's `::after` is positioned and comes
	   last in tree order, so without a z-index it would paint across the dots. */
	.stop {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		width: 20px;
		height: var(--pitch);
	}

	/* Small on purpose: the rail sits in the reader's peripheral vision and
	   should never pull the eye off the text. The page-colour fill is what
	   breaks the thread at each hollow dot. */
	.dot {
		display: block;
		flex: none;
		width: 7px;
		height: 7px;
		border: 1px solid var(--color-line2);
		border-radius: 50%;
		background: var(--color-bg);
		transition:
			background-color 250ms ease-out,
			border-color 250ms ease-out,
			transform 250ms ease-out;
	}

	.stop:hover .dot,
	.stop:focus-visible .dot {
		border-color: var(--color-sub);
	}

	/* After the hover rule so that pointing at a dot already read does not
	   hollow it back out. */
	.stop.is-done .dot,
	.stop.is-active .dot {
		border-color: var(--color-ink);
		background: var(--color-ink);
	}

	/* Scaled rather than resized, so it grows about the thread instead of
	   pushing off it to the right. */
	.stop.is-active .dot {
		transform: scale(1.3);
	}

	/* The label is part of the link, not a caption beside it: it spans the full
	   row height and starts where the 20px dot column ends, so the pointer can
	   travel from a dot onto its title — or straight onto a title still hidden —
	   without ever leaving the link, and a click anywhere on it follows it. */
	.stop-label,
	.progress-label {
		position: absolute;
		top: 0;
		left: 20px;
		height: var(--pitch);
		padding-left: 2px;
		pointer-events: none;
		white-space: nowrap;
		font-size: 10.5px;
		line-height: var(--pitch);
		letter-spacing: 0.01em;
		color: var(--color-mute);
		opacity: 0;
		transform: translateX(-3px);
		transition:
			opacity 250ms ease-out,
			transform 250ms ease-out,
			color 250ms ease-out;
	}

	/* The width cap is what is left between the label's left edge — half the
	   viewport, plus half the 617px column, the 40px gap and the 20px dot
	   column — and a 24px margin to the viewport's right edge, so a label never
	   runs off the page at the narrow end of the range the rail exists in. */
	.stop-label {
		max-width: min(240px, calc(50vw - 392px));
		overflow: hidden;
		pointer-events: auto;
		text-overflow: ellipsis;
	}

	.stop:hover .stop-label,
	.stop:focus-visible .stop-label,
	.stop.is-active .stop-label {
		color: var(--color-ink);
	}

	/* One dot at a time answers for itself at any width the rail exists at: a
	   single label has room to unfold even where the full set would not. */
	.stop:hover .stop-label,
	.stop:focus-visible .stop-label {
		opacity: 1;
		transform: translateX(0);
	}

	/* Revealing every label at once needs clear space to the right of the rail.
	   Narrower than this and they would run into the edge of the viewport. */
	@media (width >= 1180px) {
		.rail-nav:hover :is(.stop-label, .progress-label),
		.rail-nav:focus-within :is(.stop-label, .progress-label) {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.progress {
		position: relative;
		height: var(--pitch);
	}

	.inline-toc {
		display: none;
		flex-direction: column;
		gap: 10px;
		padding: 18px 0;
		border-bottom: 1px solid var(--color-line);
	}

	.inline-label {
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
