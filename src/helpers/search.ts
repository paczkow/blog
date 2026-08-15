import Fuse from "fuse.js";

const KEYS = ["title", "description"];

export const createSearch = <T extends object>(posts: T[]) => {
	const fuse = new Fuse(posts, {
		keys: KEYS,
		useExtendedSearch: true,
	});

	return (query: string) => {
		if (query.length === 0) {
			return posts;
		}

		return fuse
			.search({
				$or: [{ title: `'${query}` }, { description: `'${query}` }],
			})
			.map((record) => record.item);
	};
};
