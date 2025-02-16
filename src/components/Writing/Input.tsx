import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "./Button.tsx";

const WRITING_TYPES = ["essay", "note"] as const;

interface Props {
  selected: {
    types: (typeof WRITING_TYPES)[number][];
    topics: string[];
  };
  topics: string[];
  onChange: (query: string) => void;
  onSelect: (value: {
    topics: string[];
    types: (typeof WRITING_TYPES)[number][];
  }) => void;
}

export const Options = ({ topics, selected, onChange, onSelect }: Props) => {
  const [searchQuery, setQuery] = useState("");

  const debounced = useDebouncedCallback((query: string) => {
    onChange(query);
  }, 100);

  const handleTopicSelect = (topic: string) => {
    const isSelected = selected.topics.includes(topic);

    const newSearchQuery = {
      ...selected,
      topics: isSelected
        ? selected.topics.filter((t) => t !== topic)
        : [...selected.topics, topic],
    };

    onSelect(newSearchQuery);
  };

  const handleTypeSelect = (type: (typeof WRITING_TYPES)[number]) => {
    const isSelected = selected.types.includes(type);

    const newSearchQuery = {
      ...selected,
      types: isSelected
        ? selected.types.filter((t) => t !== type)
        : [...selected.types, type],
    };

    onSelect(newSearchQuery);
  };

  return (
    <section className="flex flex-col gap-8">
      <input
        className="w-full appearance-none rounded-lg bg-white dark:bg-sand-6 dark:text-sand-11 border border-sand-6 px-3 py-2 text-sm  focus:outline-sand-8"
        placeholder="Search topics..."
        onChange={(e) => {
          setQuery(e.target.value);
          debounced(e.target.value);
        }}
        value={searchQuery}
      />
      <div>
        <h2 className="mb-4 text-sand-12">Types</h2>
        <div className="flex gap-2">
          {WRITING_TYPES.map((type) => (
            <Button
              key={type}
              active={selected.types.includes(type)}
              onClick={() => handleTypeSelect(type)}
            >
              <span className="capitalize">{type}</span>
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-sand-12">Topics</h2>
        <div className="flex gap-2 flex-wrap">
          {topics.map((topic) => (
            <Button
              key={topic}
              active={selected.topics.includes(topic)}
              onClick={() => handleTopicSelect(topic)}
            >
              {topic}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
