import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "./Button.tsx";

interface Props {
  selectedTopics: string[];
  topics: string[];
  onChange: (query: string) => void;
  onSelect: (topics: string[]) => void;
}

export const Options = ({ topics, selectedTopics, onChange, onSelect }: Props) => {
  const [searchQuery, setQuery] = useState("");

  const debounced = useDebouncedCallback((query: string) => {
    onChange(query);
  }, 100);

  const handleTopicSelect = (topic: string) => {
    const isSelected = selectedTopics.includes(topic);

    const newTopics = isSelected
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];

    onSelect(newTopics);
  };

  return (
    <section className="flex flex-col gap-8">
      <input
        className="w-full appearance-none rounded-lg bg-white dark:bg-sand-6 dark:text-sand-11 border border-sand-6 px-3 py-2 focus:outline-sand-8"
        placeholder="Search topics..."
        onChange={(e) => {
          setQuery(e.target.value);
          debounced(e.target.value);
        }}
        value={searchQuery}
      />
      <div>
        <h2 className="mb-4 text-sand-12">Topics</h2>
        <div className="flex gap-2 flex-wrap">
          {topics.map((topic) => (
            <Button
              key={topic}
              active={selectedTopics.includes(topic)}
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
