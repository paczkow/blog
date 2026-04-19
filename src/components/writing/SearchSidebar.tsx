import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchQuery as storeQuery } from "@/stores/searchQuery";

export const SearchSidebar = ({ count }: { count?: number }) => {
	const [searchQuery, setQuery] = useState(storeQuery.get());

	const debounced = useDebouncedCallback((query: string) => {
		storeQuery.set(query);
	}, 100);

	return (
		<div className="flex flex-col gap-3">
			<input
				className="w-full appearance-none border-0 border-b border-sand-6 bg-transparent px-0 py-2 text-sand-12 placeholder:text-sand-9 focus:border-sand-12 focus:outline-none transition-colors"
				placeholder="Search essays…"
				onChange={(e) => {
					setQuery(e.target.value);
					debounced(e.target.value);
				}}
				value={searchQuery}
			/>
			{typeof count === "number" && (
				<span className="text-xs text-sand-10 tabular-nums">
					{count} {count === 1 ? "essay" : "essays"}
				</span>
			)}
		</div>
	);
};
