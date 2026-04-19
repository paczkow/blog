import { clsx } from "clsx";
import { useState } from "react";

type Props = {
  id: string;
  date: Date;
  title: string;
  description: string;
  readTime?: number;
};

const baseClasses = [
  "relative",
  "block",
  "cursor-pointer",
  "px-4",
  "py-6",
  "rounded-md",
].join(" ");

const hoverInteractionClasses = [
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

const groupHoverClasses = [
  "transition-opacity",
  "duration-300",
  "ease-in-out",
  "group-hover:opacity-30",
  "group-hover:hover:opacity-100",
].join(" ");

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const Card = (props: Props) => {
  const { id, date, title, description, readTime } = props;
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 50);
  };

  return (
    <a href={`/writing/${id}`} className="block no-underline group/card">
      <article
        onClick={handleClick}
        className={clsx(
          baseClasses,
          hoverInteractionClasses,
          groupHoverClasses,
          "transition-colors duration-50 ease-in-out",
          isActive && "bg-sand-3 dark:bg-sand-5",
        )}
      >
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <time
            className="text-sand-11 text-xs uppercase tracking-wider tabular-nums"
            dateTime={new Date(date).toISOString()}
          >
            {formatDate(date)}
          </time>
          {readTime ? (
            <span className="text-sand-10 text-xs tabular-nums">
              {readTime} min read
            </span>
          ) : null}
        </div>
        <h3 className="font-serif text-sand-12 text-2xl md:text-3xl leading-tight mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-sand-11 leading-relaxed">{description}</p>
      </article>
    </a>
  );
};
