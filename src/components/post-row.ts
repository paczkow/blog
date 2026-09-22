/**
 * The post row, as class strings rather than markup: home and the 404 use the
 * Astro component next to this file, the archive renders the same row from a
 * Svelte island, and a single visual definition is the only way the two stay
 * identical. Below 700px the meta line moves above the title.
 *
 * No hairline between rows, deliberately against the prototype's ruled system:
 * spacing separates them and the hover tint is the only drawn shape. So the tint
 * has to read as a card — `bg2`, rounded, no border and no shadow — and it needs
 * air around the text to do that. `-mx-3 px-3` gives it 12px of overhang on each
 * side without moving a single character: the padding puts back exactly what the
 * margin took. Above 700px the right side already has its 12px from the
 * prototype's `padding-right`, so only the margin is cancelled there.
 */

/* Two speeds in one declaration. The tint keeps the design's 200ms; the lift —
   opacity and transform — runs at 300ms. Both were read off the reference
   capture frame by frame: the tint reaches full `bg2` ~200ms after the pointer
   lands, the lifted card's right edge settles ~300ms after, and fitting the
   sibling fade against the usual curves puts `ease` an order of magnitude ahead
   of `ease-out` or `linear` — which is the theme's default timing function, so
   it is inherited rather than named. A Tailwind `transition-*` utility carries
   one duration for its whole property list, hence the raw shorthand.

   `scale` and `translate`, not `transform`: Tailwind 4 compiles `scale-*` and
   `translate-x-*` to the individual transform properties, which `transition:
   transform` does not cover — naming only `transform` leaves the lift snapping
   into place while the tint fades. */
const rowTransition =
  "[transition:background-color_200ms_var(--default-transition-timing-function),opacity_300ms_var(--default-transition-timing-function),scale_300ms_var(--default-transition-timing-function),translate_300ms_var(--default-transition-timing-function)]";

/* The lift: hovering a row drops every other one to 40% and 0.99 while the
   hovered one stays lit, grows 1.5% out of its left edge and slides 6px right —
   a card picking itself up off the stack rather than a tint sliding down a
   list. The list scope comes from `postListClass`.

   The trigger is `:has(a:hover)` on the list, not the list's own `:hover`: the
   archive's year separators and any dead space between rows are part of the
   list box, and receding the whole stack while nothing is lifting reads as a
   glitch. Both group variants are needed — `group-has-[a:hover]/list` is the
   real condition, and `group-hover/list` is what wraps the rule in Tailwind's
   `(hover: hover)` media query, which an arbitrary `:has()` selector does not
   get on its own. Without it a tablet's sticky post-tap `:hover` would dim the
   list on a device where `hover:bg-bg2` and the lift itself never fire.

   `not-hover:not-focus-visible:` instead of a competing `hover:opacity-100`
   override: the dimmed and lifted states are then mutually exclusive, so
   neither depends on the order Tailwind happens to emit them in. The
   `not-focus-visible` half is what keeps a keyboard-focused row lit when the
   pointer wanders onto a different one.

   Gated to 700px and up. Below it the row is a full-bleed two-line block whose
   card already runs 12px into the page's 20px gutter, so 1.5% of ~350px plus
   6px would push it past the viewport edge; there is also no pointer on a phone
   to lift anything with. `motion-safe:` carries every transform, so
   `prefers-reduced-motion: reduce` keeps the dimming (an opacity cross-fade is
   not motion, and without it the hover state loses the "everything else
   recedes" reading entirely) and gets none of the movement. */
const rowLift = [
  "min-[700px]:origin-left",
  "min-[700px]:hover:z-10 min-[700px]:focus-visible:z-10",
  "min-[700px]:group-hover/list:group-has-[a:hover]/list:not-hover:not-focus-visible:opacity-40",
  "min-[700px]:motion-safe:group-hover/list:group-has-[a:hover]/list:not-hover:not-focus-visible:scale-[0.99]",
  "min-[700px]:motion-safe:hover:translate-x-1.5 min-[700px]:motion-safe:hover:scale-[1.015]",
  "min-[700px]:motion-safe:focus-visible:translate-x-1.5 min-[700px]:motion-safe:focus-visible:scale-[1.015]",
].join(" ");

export const postRowClass = `group tap-highlight relative -mx-3 grid grid-cols-[minmax(0,1fr)] gap-4 rounded-[10px] px-3 py-5 no-underline hover:bg-bg2 focus-visible:bg-bg2 touch:active:bg-bg2 focus-visible:-outline-offset-2 min-[700px]:mr-0 min-[700px]:grid-cols-[minmax(0,1fr)_96px] min-[700px]:py-[22px] ${rowTransition} ${rowLift}`;

/**
 * The list the rows sit in. A row's hover state has to reach its siblings, so
 * the wrapper carries the named group they all read — home and archive both use
 * this so the two lists cannot drift apart.
 */
export const postListClass = "group/list flex flex-col";

export const postRowBodyClass = "flex min-w-0 flex-col gap-1.5";

export const postRowTitleClass =
  "text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-pretty text-ink";

/* Pinned in px, not the design's `60ch`: `ch` is a font metric, and Inter's is
   narrower than the Geist the design was drawn in, so 60ch capped the measure
   27px short and wrapped every description a line long. 592px is the width the
   design's cap actually rendered at. */
export const postRowDescriptionClass =
  "max-w-[592px] text-sm leading-[1.6] text-pretty text-sub";

export const postRowMetaClass =
  "-order-1 flex flex-row items-center gap-3 font-mono text-xs whitespace-nowrap text-mute min-[700px]:order-none min-[700px]:flex-col min-[700px]:items-end min-[700px]:gap-1 min-[700px]:pt-[3px]";

/** Wraps the optional locale label and the read time so they stay on one line. */
export const postRowReadClass = "flex gap-2";

export const postRowLangClass = "text-sub";

export const postRowArrowClass =
  "hidden text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 touch:group-active:opacity-100 min-[700px]:mt-1 min-[700px]:inline";
