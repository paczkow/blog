<script lang="ts">
import { tick } from "svelte";

type Segment = { text: string; strong: boolean };

const DELAY_MS = 350;
const CHAR_MS = 26;

// Left on `<html>` by the inline script the home pages run before this
// paragraph is parsed, and the only thing that decides whether to animate:
// the styles below hide the server-rendered sentence while it is there, and
// this component clears it the moment it owns the text instead.
const WILL_TYPE = "data-subtitle-typing";

// The subtitle is authored as a single i18n string with its emphasised
// fragments marked up inline. Typing needs one flat character stream across
// those fragments, so the markup is split into segments here rather than
// injected with `set:html`; the class on the incoming span is ignored, the
// emphasis is re-applied below.
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

const { html }: { html: string } = $props();

const segments = $derived(toSegments(html));
const total = $derived(segments.reduce((n, s) => n + s.text.length, 0));

// `null` means "the whole thing": the state the server renders, and the one a
// return visit, reduced motion or a page without JS never leaves.
let typed = $state<number | null>(null);

const typing = $derived(typed !== null);

const shown = $derived.by(() => {
  const limit = typed;
  if (limit === null) return segments.map((segment) => segment.text);

  let left = limit;
  return segments.map((segment) => {
    const text = segment.text.slice(0, Math.max(0, left));
    left -= segment.text.length;
    return text;
  });
});

$effect(() => {
  const root = document.documentElement;

  // Reduced motion and the once-per-session rule were both settled before the
  // first paint — they had to be, or the finished sentence flashes. Asking the
  // same questions again here would only let the two answers drift apart.
  if (!root.hasAttribute(WILL_TYPE)) return;

  typed = 0;

  // Not before the empty string is in the DOM: dropping the mark any earlier
  // hands the server-rendered sentence the frame this whole dance avoids.
  tick().then(() => root.removeAttribute(WILL_TYPE));

  // Driven off the clock rather than a per-character counter so a busy main
  // thread drops characters instead of stretching the animation.
  const startAt = performance.now() + DELAY_MS;
  const timer = window.setInterval(() => {
    const count = Math.floor((performance.now() - startAt) / CHAR_MS);
    if (count >= total) {
      window.clearInterval(timer);
      typed = null;
      return;
    }
    typed = Math.max(0, count);
  }, CHAR_MS);

  return () => window.clearInterval(timer);
});
</script>

<!-- No line breaks between the spans: they would collapse into spaces the
	subtitle does not have. The segments carry their own spacing. -->
<p
	class="subtitle text-sub min-h-[3.2em] max-w-[28ch] text-pretty"
>{#each shown as text, i (i)}<span class={segments[i].strong ? "text-ink font-medium" : ""}>{text}</span>{/each}<span aria-hidden="true" class="caret" class:blink={!typing}></span></p>

<style>
	/* Hidden from the very first frame — the mark is already on `<html>` by the
	   time the parser reaches this paragraph, so the sentence below never gets
	   painted before the animation blanks it. The whole paragraph goes, caret
	   included, rather than leaving one stranded beside invisible words; the box
	   stays, because `min-height` is what keeps typing from shifting the page
	   and `visibility` preserves it where `display: none` would not. */
	:global(html[data-subtitle-typing]) .subtitle {
		visibility: hidden;

		/* Only the island clears the mark, so an island that never hydrates — a
		   chunk lost to a bad deploy or a dropped connection — would hide the
		   subtitle for good. The hidden state expires by itself instead. */
		animation: subtitle-failsafe 0s linear 2s forwards;
	}

	@keyframes subtitle-failsafe {
		to {
			visibility: visible;
		}
	}

	/* A 1px underscore rather than a block: it sits on the baseline of the last
	   line without changing its height. */
	.caret {
		display: inline-block;
		width: 0.55em;
		height: 1px;
		margin-left: 0.25em;
		vertical-align: -0.05em;
		background: var(--color-ink);
	}

	/* `steps(1)` so it snaps on and off — a fading caret reads as a glow. */
	.caret.blink {
		animation: caret-blink 1.1s steps(1) infinite;
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
