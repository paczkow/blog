import { clsx } from "clsx";
import { useMemo, useState } from "react";

type HeatmapPost = {
  id: string;
  title: string;
  date: string;
};

type Props = {
  posts: HeatmapPost[];
  weeks?: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const formatTooltipDate = (d: Date) =>
  d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const WritingHeatmap = ({ posts, weeks = 26 }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const { grid, monthMarkers } = useMemo(() => {
    const byDay = new Map<string, HeatmapPost[]>();
    for (const post of posts) {
      const key = toKey(new Date(post.date));
      const list = byDay.get(key);
      if (list) list.push(post);
      else byDay.set(key, [post]);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    const totalDays = weeks * 7;
    const start = new Date(endOfWeek);
    start.setDate(endOfWeek.getDate() - (totalDays - 1));

    const cols: Array<
      Array<{
        date: Date;
        key: string;
        posts: HeatmapPost[];
        future: boolean;
      }>
    > = [];
    const markers: Array<{ col: number; label: string }> = [];
    let lastMonth = -1;

    for (let w = 0; w < weeks; w++) {
      const col: Array<{
        date: Date;
        key: string;
        posts: HeatmapPost[];
        future: boolean;
      }> = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
        const key = toKey(date);
        col.push({
          date,
          key,
          posts: byDay.get(key) ?? [],
          future: date.getTime() > today.getTime(),
        });
      }
      cols.push(col);

      const firstOfCol = col[0].date;
      if (firstOfCol.getMonth() !== lastMonth && firstOfCol.getDate() <= 7) {
        markers.push({ col: w, label: MONTH_LABELS[firstOfCol.getMonth()] });
        lastMonth = firstOfCol.getMonth();
      }
    }

    return { grid: cols, monthMarkers: markers };
  }, [posts, weeks]);

  const hoveredCell = useMemo(() => {
    if (!hovered) return null;
    for (const col of grid) {
      for (const cell of col) {
        if (cell.key === hovered) return cell;
      }
    }
    return null;
  }, [hovered, grid]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sand-11 text-xs uppercase tracking-[0.2em] font-medium">
          Garden
        </h2>
        <span className="text-sand-10 text-xs">last {weeks} weeks</span>
      </div>

      <div className="relative">
        <div
          className="relative flex gap-[3px]"
          onMouseLeave={() => setHovered(null)}
        >
          {grid.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-[3px]">
              {col.map((cell) => {
                const count = cell.posts.length;
                const isHovered = hovered === cell.key;
                return (
                  <button
                    type="button"
                    key={cell.key}
                    aria-label={`${formatTooltipDate(cell.date)}: ${count} ${count === 1 ? "note" : "notes"}`}
                    onMouseEnter={() => setHovered(cell.key)}
                    onFocus={() => setHovered(cell.key)}
                    onBlur={() => setHovered(null)}
                    className={clsx(
                      "h-[11px] w-[11px] rounded-[2px] transition-colors duration-150",
                      cell.future
                        ? "bg-transparent"
                        : count === 0
                          ? "bg-sand-3 dark:bg-sand-4 hover:bg-sand-5 dark:hover:bg-sand-6"
                          : count === 1
                            ? "bg-sand-9 hover:bg-sand-11"
                            : "bg-sand-11 hover:bg-sand-12",
                      isHovered &&
                        "ring-1 ring-sand-12 dark:ring-sand-11 ring-offset-1 ring-offset-sand-1 dark:ring-offset-sand-2",
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-2 flex gap-[3px] text-[10px] text-sand-10">
          {grid.map((_, ci) => {
            const marker = monthMarkers.find((m) => m.col === ci);
            return (
              <div key={ci} className="w-[11px] text-center">
                {marker ? marker.label : ""}
              </div>
            );
          })}
        </div>

        {hoveredCell && (
          <div
            className="absolute z-20 min-w-[200px] max-w-[280px] rounded-md border border-sand-4 dark:border-sand-6 bg-sand-1 dark:bg-sand-3 p-3 shadow-lg pointer-events-auto"
            style={{
              left: 0,
              bottom: "calc(100% + 8px)",
            }}
          >
            <div className="text-sand-12 text-sm font-medium mb-1">
              {formatTooltipDate(hoveredCell.date)}
            </div>
            {hoveredCell.posts.length === 0 ? (
              <div className="text-sand-10 text-xs">No writing</div>
            ) : (
              <>
                <div className="text-sand-11 text-xs mb-1">
                  {hoveredCell.posts.length}{" "}
                  {hoveredCell.posts.length === 1 ? "note" : "notes"}:
                </div>
                <ul className="flex flex-col gap-1">
                  {hoveredCell.posts.map((p) => (
                    <li key={p.id}>
                      <a
                        href={`/writing/${p.id}`}
                        className="text-sand-12 text-sm leading-snug underline underline-offset-2 decoration-sand-7 hover:decoration-sand-12"
                      >
                        {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
