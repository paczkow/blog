import { useState } from "react";
import { Options } from "./Input";
import { useSearch } from "./useSearch";
import { SearchList } from "./List";
import { getSortedByDate } from "@/helpers/posts";
import type { Post } from "@/models";

export const Search = ({
  icons,
  topics,
  posts,
}: {
  icons?: React.ReactNode;
  topics: string[];
  posts: Post[];
}) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{
    topics: string[];
    types: ("essay" | "note")[];
  }>({
    topics: [],
    types: [],
  });

  const { search } = useSearch(posts);

  const filteredPosts = getSortedByDate(
    search(query, selected.topics, selected.types),
  );

  return (
    <>
      <div className="sticky col-span-full mb-8 flex flex-col gap-4 lg:top-(--nav-height) lg:col-start-1 lg:col-end-2 lg:mb-0 lg:h-[calc(100vh-242px)]">
        <h2 className="text-sand-12 mb-4 font-semibold">Writing</h2>
        <p className="text-sand-11 mb-4">Find all my writing here</p>
        <Options
          topics={topics}
          selected={selected}
          onChange={(query) => {
            setQuery(query);
          }}
          onSelect={(selected) => {
            setSelected(selected);
          }}
        />
        {icons}
      </div>
      <div className="col-span-full flex flex-col gap-12 lg:col-start-2 lg:col-end-3 mr-[2px]">
        <section id="articles" className="flex flex-1 flex-col gap-12">
          <SearchList posts={filteredPosts} />
        </section>
      </div>
    </>
  );
};
