import { useStore } from "@nanostores/react";

import { getSortedByDate } from "@/helpers/posts.ts";
import type { Post } from "@/models.ts";
import { searchQuery } from "@/stores/searchQuery";
import { useSearch } from "./useSearch";
import { Card } from "../Card";

export const SearchResults = ({ posts }: { posts: Post[] }) => {
	const query = useStore(searchQuery);
	const { search } = useSearch(posts);

	const filteredPosts = getSortedByDate(search(query));

	return (
		<section id="articles" className="flex flex-1 flex-col gap-12">
			<div className="group flex flex-col gap-8">
				{!filteredPosts.length && (
					<h2 className="text-sand-12">No results found</h2>
				)}
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
