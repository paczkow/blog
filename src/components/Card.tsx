import { clsx } from "clsx";
import { useState } from "react";

type Props = {
  id: string;
  date: Date;
  title: string;
  description: string;
  readTime?: number;
};

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
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
    <a href={`/writing/${id}`} className="block no-underline">
      <article
        onClick={handleClick}
        className={clsx(
          "relative block cursor-pointer px-4 py-6 rounded-md will-change-transform",
          "transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:opacity-60",
          "hover:!opacity-100 hover:translate-x-1",
          isActive && "bg-sand-3 dark:bg-sand-5",
        )}
      >
        <div className="flex items-baseline justify-between gap-4 mb-3 text-sand-10 text-sm">
          <time
            className="tabular-nums"
            dateTime={new Date(date).toISOString()}
          >
            {formatDate(date)}
          </time>
          {readTime ? (
            <span className="tabular-nums">{readTime} min read</span>
          ) : null}
        </div>
        <h3 className="font-display text-sand-12 text-xl leading-tight mb-2">
          {title}
        </h3>
        <p className="text-sand-11 leading-relaxed">{description}</p>
      </article>
    </a>
  );
};
