import { useState } from "react";

import { getSortedByDate } from "@/helpers/posts.ts";
import type { Post } from "@/models.ts";
import { SearchInput } from "./Input";
import { SearchList } from "./List";
import { useSearch } from "./useSearch";

export const Search = ({
  icons,
  posts,
}: {
  icons?: React.ReactNode;
  posts: Post[];
}) => {
  const [query, setQuery] = useState("");

  const { search } = useSearch(posts);

  const filteredPosts = getSortedByDate(search(query));

  return (
    <>
      <div className="sticky col-span-full mb-8 flex flex-col gap-4 lg:top-(--nav-height) lg:col-start-1 lg:col-end-2 lg:mb-0 lg:h-[calc(100vh-242px)]">
        <h2 className="text-sand-12 mb-4 font-semibold">Writing</h2>
        <p className="text-sand-11 mb-4">Find all my writing here</p>
        <SearchInput
          onChange={(query) => {
            setQuery(query);
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
