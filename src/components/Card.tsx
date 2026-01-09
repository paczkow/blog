import { clsx } from "clsx";

type Props = {
  id: string;
  date: Date;
  title: string;
  topics: string[];
  readTime: number;
  description: string;
};

export const Card = (props: Props) => {
  const { id, date, title, topics, readTime, description } = props;

  const baseClasses =
    "relative flex cursor-pointer gap-16 md:ml-[-24px] md:rounded md:py-4 md:p-6";
  const transitionClasses =
    "transition-opacity duration-300 ease-in-out group-hover:opacity-20 group-hover:hover:opacity-100";
  const beforeClasses =
    "before:border-sand-3 before:bg-sand-2 dark:before:border-sand-5 dark:before:bg-sand-4 before:absolute before:-z-10 before:border before:opacity-20 before:border-opacity-30 before:transition-opacity before:duration-300 before:ease-in-out before:content-[''] hover:before:opacity-100 md:before:opacity-0 md:before:border-opacity-0 md:before:inset-[-2px] md:before:rounded-md";

  return (
    <a href={`/writing/${id}`} className="block no-underline group/card">
      <article className={clsx(baseClasses, transitionClasses, beforeClasses)}>
        <time
          className="hidden min-w-[80px] text-sm text-neutral-500 md:block"
          dateTime={date.toISOString()}
        >
          {date.toLocaleDateString()}
        </time>
        <div className="flex flex-col gap-4">
          <h3 className="text-sand-12 group-active/card:underline lg:group-active/card:no-underline">
            {title}
          </h3>
          <div className="text-sand-10 flex gap-2 text-sm md:flex">
            <time className="black md:hidden" dateTime={date.toISOString()}>
              {date.toLocaleDateString()}
            </time>
            <span>{readTime} min read</span>
          </div>
          <div>
            <p className="text-sand-11 text-sm">{description}</p>
          </div>
          <div className="flex gap-4">
            {topics.map((topic) => (
              <span key={topic} className="text-sm text-neutral-500">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </article>
    </a>
  );
};
