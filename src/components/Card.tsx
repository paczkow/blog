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

export const Card = (props: Props) => {
  const { id, date, title, description } = props;

  const baseClasses =
    "relative flex items-baseline cursor-pointer gap-16 px-4 py-3 rounded-md transition-colors duration-200 hover:bg-sand-3 md:hover:bg-transparent md:[@media(hover:none)]:active:bg-sand-3 md:py-4 md:p-6";
  const transitionClasses =
    "transition-opacity duration-300 ease-in-out group-hover:opacity-20 group-hover:hover:opacity-100";
  const beforeClasses =
    "md:before:border-sand-3 md:before:bg-sand-2 md:dark:before:border-sand-5 md:dark:before:bg-sand-4 md:before:absolute md:before:-z-10 md:before:border md:before:opacity-0 md:before:border-opacity-0 md:before:transition-opacity md:before:duration-300 md:before:ease-in-out md:before:content-[''] md:hover:before:opacity-100 md:before:inset-[-2px] md:before:rounded-md";

  const formattedDate = formatDate(date);

  return (
    <a href={`/writing/${id}`} className="block no-underline group/card">
      <article className={clsx(baseClasses, transitionClasses, beforeClasses)}>
        <time
          className="hidden min-w-[80px] text-sm text-neutral-500 md:block"
          dateTime={new Date(date).toISOString()}
        >
          {formattedDate}
        </time>
        <div className="flex flex-col gap-4">
          <h3 className="text-sand-12 font-[450] ">
            {title}
          </h3>
          <div>
            <p className="text-sand-11">{description}</p>
          </div>
          <div className="text-sand-10 flex gap-2 text-sm md:flex">
            <time
              className="black md:hidden"
              dateTime={new Date(date).toISOString()}
            >
              {formattedDate}
            </time>
          </div>
        </div>
      </article>
    </a>
  );
};
