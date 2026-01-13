import { clsx } from "clsx";

type Props = {
  id: string;
  date: Date;
  title: string;
  readTime: number;
  description: string;
};

const formatDate = (date: Date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Core layout and structural styles - applied to all devices
 */
const layoutClasses = [
  "relative",
  "flex",
  "items-baseline",
  "cursor-pointer",
  "gap-16",
  "p-4",
  "rounded-md",
].join(" ");

/**
 * Touch device interaction: Simple background on tap
 * @media(hover:none) = primary input cannot hover (touch screens)
 * Uses hover: because touch devices simulate hover on tap
 */
const touchInteractionClasses = [
  "[@media(hover:none)]:hover:bg-sand-3",
  "[@media(hover:none)]:dark:hover:bg-sand-6",
].join(" ");

/**
 * Hover device interaction: Animated ::before pseudo-element
 * @media(hover:hover) = primary input can hover (mouse/trackpad)
 */
const hoverInteractionClasses = [
  // Pseudo-element setup
  "[@media(hover:hover)]:before:content-['']",
  "[@media(hover:hover)]:before:absolute",
  "[@media(hover:hover)]:before:inset-[-2px]",
  "[@media(hover:hover)]:before:rounded-md",
  "[@media(hover:hover)]:before:-z-10",
  // Light mode colors
  "[@media(hover:hover)]:before:border",
  "[@media(hover:hover)]:before:border-sand-3",
  "[@media(hover:hover)]:before:bg-sand-2",
  // Dark mode colors
  "[@media(hover:hover)]:dark:before:border-sand-5",
  "[@media(hover:hover)]:dark:before:bg-sand-4",
  // Hidden by default
  "[@media(hover:hover)]:before:opacity-0",
  // Transition
  "[@media(hover:hover)]:before:transition-opacity",
  "[@media(hover:hover)]:before:duration-300",
  "[@media(hover:hover)]:before:ease-in-out",
  // Show on hover
  "[@media(hover:hover)]:hover:before:opacity-100",
].join(" ");

/**
 * Group hover effect: Dim siblings when one card is hovered
 * Only active on hover-capable devices
 */
const groupHoverClasses = [
  "[@media(hover:hover)]:transition-opacity",
  "[@media(hover:hover)]:duration-300",
  "[@media(hover:hover)]:ease-in-out",
  "[@media(hover:hover)]:group-hover:opacity-20",
  "[@media(hover:hover)]:group-hover:hover:opacity-100",
].join(" ");

export const Card = (props: Props) => {
  const { id, date, title, description } = props;
  const formattedDate = formatDate(date);

  return (
    <a href={`/writing/${id}`} className="block no-underline group/card">
      <article
        className={clsx(
          layoutClasses,
          touchInteractionClasses,
          hoverInteractionClasses,
          groupHoverClasses
        )}
      >
        <time
          className="hidden min-w-[80px] text-sm text-neutral-500 md:block"
          dateTime={new Date(date).toISOString()}
        >
          {formattedDate}
        </time>
        <div className="flex flex-col gap-4">
          <time
            className="text-sand-10 text-sm md:hidden"
            dateTime={new Date(date).toISOString()}
          >
            {formattedDate}
          </time>
          <h3 className="text-sand-12 font-[450] ">
            {title}
          </h3>
          <div>
            <p className="text-sand-11">{description}</p>
          </div>
        </div>
      </article>
    </a>
  );
};
