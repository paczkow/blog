<script lang="ts">
	// Home sidebar atmosphere — a faint monospace character grid. The pointer wakes the cells
	// around it, each picking a symbol that fades back out and leaves a decaying trail.
	// Ported 1:1 from the design bundle's `glyph-bg.js`: every constant, exponent and decay
	// factor below is a tuned design value, not a guess, so change them only against that file.

	const CW = 18;
	const CH = 18;
	const R = 88;
	const GLYPHS = [
		"+", "·", "/", "|", "×", "=", "{", "}", "<", ">",
		";", "∑", "√", "∫", "≈", "≠", "∂", "λ", "π", "∞",
		"[", "]", "(", ")", "^", "&", "%", "!", "?", "*",
		"/>", "=>", "::", "&&", "||", "!=", "++", "0x", "fn", "if",
	];

	// Cheap deterministic noise: the same cell and seed always pick the same glyph.
	const hash = (i: number, j: number, s: number) => {
		const n = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453;
		return n - Math.floor(n);
	};
	const roll = (i: number, j: number, seed: number) =>
		Math.floor(hash(i, j, seed) * GLYPHS.length) % GLYPHS.length;

	const INK_DARK = "237,237,237";
	const INK_LIGHT = "23,23,23";

	// `rgba()` needs a bare triple, while the design token is authored as a hex string.
	const toRgb = (value: string, fallback: string) => {
		const hex = value.replace("#", "");
		if (/^[0-9a-f]{3}$/i.test(hex)) {
			const [r, g, b] = [...hex].map((c) => Number.parseInt(c + c, 16));
			return `${r},${g},${b}`;
		}
		if (/^[0-9a-f]{6}$/i.test(hex)) {
			const n = Number.parseInt(hex, 16);
			return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
		}
		const channels = value.startsWith("rgb") && value.match(/\d*\.?\d+/g);
		return channels && channels.length >= 3
			? channels.slice(0, 3).map(Number).map(Math.round).join(",")
			: fallback;
	};

	// The field has to follow whatever the theme currently paints text with, so it reads the
	// live `ink` token instead of taking a colour prop the way the prototype did.
	const readInk = () => {
		const dark = document.documentElement.classList.contains("dark");
		const fallback = dark ? INK_DARK : INK_LIGHT;
		const token = getComputedStyle(document.documentElement)
			.getPropertyValue("--color-ink")
			.trim();
		return { dark, ink: token ? toRgb(token, fallback) : fallback };
	};

	let {
		intensity = 0.9,
		accent = "255,60,50",
	}: {
		intensity?: number;
		accent?: string;
	} = $props();

	let host: HTMLDivElement | undefined = $state();
	let canvas: HTMLCanvasElement | undefined = $state();

	$effect(() => {
		const hostEl = host;
		const canvasEl = canvas;
		if (!hostEl || !canvasEl) return;

		const ctx = canvasEl.getContext("2d");
		if (!ctx) return;

		// An absolutely positioned box inside a sticky sidebar still reports 0×0 while the
		// grid resolves, which would bake in a 1×1 canvas — the parent is already correct
		// by then, so measure that until this element has a size of its own.
		const boxEl = () => {
			const r = hostEl.getBoundingClientRect();
			return r.width && r.height ? hostEl : (hostEl.parentElement ?? hostEl);
		};
		const size = (): [number, number] => {
			const r = boxEl().getBoundingClientRect();
			return [
				Math.max(1, Math.round(r.width) || hostEl.clientWidth || 1),
				Math.max(1, Math.round(r.height) || hostEl.clientHeight || 1),
			];
		};

		let [w, h] = size();
		let dpr = window.devicePixelRatio || 1;
		let cols = 1;
		let rows = 1;
		let heat = new Float32Array(1);
		let gid = new Uint8Array(1);
		let born = new Float32Array(1);

		const resize = () => {
			[w, h] = size();
			dpr = window.devicePixelRatio || 1;
			canvasEl.width = w * dpr;
			canvasEl.height = h * dpr;
			canvasEl.style.width = `${w}px`;
			canvasEl.style.height = `${h}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			cols = Math.ceil(w / CW) + 1;
			rows = Math.ceil(h / CH) + 1;
			heat = new Float32Array(cols * rows);
			gid = new Uint8Array(cols * rows);
			born = new Float32Array(cols * rows);
		};
		resize();

		const ro = new ResizeObserver(resize);
		ro.observe(hostEl);
		window.addEventListener("resize", resize);
		const checkSize = () => {
			const [nw, nh] = size();
			if (nw !== w || nh !== h) resize();
		};
		// Three safety nets on top of the observer, all of which the prototype needs: the
		// observer never fires when the box was measured before layout settled, `resize`
		// alone misses sticky/font reflows, and the polled check catches whatever is left.
		const firstFrame = requestAnimationFrame(resize);
		const timers: ReturnType<typeof setTimeout>[] = [
			setTimeout(resize, 120),
			setTimeout(resize, 400),
		];

		const m = { x: -9999, y: -9999 };
		let lastMove = 0;
		let suppressed = false;

		// Capture phase: links and buttons in the panel sit above the canvas and may stop
		// propagation, but the field still has to calm down under them to keep them readable.
		const onOver = (e: MouseEvent) => {
			const t = e.target;
			suppressed = t instanceof Element && !!t.closest('a,button,[role="button"]');
		};
		document.addEventListener("mouseover", onOver, true);

		const onMove = (e: MouseEvent) => {
			lastMove = performance.now();
			const r = boxEl().getBoundingClientRect();
			m.x = e.clientX - r.left;
			m.y = e.clientY - r.top;
		};
		const onLeave = () => {
			m.x = -9999;
			m.y = -9999;
		};
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseleave", onLeave);

		let { dark: isDark, ink } = readInk();
		const themeObserver = new MutationObserver(() => {
			({ dark: isDark, ink } = readInk());
		});
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		let frame = 0;

		const draw = () => {
			const now = performance.now();
			const idle = now - lastMove > 520;
			const quiet = idle || suppressed;
			// rare ambient blink so the field is never fully dead
			if (!reduced && !quiet && Math.random() < 0.02) {
				const bi = Math.floor(Math.random() * cols);
				const bj = Math.floor(Math.random() * rows);
				const bidx = bj * cols + bi;
				if (heat[bidx] < 0.05) {
					heat[bidx] = 0.34;
					gid[bidx] = roll(bi, bj, now);
					born[bidx] = now;
				}
			}

			const k = intensity;
			ctx.clearRect(0, 0, w, h);
			ctx.font = "10.5px 'Geist Mono Variable', ui-monospace, SFMono-Regular, monospace";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			const restA = (isDark ? 0.05 : 0.055) * k;
			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					const idx = j * cols + i;
					const x = i * CW + CW / 2;
					const y = j * CH + CH / 2;
					if (!reduced && !quiet && m.x > -999) {
						const d = Math.hypot(x - m.x, y - m.y);
						if (d < R) {
							const target = (1 - d / R) ** 1.8;
							if (heat[idx] < 0.04) {
								gid[idx] = roll(i, j, now);
								born[idx] = now;
							}
							if (target > heat[idx]) heat[idx] = target;
						}
					}
					const ht = heat[idx];
					if (ht > 0.03) {
						// Scramble: a freshly woken cell keeps re-rolling for 200ms before it settles.
						const age = now - born[idx];
						if (age < 200 && (frame & 3) === 0) gid[idx] = roll(i, j, now + idx);
						const near = ht > 0.78;
						ctx.fillStyle = `rgba(${near ? accent : ink},${Math.min(0.6, restA + ht * 0.46 * k)})`;
						ctx.fillText(GLYPHS[gid[idx] % GLYPHS.length], x, y);
						// Over a link the field has to get out of the way, so it clears in
						// ~0.7s rather than the ~2s the design's 0.972 would take — still an
						// ease-out, but short enough not to compete with what is being read.
						heat[idx] = ht * (suppressed ? 0.92 : idle ? 0.978 : 0.955);
					} else if (((i + j) & 1) === 0) {
						ctx.fillStyle = `rgba(${ink},${restA * 0.75})`;
						ctx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4);
					}
				}
			}
		};

		if (reduced) {
			// Static dot grid only — no loop at all, so one late redraw has to stand in for
			// the frames that would otherwise pick up the settled layout.
			draw();
			timers.push(
				setTimeout(() => {
					checkSize();
					draw();
				}, 300),
			);
		} else {
			const tick = () => {
				if ((frame++ & 15) === 0) checkSize();
				draw();
				raf = requestAnimationFrame(tick);
			};
			tick();
		}

		return () => {
			cancelAnimationFrame(raf);
			cancelAnimationFrame(firstFrame);
			for (const t of timers) clearTimeout(t);
			ro.disconnect();
			themeObserver.disconnect();
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseleave", onLeave);
			document.removeEventListener("mouseover", onOver, true);
		};
	});
</script>

<div bind:this={host} class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
	<canvas bind:this={canvas} aria-hidden="true" class="absolute inset-0 block"></canvas>
</div>
