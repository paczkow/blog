import { clsx } from "clsx";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
};

export const Button = ({ children, active, onClick }: Props) => {
  const classes = clsx(
    "rounded-md border border-sand-8 px-4 py-2 text-sm transition-colors duration-300 cursor-pointer",
    active
      ? "text-sand-2 bg-sand-9 dark:bg-sand-12"
      : "text-sand-10 hover:bg-sand-3 dark:hover:bg-sand-5 hover:text-sand-12",
  );

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
};
