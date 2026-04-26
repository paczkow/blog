import { useStore } from "@nanostores/react";

import { getSortedByDate } from "@/helpers/posts.ts";
import type { Post } from "@/models.ts";
import { searchQuery } from "@/stores/searchQuery";
import { useSearch } from "./useSearch";
import { Card } from "../Card";
import { EmptyResults } from "./EmptyResults";

export const SearchResults = ({ posts }: { posts: Post[] }) => {
	const query = useStore(searchQuery);
	const { search } = useSearch(posts);

	const filteredPosts = getSortedByDate(search(query));

	if (!filteredPosts.length) {
		return (
			<section id="articles" className="flex flex-1 flex-col">
				<EmptyResults query={query} />
			</section>
		);
	}

	return (
		<section id="articles" className="flex flex-1 flex-col gap-12">
			<div className="group flex flex-col divide-y divide-sand-3 dark:divide-sand-4">
				{filteredPosts.map((post) => (
					<Card
						id={post.id}
						key={post.id}
						title={post.title}
						description={post.description}
						date={post.date}
						readTime={post.readTime}
					/>
				))}
			</div>
		</section>
	);
};
