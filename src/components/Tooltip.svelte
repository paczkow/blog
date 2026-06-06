<script lang="ts">
	import {
		autoUpdate,
		computePosition,
		flip,
		offset,
		shift,
	} from "@floating-ui/dom";
	import type { Snippet } from "svelte";

	let tooltipCounter = 0;

	let {
		content,
		children,
	}: {
		content: string;
		children: Snippet;
	} = $props();

	let reference = $state<HTMLElement | null>(null);
	let floating = $state<HTMLElement | null>(null);
	let isOpen = $state(false);
	let canHover = $state(false);
	let showTimeout: ReturnType<typeof setTimeout> | undefined;
	const tooltipId = `tooltip-${++tooltipCounter}`;

	$effect(() => {
		const query = window.matchMedia("(hover: hover) and (pointer: fine)");
		canHover = query.matches;

		const onChange = (event: MediaQueryListEvent) => {
			canHover = event.matches;
			if (!event.matches) hide();
		};

		query.addEventListener("change", onChange);

		return () => {
			query.removeEventListener("change", onChange);
		};
	});

	$effect(() => {
		if (!isOpen || canHover) return;

		const dismiss = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (reference?.contains(target) || floating?.contains(target)) return;
			hide();
		};

		document.addEventListener("pointerdown", dismiss);

		return () => {
			document.removeEventListener("pointerdown", dismiss);
		};
	});

	async function updatePosition() {
		if (!reference || !floating) return;

		const { x, y } = await computePosition(reference, floating, {
			placement: "bottom",
			middleware: [offset(6), flip(), shift({ padding: 8 })],
		});

		Object.assign(floating.style, {
			left: `${x}px`,
			top: `${y}px`,
		});
	}

	$effect(() => {
		if (!isOpen || !floating) return;

		document.body.appendChild(floating);

		return () => {
			floating?.remove();
		};
	});

	$effect(() => {
		if (!isOpen || !reference || !floating) return;

		return autoUpdate(reference, floating, updatePosition);
	});

	function show() {
		if (!canHover) return;

		clearTimeout(showTimeout);
		showTimeout = setTimeout(() => {
			isOpen = true;
		}, 250);
	}

	function hide() {
		clearTimeout(showTimeout);
		isOpen = false;
	}

	function toggleTouch(event: MouseEvent) {
		if (canHover) return;

		event.preventDefault();
		event.stopPropagation();
		isOpen = !isOpen;
	}
</script>

<span
	bind:this={reference}
	onmouseenter={show}
	onmouseleave={hide}
	onclick={toggleTouch}
	aria-describedby={isOpen ? tooltipId : undefined}
	class="inline-flex touch-manipulation"
>
	{@render children()}
</span>

{#if isOpen}
	<div
		bind:this={floating}
		id={tooltipId}
		role="tooltip"
		class="tooltip-popup pointer-events-none fixed z-[80] max-w-48 rounded px-2 py-1 text-xs leading-snug"
	>
		{content}
	</div>
{/if}
