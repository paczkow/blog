import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

function usePressEffect() {
  const [isPressed, setIsPressed] = useState(false);
  const startRef = useRef({ time: 0, x: 0, y: 0 });

  const TIME_THRESHOLD = 250;
  const MOVE_THRESHOLD = 5;

  useEffect(() => {
    const handleUp = (e: PointerEvent) => {
      const { time, x, y } = startRef.current;
      if (time === 0) return;

      const duration = Date.now() - time;
      const distance = Math.hypot(e.clientX - x, e.clientY - y);

      if (duration < TIME_THRESHOLD && distance < MOVE_THRESHOLD) {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 100);
      }

      startRef.current = { time: 0, x: 0, y: 0 };
    };

    const handleCancel = () => {
      setIsPressed(false);
      startRef.current = { time: 0, x: 0, y: 0 };
    };

    console.log('xxxx')

    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);
    return () => {
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    startRef.current = { time: Date.now(), x: e.clientX, y: e.clientY };
  };

  return { isPressed, onPointerDown };
}

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

const pressedClasses = [
  "data-[pressed=true]:bg-sand-3",
  "dark:data-[pressed=true]:bg-sand-5",
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
  const { isPressed, onPointerDown } = usePressEffect();

  return (
    <a
      href={`/writing/${id}`}
      className={clsx("block no-underline group/card data-[pressed=true]:bg-red-500")}
      onPointerDown={onPointerDown}
    >
      <article
        data-pressed={isPressed}
        className={clsx(
          baseClasses,
          hoverInteractionClasses,
          pressedClasses,
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
          <h3 className="text-sand-12 font-[450]">
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
