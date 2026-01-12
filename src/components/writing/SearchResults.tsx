import { useStore } from "@nanostores/react";

import { getSortedByDate } from "@/helpers/posts.ts";
import type { Post } from "@/models.ts";
import { searchQuery } from "@/stores/searchQuery";
import { SearchList } from "./List";
import { useSearch } from "./useSearch";

export const SearchResults = ({ posts }: { posts: Post[] }) => {
	const query = useStore(searchQuery);
	const { search } = useSearch(posts);

	const filteredPosts = getSortedByDate(search(query));

	return (
		<section id="articles" className="flex flex-1 flex-col gap-12">
			<SearchList posts={filteredPosts} />
		</section>
	);
};
