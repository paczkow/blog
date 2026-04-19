type Node = { x: number; y: number };

const LEFT: Node[] = [
	{ x: 30, y: 40 },
	{ x: 65, y: 25 },
	{ x: 55, y: 75 },
	{ x: 95, y: 55 },
];

const RIGHT: Node[] = [
	{ x: 175, y: 35 },
	{ x: 215, y: 55 },
	{ x: 195, y: 95 },
	{ x: 240, y: 90 },
];

const LEFT_EDGES: [number, number][] = [
	[0, 1],
	[0, 2],
	[1, 3],
	[2, 3],
];

const RIGHT_EDGES: [number, number][] = [
	[0, 1],
	[1, 2],
	[1, 3],
	[2, 3],
];

const BREAK_LEFT = { x: 95, y: 55 };
const BREAK_LEFT_END = { x: 122, y: 60 };
const BREAK_RIGHT_START = { x: 148, y: 65 };
const BREAK_RIGHT = { x: 175, y: 35 };

export const EmptyResults = ({ query }: { query: string }) => {
	const trimmed = query.trim();

	return (
		<div className="flex flex-col items-center gap-8 px-4 py-16 text-center">
			<svg
				viewBox="0 0 270 130"
				width="270"
				height="130"
				aria-hidden="true"
				className="text-sand-9 dark:text-sand-8"
			>
				<title>A broken connection between two clusters</title>

				{LEFT_EDGES.map(([a, b], i) => (
					<line
						key={`l-${i}`}
						x1={LEFT[a].x}
						y1={LEFT[a].y}
						x2={LEFT[b].x}
						y2={LEFT[b].y}
						stroke="currentColor"
						strokeWidth="0.8"
						opacity="0.55"
					/>
				))}
				{RIGHT_EDGES.map(([a, b], i) => (
					<line
						key={`r-${i}`}
						x1={RIGHT[a].x}
						y1={RIGHT[a].y}
						x2={RIGHT[b].x}
						y2={RIGHT[b].y}
						stroke="currentColor"
						strokeWidth="0.8"
						opacity="0.55"
					/>
				))}

				<line
					x1={BREAK_LEFT.x}
					y1={BREAK_LEFT.y}
					x2={BREAK_LEFT_END.x}
					y2={BREAK_LEFT_END.y}
					stroke="currentColor"
					strokeWidth="0.8"
					strokeDasharray="2 2"
					opacity="0.7"
				/>
				<line
					x1={BREAK_RIGHT_START.x}
					y1={BREAK_RIGHT_START.y}
					x2={BREAK_RIGHT.x}
					y2={BREAK_RIGHT.y}
					stroke="currentColor"
					strokeWidth="0.8"
					strokeDasharray="2 2"
					opacity="0.7"
				/>

				<g transform="translate(135 62.5) rotate(15)">
					<line
						x1="-5"
						y1="-5"
						x2="5"
						y2="5"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
					/>
					<line
						x1="-5"
						y1="5"
						x2="5"
						y2="-5"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
					/>
				</g>

				{LEFT.map((n, i) => (
					<circle
						key={`ln-${i}`}
						cx={n.x}
						cy={n.y}
						r="2.8"
						fill="currentColor"
					/>
				))}
				{RIGHT.map((n, i) => (
					<circle
						key={`rn-${i}`}
						cx={n.x}
						cy={n.y}
						r="2.8"
						fill="currentColor"
					/>
				))}

				<circle
					cx={BREAK_LEFT_END.x}
					cy={BREAK_LEFT_END.y}
					r="1.8"
					fill="currentColor"
					opacity="0.4"
				>
					<animate
						attributeName="opacity"
						values="0.2;0.6;0.2"
						dur="2.4s"
						repeatCount="indefinite"
					/>
				</circle>
				<circle
					cx={BREAK_RIGHT_START.x}
					cy={BREAK_RIGHT_START.y}
					r="1.8"
					fill="currentColor"
					opacity="0.4"
				>
					<animate
						attributeName="opacity"
						values="0.6;0.2;0.6"
						dur="2.4s"
						repeatCount="indefinite"
					/>
				</circle>
			</svg>

			<div className="flex flex-col gap-2 max-w-[32ch]">
				<p className="font-serif italic text-sand-12 text-2xl leading-snug">
					{trimmed ? <>The thread is broken.</> : <>The archive is quiet.</>}
				</p>
				<p className="text-sand-11 text-sm leading-relaxed">
					{trimmed ? (
						<>
							No essays connect to{" "}
							<span className="text-sand-12 font-medium">"{trimmed}"</span>.
							Try another word.
						</>
					) : (
						<>Nothing here yet — check back soon.</>
					)}
				</p>
			</div>
		</div>
	);
};
