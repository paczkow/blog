import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchQuery as storeQuery } from "@/stores/searchQuery";

export const SearchSidebar = ({
	icons,
}: {
	icons?: React.ReactNode;
}) => {
	const [searchQuery, setQuery] = useState(storeQuery.get());

	const debounced = useDebouncedCallback((query: string) => {
		console.log('debounced', query)
		storeQuery.set(query);
	}, 100);

	return (
		<div className="flex flex-col gap-4 h-full">
			<h2 className="text-sand-12 mb-4 font-semibold">Writing</h2>
			<p className="text-sand-11 mb-4">Find all my writing here</p>
			<input
				className="w-full appearance-none rounded-lg bg-white dark:bg-sand-6 dark:text-sand-11 border border-sand-6 px-3 py-2 focus:outline-sand-8"
				placeholder="Search..."
				onChange={(e) => {
					setQuery(e.target.value);
					debounced(e.target.value);
				}}
				value={searchQuery}
			/>
			{icons}
		</div>
	);
};
