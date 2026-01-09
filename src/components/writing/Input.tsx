import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  onChange: (query: string) => void;
}

export const SearchInput = ({ onChange }: Props) => {
  const [searchQuery, setQuery] = useState("");

  const debounced = useDebouncedCallback((query: string) => {
    onChange(query);
  }, 100);

  return (
    <input
      className="w-full appearance-none rounded-lg bg-white dark:bg-sand-6 dark:text-sand-11 border border-sand-6 px-3 py-2 focus:outline-sand-8"
      placeholder="Search..."
      onChange={(e) => {
        setQuery(e.target.value);
        debounced(e.target.value);
      }}
      value={searchQuery}
    />
  );
};
