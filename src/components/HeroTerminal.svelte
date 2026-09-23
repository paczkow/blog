<script lang="ts">
type Segment = { text: string; strong: boolean };

// The typing, as the handoff specifies it: a pause, then one character at a
// time on a random interval, so the line lands with a human cadence rather than
// a metronome's.
const START_DELAY_MS = 450;
const MIN_CHAR_MS = 18;
const JITTER_MS = 30;

// Both lines are authored as one i18n string each, with their emphasised
// fragments marked inline. Typing needs a single flat character stream across
// those fragments, so the markup is split into segments here rather than handed
// to `{@html}`; whatever class the dictionary's span carries is ignored and the
// emphasis is re-applied below, which keeps the palette out of the copy.
const EMPHASIS = /<span\b[^>]*>([\s\S]*?)<\/span>/gi;

const toSegments = (html: string): Segment[] => {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of html.matchAll(EMPHASIS)) {
    if (match.index > cursor) {
      segments.push({ text: html.slice(cursor, match.index), strong: false });
    }
    segments.push({ text: match[1], strong: true });
    cursor = match.index + match[0].length;
  }

  if (cursor < html.length) {
    segments.push({ text: html.slice(cursor), strong: false });
  }

  return segments;
};

const {
  line,
  subline,
  /** The shell glyph before the line. `null` drops it. */
  prompt = ">",
}: { line: string; subline: string; prompt?: string | null } = $props();

const segments = $derived(toSegments(line));
const sublineSegments = $derived(toSegments(subline));
const total = $derived(segments.reduce((n, s) => n + s.text.length, 0));

/**
 * How many characters are revealed. `null` means "all of them", which is both
 * the server-rendered state and the one the line returns to when the animation
 * finishes — the page never autoplays it, so a visitor who does not click is
 * looking at plain static text that needed no JavaScript to appear.
 */
let typed = $state<number | null>(null);

/** True during the opening pause, when the cursor sits alone and blinks. */
let waiting = $state(false);

/* Solid while characters are actually appearing, blinking otherwise: a blinking
   cursor mid-word reads as a stall, and a solid one on finished text reads as a
   selection. */
const blinking = $derived(waiting || typed === null);

/* Every character of the final sentence is in the DOM from the first paint;
   typing only moves the boundary between the visible head and the transparent
   tail. That is what keeps the box at its full size throughout — no reserved
   `min-height` to tune per breakpoint, and nothing reflows when the copy
   changes. The tail keeps no `aria-hidden`: head plus tail is exactly the
   sentence, so assistive technology reads the whole line at any point in the
   animation. */
const parts = $derived.by(() => {
  const limit = typed ?? total;
  let start = 0;

  return segments.map((segment, i) => {
    const end = start + segment.text.length;
    const shown = Math.max(0, Math.min(segment.text.length, limit - start));
    // The cursor belongs to whichever segment holds the boundary; the last one
    // keeps it once everything is revealed.
    const holdsCursor =
      limit >= start && (limit < end || i === segments.length - 1);
    start = end;

    return {
      head: segment.text.slice(0, shown),
      tail: segment.text.slice(shown),
      strong: segment.strong,
      holdsCursor,
    };
  });
});

let timer: number | undefined;

const stop = () => {
  window.clearTimeout(timer);
  timer = undefined;
};

const replay = () => {
  // Asked at click time, not once at startup: a visitor who turns the
  // preference on mid-session means it from that click on.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // A click that ends a text selection is someone reading the line, not asking
  // for the animation again.
  if (window.getSelection()?.isCollapsed === false) return;

  stop();
  typed = 0;
  waiting = true;

  const step = () => {
    const next = (typed ?? 0) + 1;
    if (next >= total) {
      typed = null;
      return;
    }
    typed = next;
    timer = window.setTimeout(step, MIN_CHAR_MS + Math.random() * JITTER_MS);
  };

  timer = window.setTimeout(() => {
    waiting = false;
    step();
  }, START_DELAY_MS);
};

let root = $state<HTMLElement>();

/* The listener is attached by hand rather than with `onclick` because the line
   is a sentence, not a control: replaying the typing is decoration, it reveals
   nothing that is not already on screen, and giving it a button's role — or a
   keyboard path to an animation of text the reader can already read — would
   promise a feature where there is only a flourish. Bound this way the markup
   stays plain text for everyone who never clicks it. */
$effect(() => {
  root?.addEventListener("click", replay);
  return () => {
    root?.removeEventListener("click", replay);
    stop();
  };
});
</script>

<!-- No line breaks inside the runs of spans below: they collapse into spaces the
	copy does not have. The segments carry their own spacing. -->
<div class="flex flex-col gap-[14px]">
	<div
		bind:this={root}
		class="text-sub grid max-w-[34ch] grid-cols-[auto_minmax(0,1fr)] gap-[0.6em] font-mono text-[13px] leading-[1.7]"
	>
		{#if prompt}
			<!-- `mute`, not `line2`: the design's first pass put the glyph at `line2`,
			     where it fails contrast against `bg` (~1.8:1). -->
			<span aria-hidden="true" class="text-mute select-none">{prompt}</span>
		{:else}
			<span></span>
		{/if}
		<span class="text-pretty"
			>{#each parts as part, i (i)}<span
					class={part.strong ? "text-ink font-medium" : ""}>{part.head}</span
				>{#if part.holdsCursor}<span
						aria-hidden="true"
						class="caret"
						class:blink={blinking}
					></span>{/if}<span class="opacity-0">{part.tail}</span>{/each}</span
		>
	</div>
	<p class="text-sub max-w-[40ch] text-sm leading-[1.6] text-pretty"
		>{#each sublineSegments as segment, i (i)}<span
				class={segment.strong ? "text-ink font-medium" : ""}>{segment.text}</span
			>{/each}</p
	>
</div>

<style>
	/* A block, not the underscore the old subtitle used: at 13px mono the line is
	   a terminal, and a terminal's cursor covers the cell. Sized in `em` so it
	   tracks the font rather than a breakpoint. */
	.caret {
		display: inline-block;
		width: 0.5em;
		height: 1.05em;
		margin-left: 0.1em;
		vertical-align: -0.2em;
		background: var(--color-ink);
	}

	/* `steps(1)` so it snaps on and off — a fading cursor reads as a glow. */
	.caret.blink {
		animation: caret-blink 1.05s steps(1) infinite;
	}

	@keyframes caret-blink {
		0%,
		49% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.caret.blink {
			animation: none;
		}
	}
</style>
