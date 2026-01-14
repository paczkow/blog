import { clsx } from "clsx";
import { useState } from "react";

type Props = {
  id: string;
  date: Date;
  title: string;
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
  "group-hover:opacity-20",
  "group-hover:hover:opacity-100",
].join(" ");

export const Card = (props: Props) => {
  const { id, date, title, description } = props;
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    setTimeout(() => {
      setIsActive(false);
    }, 50);
  };


  return (
    <a
      href={`/writing/${id}`}
      className={clsx("block no-underline group/card")}
    >
      <article
        onClick={handleClick}
        className={clsx(
          baseClasses,
          hoverInteractionClasses,
          groupHoverClasses,
          "transition-colors duration-50 ease-in-out",
          isActive && "bg-sand-3 dark:bg-sand-5"
        )}
      >
        <time
          className="hidden min-w-[120px] text-sm text-sand-11 md:block"
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
          <h3 className="text-sand-12 font-medium">
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
