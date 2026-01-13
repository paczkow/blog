import { clsx } from "clsx";

type Props = {
  id: string;
  date: Date;
  title: string;
  readTime: number;
  description: string;
};

const baseClasses = [
  "relative",
  "flex",
  "items-baseline",
  "cursor-pointer",
  "gap-16",
  "p-4",
  "rounded-md",
].join(" ");


/**
 * Hover device interaction: Animated ::before pseudo-element
 * @media(hover:hover) = primary input can hover (mouse/trackpad)
 */
const hoverInteractionClasses = [
  // Pseudo-element setup
  "before:content-['']",
  "before:absolute",
  "before:inset-[-2px]",
  "before:rounded-md",
  "before:-z-10",
  "before:border",
  "before:border-sand-3",
  "before:bg-sand-2",
  "dark:before:border-sand-5",
  "dark:before:bg-sand-4",
  "before:opacity-0",
  "before:transition-opacity",
  "before:duration-300",
  "before:ease-in-out",
  "hover:before:opacity-100",
].join(" ");

/**
 * Group hover effect: Dim siblings when one card is hovered
 * Only active on hover-capable devices
 */
const groupHoverClasses = [
  "transition-opacity",
  "duration-300",
  "ease-in-out",
  "group-hover:opacity-20",
  "group-hover:hover:opacity-100",
].join(" ");

export const Card = (props: Props) => {
  const { id, date, title, description } = props;

  return (
    <a href={`/writing/${id}`} className="block no-underline group/card">
      <article
        className={clsx(
          baseClasses,
          hoverInteractionClasses,
          groupHoverClasses
        )}
      >
        <time
          className="hidden min-w-max text-sm text-sand-11 md:block"
          dateTime={new Date(date).toISOString()}
        >
          {
            date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }
        </time>
        <div className="flex flex-col gap-4">
          <time
            className="text-sand-11 text-sm md:hidden"
            dateTime={new Date(date).toISOString()}
          >
            {
              date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }
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
